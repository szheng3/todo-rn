import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { TodoItem } from "./todo-item";
import { Plus } from "lucide-react-native";
import { FlatList } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { useTodoStore } from "@/store/todo-store";

export function TodoApp() {
  const [newTodo, setNewTodo] = useState("");
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    useColorScheme() ?? "light"
  );
  const { width } = useWindowDimensions();

  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore();

  const isDark = colorScheme === "dark";
  const isSmallScreen = width < 768;

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      addTodo(newTodo);
      setNewTodo("");
    }
  };

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Box className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"} `}>
      <SafeAreaView className="flex-1">
        <VStack
          className={`${isSmallScreen ? "w-full" : "w-[600px]"} mx-auto h-full`}
          space="md"
        >
          <HStack className="justify-between items-center p-4" space="md">
            <Text
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              My Todo List
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={toggleColorScheme}
              className="rounded-full"
            >
              <Text>{isDark ? "🌞" : "🌙"}</Text>
            </Button>
          </HStack>

          <HStack className="px-4 mb-4" space="sm">
            <Input
              size="md"
              variant="outline"
              className={`flex-1 mr-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              <InputField
                value={newTodo}
                onChangeText={setNewTodo}
                onSubmitEditing={handleAddTodo}
                placeholder="Add a new todo..."
                returnKeyType="done"
              />
            </Input>
            <Button
              onPress={handleAddTodo}
              className="bg-blue-500 active:bg-blue-600"
            >
              <Plus size={20} color="white" />
            </Button>
          </HStack>

          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TodoItem
                id={item.id}
                text={item.text}
                completed={item.completed}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                isDark={isDark}
              />
            )}
            ListEmptyComponent={
              <Text
                className={`text-center ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-4`}
              >
                No todos yet. Add one to get started!
              </Text>
            }
            contentContainerStyle={{
              gap: 8,
              padding: 16,
            }}
            className="mb-16"
          />
        </VStack>
      </SafeAreaView>
    </Box>
  );
}
