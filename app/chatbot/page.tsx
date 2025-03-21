'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mic, Send, MicOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Web Speech API 타입 선언
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState('text')
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([{ role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요?' }])
  // 음성 인식 중간 결과를 저장할 상태 추가
  const [interimTranscript, setInterimTranscript] = useState('')

  // 음성 인식 인스턴스를 저장할 참조 생성
  const recognitionRef = useRef<any>(null)

  // 음성 인식 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 브라우저가 SpeechRecognition을 지원하는지 확인
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        const recognition = recognitionRef.current

        recognition.lang = 'ko-KR' // 한국어로 설정
        recognition.continuous = true
        recognition.interimResults = true // 중간 결과 활성화

        // 결과 이벤트 처리
        recognition.onresult = (event: any) => {
          let finalTranscript = ''
          let interimTranscript = ''

          // 모든 결과 처리
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          // 중간 결과 업데이트
          setInterimTranscript(interimTranscript)

          // 최종 결과가 있으면 메시지에 추가
          if (finalTranscript !== '') {
            setMessages(prev => [
              ...prev,
              { role: 'user', content: finalTranscript },
            ])

            // AI 응답 시뮬레이션
            setTimeout(() => {
              setMessages(prev => [
                ...prev,
                {
                  role: 'assistant',
                  content: `"${finalTranscript}"에 대한 응답입니다. 실제 서비스에서는 여기에 AI의 답변이 표시됩니다.`,
                },
              ])
            }, 1000)
          }
        }

        // 오류 처리
        recognition.onerror = (event: any) => {
          console.error('음성 인식 오류', event.error)
          setIsRecording(false)
          setInterimTranscript('')
        }

        // 음성 인식 종료 처리
        recognition.onend = () => {
          console.log('음성 인식 종료')
          setIsRecording(false)
          setInterimTranscript('')
        }
      }
    }
  }, [])

  // const toggleRecording = () => {
  //   if (!recognitionRef.current) {
  //     alert('죄송합니다. 이 브라우저는 음성 인식을 지원하지 않습니다.')
  //     return
  //   }

  //   if (!isRecording) {
  //     // 녹음 시작
  //     try {
  //       recognitionRef.current.start()
  //       setIsRecording(true)
  //       setInterimTranscript('') // 중간 결과 초기화
  //     } catch (error) {
  //       console.error('음성 인식 시작 실패:', error)
  //     }
  //   } else {
  //     // 녹음 중지
  //     try {
  //       recognitionRef.current.stop()
  //       setIsRecording(false)
  //       setInterimTranscript('') // 중간 결과 초기화
  //     } catch (error) {
  //       console.error('음성 인식 중지 실패:', error)
  //     }
  //   }
  // }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: input }])

    // AI 응답 시뮬레이션
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            '죄송합니다만, 현재 데모 버전이라 실제 응답은 제공되지 않습니다. 실제 서비스에서는 여기에 AI의 답변이 표시됩니다.',
        },
      ])
    }, 1000)

    setInput('')
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('죄송합니다. 이 브라우저는 음성 인식을 지원하지 않습니다.')
      return
    }

    if (!isRecording) {
      // 녹음 시작
      try {
        console.log('음성 인식 시작 시도') // 디버깅용
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (error) {
        console.error('음성 인식 시작 실패:', error)
      }
    } else {
      // 녹음 중지
      try {
        recognitionRef.current.stop()
        setIsRecording(false)
      } catch (error) {
        console.error('음성 인식 중지 실패:', error)
      }
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Link
          href='/'
          className='flex items-center text-primary hover:underline'
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          <span className='text-lg'>홈으로 돌아가기</span>
        </Link>
      </div>

      {/* 챗봇 페이지 디자인을 개선합니다 */}
      <Card className='max-w-4xl mx-auto border-2 border-primary/20 bg-white'>
        <CardHeader className='bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg'>
          <CardTitle className='text-3xl text-center text-primary'>
            AI 챗봇
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue='text'
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 mb-6 bg-muted'>
              <TabsTrigger
                value='text'
                className='text-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
              >
                텍스트 모드
              </TabsTrigger>
              <TabsTrigger
                value='voice'
                className='text-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
              >
                음성 모드
              </TabsTrigger>
            </TabsList>

            <div className='mb-4'>
              <ScrollArea className='h-[400px] p-4 border rounded-md bg-muted/30'>
                <div className='space-y-4'>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className='text-lg'>{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <TabsContent value='text' className='mt-0'>
              <div className='flex space-x-2'>
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder='메시지를 입력하세요...'
                  className='text-lg p-6 border-primary/30 focus-visible:ring-primary'
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  size='icon'
                  className='h-14 w-14 bg-primary hover:bg-primary/90'
                >
                  <Send className='h-6 w-6' />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='voice' className='mt-0'>
              <div className='flex flex-col items-center'>
                {/* 음성 인식 중간 결과를 표시할 텍스트 영역 */}
                {isRecording && (
                  <div className='w-full mb-4'>
                    <textarea
                      className='w-full p-3 border rounded-md bg-muted/20 text-lg min-h-[100px]'
                      value={interimTranscript}
                      readOnly
                      placeholder='음성을 인식하는 중...'
                    />
                  </div>
                )}

                <Button
                  onClick={toggleRecording}
                  size='lg'
                  className={`h-20 w-20 rounded-full ${
                    isRecording
                      ? 'bg-destructive hover:bg-destructive/90'
                      : 'bg-secondary hover:bg-secondary/90'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className='h-10 w-10' />
                  ) : (
                    <Mic className='h-10 w-10' />
                  )}
                </Button>
              </div>
              <p className='text-center mt-4 text-lg'>
                {isRecording
                  ? '음성을 녹음 중입니다... 버튼을 눌러 중지하세요.'
                  : '버튼을 눌러 음성으로 대화하세요.'}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
