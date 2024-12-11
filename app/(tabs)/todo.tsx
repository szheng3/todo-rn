import { TodoApp } from "@/components/todo-app";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodoScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box style={{ flex: 1 }}>
        <TodoApp />
      </Box>
    </SafeAreaView>
  );
}
