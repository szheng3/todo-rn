import { useState } from 'react'
import { Button } from './ui/button'
import { Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TodoItemProps {
  id: string
  text: string
  completed: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ id, text, completed, onToggle, onDelete }: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg transition-all duration-300 ease-in-out",
        completed ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-white",
        isHovered && "shadow-lg"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full p-2 transition-all duration-300 ease-in-out",
            completed ? "bg-white text-green-500" : "bg-gray-200 text-gray-600"
          )}
          onClick={() => onToggle(id)}
        >
          <Check size={16} />
        </Button>
        <span className={cn("text-lg", completed ? "line-through text-white" : "text-gray-700")}>{text}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-700 transition-colors duration-300"
        onClick={() => onDelete(id)}
      >
        <Trash2 size={18} />
      </Button>
    </motion.div>
  )
}

