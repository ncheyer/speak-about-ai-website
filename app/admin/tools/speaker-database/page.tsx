"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Bot, Send, Loader2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from 'react-markdown'
import { authGet, authPost, authPut, authPatch, authDelete, authFetch } from "@/lib/auth-fetch"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function SpeakerDatabasePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Chat states
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check authentication
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isAdminLoggedIn) {
      router.push("/admin")
      return
    }
    setIsLoggedIn(true)

    // Add welcome message
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm your AI CRM Assistant. I can help you manage your speakers, deals, and projects. I can:\n\n- Search and recommend speakers by expertise\n- View, create, update, and delete deals\n- View, update, and delete projects\n- Change deal/project status\n- Get summaries of your pipeline and workload\n\nWhat would you like to do?",
        timestamp: new Date()
      }
    ])
  }, [router])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoadingChat) return

    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoadingChat(true)

    try {
      const response = await authPost("/api/admin/tools/crm-assistant", {
          message: userMessage.content,
          conversation: messages
        })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive"
      })

      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQueries = [
    "Show me all deals in negotiation stage",
    "Find AI experts in Silicon Valley",
    "What projects are currently active?",
    "Show me high-priority deals",
    "Find speakers specializing in machine learning"
  ]

  const handleSuggestedQuery = (query: string) => {
    setInputMessage(query)
  }

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-[60]">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI CRM Assistant</h1>
                <p className="mt-1 text-gray-600">Manage speakers, deals, and projects with natural language</p>
              </div>
            </div>
          </div>

          {/* Chat Card */}
          <Card className="h-[calc(100vh-16rem)] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                AI CRM Management
              </CardTitle>
              <CardDescription>
                Manage speakers, deals, and projects through chat
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-6">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                        <AvatarFallback>
                          <Bot className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.role === "user" ? (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="text-sm prose prose-sm max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.role === "user" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                        <AvatarFallback>
                          <User className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoadingChat && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Queries */}
              {messages.length === 1 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.map((query, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        onClick={() => handleSuggestedQuery(query)}
                      >
                        {query}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about speakers, deals, or projects..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoadingChat}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoadingChat || !inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
