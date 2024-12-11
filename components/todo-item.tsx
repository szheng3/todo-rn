import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react-native";
import { Text } from "react-native";
import { Pressable } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
}

export function TodoItem({
  id,
  text,
  completed,
  onToggle,
  onDelete,
  isDark,
}: TodoItemProps) {
  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
      <Pressable onPress={() => onToggle(id)}>
        <Box
          className={`flex-row items-center justify-between p-4 rounded-lg ${
            completed ? "bg-green-500" : isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Box className="flex-row items-center space-x-4 flex-1">
            <Box
              className={`w-6 h-6 rounded-full items-center justify-center ${
                completed ? "bg-white" : isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              {completed && (
                <Check size={16} color={completed ? "#22c55e" : "#666"} />
              )}
            </Box>
            <Text
              className={`ml-2 text-lg flex-1 ${
                completed
                  ? "line-through text-white"
                  : isDark
                  ? "text-white"
                  : "text-gray-700"
              }`}
              numberOfLines={2}
            >
              {text}
            </Text>
          </Box>
          <Button
            variant="link"
            size="sm"
            onPress={() => onDelete(id)}
            className="ml-2"
          >
            <Trash2 size={18} color="#ef4444" />
          </Button>
        </Box>
      </Pressable>
    </Animated.View>
  );
}
