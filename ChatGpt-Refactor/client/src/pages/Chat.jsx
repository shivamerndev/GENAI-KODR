import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp, Square } from "lucide-react"
import { useState } from "react"
import useChat from '../hooks/useChat'


export default function Chat({ chatId, temp }) {

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { handleAiResponse } = useChat()

  const handleSubmit = () => {
    setIsLoading(true)

    handleAiResponse(input, chatId, temp)
    // simulate request
    setTimeout(() => {
      setIsLoading(false)
      setInput("")
    }, 2000)
  }

  const handleValueChange = (value) => {
    setInput(value)
  }

  return (
    <PromptInput
      value={input}
      onValueChange={handleValueChange}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className="w-full max-w-(--breakpoint-md) text-white bg-zinc-900  border-zinc-600"
    >
      <PromptInputTextarea className="text-white" placeholder="Ask me anything..." />
      <PromptInputActions className="justify-end pt-2 ">
        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  )
}
