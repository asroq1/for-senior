"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, Send, MicOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState("text")
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "안녕하세요! 무엇을 도와드릴까요?" },
  ])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "죄송합니다만, 현재 데모 버전이라 실제 응답은 제공되지 않습니다. 실제 서비스에서는 여기에 AI의 답변이 표시됩니다.",
        },
      ])
    }, 1000)

    setInput("")
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Simulate voice recording and response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: "음성으로 입력된 메시지입니다.",
          },
        ])

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "음성 메시지를 받았습니다. 실제 서비스에서는 음성 인식 결과에 따른 답변이 제공됩니다.",
            },
          ])
          setIsRecording(false)
        }, 1000)
      }, 2000)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="text-lg">홈으로 돌아가기</span>
        </Link>
      </div>

      {/* 챗봇 페이지 디자인을 개선합니다 */}
      <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <CardTitle className="text-3xl text-center text-primary">AI 챗봇</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
              <TabsTrigger
                value="text"
                className="text-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                텍스트 모드
              </TabsTrigger>
              <TabsTrigger
                value="voice"
                className="text-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                음성 모드
              </TabsTrigger>
            </TabsList>

            <div className="mb-4">
              <ScrollArea className="h-[400px] p-4 border rounded-md bg-muted/30">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-lg">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <TabsContent value="text" className="mt-0">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="text-lg p-6 border-primary/30 focus-visible:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} size="icon" className="h-14 w-14 bg-primary hover:bg-primary/90">
                  <Send className="h-6 w-6" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="mt-0">
              <div className="flex justify-center">
                <Button
                  onClick={toggleRecording}
                  size="lg"
                  className={`h-20 w-20 rounded-full ${isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-secondary hover:bg-secondary/90"}`}
                >
                  {isRecording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                </Button>
              </div>
              <p className="text-center mt-4 text-lg">
                {isRecording ? "음성을 녹음 중입니다... 버튼을 눌러 중지하세요." : "버튼을 눌러 음성으로 대화하세요."}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

