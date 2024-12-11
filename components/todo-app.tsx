import { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { TodoItem } from "./todo-item";
import { Plus } from "lucide-react-native";
import { FlatList } from "react-native";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    useColorScheme() ?? "light"
  );
  const { width } = useWindowDimensions();

  const isDark = colorScheme === "dark";
  const isSmallScreen = width < 768;

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const saveTodos = async (updatedTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const updatedTodos = [
        ...todos,
        { id: Date.now().toString(), text: newTodo, completed: false },
      ];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Box className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
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
            className={`flex-1 mr-4 ${isDark ? "text-white" : "text-gray-800"}`}
          >
            <InputField
              value={newTodo}
              onChangeText={setNewTodo}
              onSubmitEditing={addTodo}
              placeholder="Add a new todo..."
              returnKeyType="done"
            />
          </Input>
          <Button onPress={addTodo} className="bg-blue-500 active:bg-blue-600">
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
    </Box>
  );
}
