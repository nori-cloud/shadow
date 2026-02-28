'use client'

import { useEffect, useState } from 'react'
import { DefaultChatTransport, ToolUIPart } from 'ai'
import { useChat } from '@ai-sdk/react'
import { Cloud, Send, Loader2, RotateCcw } from 'lucide-react'

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'

import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'

import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSessionStore } from '@/stores/session-store'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const { getOrCreateSessionId, clearSession } = useSessionStore()
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Initialize session ID on mount (sets cookie automatically)
  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [getOrCreateSessionId])

  const { messages, setMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  // Fetch existing messages when session ID is available
  useEffect(() => {
    if (!sessionId) return

    const fetchMessages = async () => {
      const res = await fetch('/api/chat')
      const data = await res.json()
      if (!data.error) {
        setMessages([...data])
      }
    }
    fetchMessages()
  }, [sessionId, setMessages])

  const handleSubmit = async () => {
    if (!input.trim() || !sessionId) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleNewSession = () => {
    clearSession()
    setSessionId(getOrCreateSessionId())
    setMessages([])
  }

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Cloud className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Weather Assistant</h1>
              <p className="text-xs text-muted-foreground">Powered by Mastra</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewSession}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Chat
            </Button>
            <Badge variant={isLoading ? 'default' : 'secondary'} className="gap-1.5">
              {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              {isLoading ? 'Thinking...' : 'Ready'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1">
        <div className="mx-auto h-full max-w-3xl px-4 py-6">
          <Conversation className="h-[calc(100vh-12rem)]">
            <ConversationContent className="space-y-6">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Cloud className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-medium">How can I help you today?</h2>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Ask me about the weather in any city. I can provide current conditions,
                    temperature, humidity, and more.
                  </p>
                </div>
              )}

              {messages.map(message => (
                <div key={message.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {message.parts?.map((part, i) => {
                    if (part.type === 'text') {
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        </Message>
                      )
                    }

                    if (part.type?.startsWith('tool-')) {
                      return (
                        <Tool key={`${message.id}-${i}`} className="my-2">
                          <ToolHeader
                            type={(part as ToolUIPart).type}
                            state={(part as ToolUIPart).state || 'output-available'}
                            className="cursor-pointer"
                          />
                          <ToolContent>
                            <ToolInput input={(part as ToolUIPart).input || {}} />
                            <ToolOutput
                              output={(part as ToolUIPart).output}
                              errorText={(part as ToolUIPart).errorText}
                            />
                          </ToolContent>
                        </Tool>
                      )
                    }

                    return null
                  })}
                </div>
              ))}
              <ConversationScrollButton />
            </ConversationContent>
          </Conversation>
        </div>
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 border-t bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody className="rounded-xl border bg-background shadow-sm">
              <PromptInputTextarea
                onChange={e => setInput(e.target.value)}
                value={input}
                placeholder="Ask about the weather..."
                disabled={isLoading || !sessionId}
                className="min-h-[52px] resize-none border-0 bg-transparent px-4 py-3 focus-visible:ring-0"
              />
              <PromptInputSubmit
                disabled={isLoading || !input.trim() || !sessionId}
                className="mr-2 h-9 w-9 rounded-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </PromptInputSubmit>
            </PromptInputBody>
          </PromptInput>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Weather data from Open-Meteo API
          </p>
        </div>
      </footer>
    </div>
  )
}
