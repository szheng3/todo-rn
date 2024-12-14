import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback } from "react";
import { Platform, Text } from "react-native";
import { initWhisper, AudioSessionIos } from "whisper.rn";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";

interface WhisperContext {
  transcribeRealtime: (config: any) => Promise<{
    stop: () => void;
    subscribe: (callback: (result: any) => void) => void;
  }>;
}

export const Voice = () => {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [stopRecording, setStopRecording] = useState<(() => void) | null>(null);

  const initializeWhisper = async (): Promise<WhisperContext> => {
    try {
      return await initWhisper({
        filePath: require("../../assets/ggml-tiny.en.bin"),
        coreMLModelAsset:
          Platform.OS === "ios"
            ? {
                filename: "ggml-tiny.en-encoder.mlmodelc",
                assets: [
                  require("../../assets/ggml-tiny.en-encoder.mlmodelc/weights/weight.bin"),
                  require("../../assets/ggml-tiny.en-encoder.mlmodelc/model.mil"),
                  require("../../assets/ggml-tiny.en-encoder.mlmodelc/coremldata.bin"),
                ],
              }
            : undefined,
      });
    } catch (error) {
      console.error("Failed to initialize Whisper:", error);
      throw error;
    }
  };

  const toggleRecording = useCallback(async () => {
    try {
      if (isRecording && stopRecording) {
        stopRecording();
        setStopRecording(null);
        setIsRecording(false);
        return;
      }

      const whisperContext = await initializeWhisper();
      const { stop, subscribe } = await whisperContext.transcribeRealtime({
        audioSessionOnStartIos: {
          category: AudioSessionIos.Category.PlayAndRecord,
          options: [AudioSessionIos.CategoryOption.MixWithOthers],
          mode: AudioSessionIos.Mode.Default,
        },
      });

      setStopRecording(() => stop);
      setIsRecording(true);

      subscribe((result) => {
        setTranscription(result?.data?.result ?? "");
      });
    } catch (error) {
      console.error("Error during recording:", error);
      setIsRecording(false);
      setStopRecording(null);
    }
  }, [isRecording, stopRecording]);

  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <ScrollView>
        <Box className="p-4">
          <Center>
            <Button
              size="lg"
              variant={isRecording ? "outline" : "solid"}
              className={`my-4 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primary-500 hover:bg-primary-600"
              }`}
              onPress={toggleRecording}
            >
              <ButtonText className="text-typography-50">
                {isRecording ? "Stop Recording" : "Start Recording"}
              </ButtonText>
            </Button>

            {transcription && (
              <Box className="w-full p-4 mt-4 rounded-lg bg-background-100">
                <Text className="text-base text-typography-900">
                  {transcription}
                </Text>
              </Box>
            )}
          </Center>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Voice;
