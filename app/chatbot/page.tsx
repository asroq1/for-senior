'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mic, Send, MicOff, ArrowLeft, Volume2 } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Image from 'next/image'
import { ImageUpload } from '@/components/image-upload'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'

// Web Speech API 타입 선언
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState('voice')
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string; image?: string }[]
  >([{ role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요?' }])
  // 음성 인식 중간 결과를 저장할 상태 추가
  const [interimTranscript, setInterimTranscript] = useState('')
  // 오디오 URL 저장
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  // 오디오 요소 참조
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // 이미지 데이터 저장
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  // 업로드된 이미지 URL 저장
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  // 음성 인식 인스턴스를 저장할 참조 생성
  const recognitionRef = useRef<any>(null)
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false)

  // 이미지 업로드 함수
  const uploadImage = async (imageData: string): Promise<string | null> => {
    try {
      // Base64 문자열에서 파일 데이터 추출
      const base64WithoutPrefix = imageData.split(';base64,').pop()

      if (!base64WithoutPrefix) {
        throw new Error('유효하지 않은 이미지 형식')
      }

      // Blob 생성
      const byteCharacters = atob(base64WithoutPrefix)
      const byteArrays = []

      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512)
        const byteNumbers = new Array(slice.length)

        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      // 파일 확장자 추출 (MIME 타입에서)
      const mimeType = imageData.split(';')[0].split(':')[1]
      const fileExtension = mimeType.split('/')[1]
      const fileName = `image.${fileExtension}`

      const blob = new Blob(byteArrays, { type: mimeType })
      const file = new File([blob], fileName, { type: mimeType })

      // FormData 생성 및 이미지 추가 (File 객체 사용)
      const formData = new FormData()
      formData.append('file', file) // 'image'가 아닌 'file'로 변경 (FastAPI 기본값)

      // 디버깅용 로그
      console.log('업로드 파일 정보:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })

      // 이미지 업로드 요청
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload-image`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('서버 응답:', errorText)
        throw new Error(
          `이미지 업로드 실패: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()
      return data.imageUrl // 서버에서 반환한 이미지 URL
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      return null
    }
  }

  // STT API 요청 함수 (단일 구현)
  const requestSTT = async (text: string, imageData?: string) => {
    setIsLoading(true)

    // 음성 녹음 중이라면 즉시 중지
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        setIsRecording(false)
        setInterimTranscript('')
        console.log('STT 요청으로 인해 음성 녹음이 중지되었습니다.')
      } catch (error) {
        console.error('음성 인식 중지 실패:', error)
      }
    }

    let uploadedUrl = null

    // 이미지가 있으면 먼저 업로드
    if (imageData) {
      uploadedUrl = await uploadImage(imageData)
      setUploadedImageUrl(uploadedUrl)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      setShowTimeoutAlert(true)
    }, 10000) // 10 seconds timeout

    try {
      // 요청 데이터 준비
      const requestData: { message: string; imageUrl?: string } = {
        message: text,
        user_id: 'user123',
      }

      // 업로드된 이미지 URL이 있으면 추가
      if (uploadedUrl) {
        requestData.imageUrl = uploadedUrl
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('STT API 요청 실패')
      }

      const data = await response.json()

      // 응답에서 오디오 URL을 가져옵니다
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl)
        // 오디오 요소가 있으면 재생합니다
        if (audioRef.current) {
          audioRef.current.src = data.audioUrl
          audioRef.current.play()
        }
      }

      // 응답 메시지 추가
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.response || '응답을 받지 못했습니다.',
        },
      ])

      // 음성 녹음 중이라면 중지
      if (isRecording && recognitionRef.current) {
        try {
          recognitionRef.current.stop()
          setIsRecording(false)
          setInterimTranscript('')
        } catch (error) {
          console.error('음성 인식 중지 실패:', error)
        }
      }

      // 응답 텍스트가 있으면 TTS 생성 함수 호출
      if (data.response) {
        generateTTS(data.response)
      }
    } catch (error: unknown) {
      clearTimeout(timeoutId)
      console.error('STT API 요청 오류:', error)

      if ((error as { name?: string }).name === 'AbortError') {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
          },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: '죄송합니다. 요청 처리 중 오류가 발생했습니다.',
          },
        ])
      }
    } finally {
      setIsLoading(false)
      // 이미지 초기화
      setSelectedImage(null)
    }
  }

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

        // 침묵 감지를 위한 타이머 변수
        let silenceTimer: NodeJS.Timeout | null = null
        // 마지막 음성 감지 시간
        let lastSpeechTime = Date.now()
        // no-speech 에러 무시 플래그
        let ignoringNoSpeech = false
        // no-speech 타이머
        let noSpeechTimer: NodeJS.Timeout | null = null
        // 현재까지 인식된 텍스트 저장
        let currentTranscript = ''

        // 결과 이벤트 처리
        recognition.onresult = (event: any) => {
          // 음성이 감지되면 마지막 음성 시간 업데이트
          lastSpeechTime = Date.now()

          // no-speech 에러 무시 플래그 초기화
          ignoringNoSpeech = false

          // no-speech 타이머가 있다면 초기화
          if (noSpeechTimer) {
            clearTimeout(noSpeechTimer)
            noSpeechTimer = null
          }

          // 이미 타이머가 있다면 초기화
          if (silenceTimer) {
            clearTimeout(silenceTimer)
          }

          // 새로운 침묵 감지 타이머 설정 (5초 후 자동 중지)
          silenceTimer = setTimeout(() => {
            const silenceTime = Date.now() - lastSpeechTime
            if (isRecording && silenceTime > 5000) {
              console.log('5초 이상 침묵이 감지되어 녹음을 중지합니다.')
              setIsRecording(false)
              if (recognitionRef.current) {
                recognitionRef.current.stop()
              }

              // 현재까지 인식된 텍스트가 있으면 전송
              if (currentTranscript || interimTranscript) {
                const textToSend = currentTranscript || interimTranscript

                // 메시지에 추가
                setMessages(prev => [
                  ...prev,
                  { role: 'user', content: textToSend },
                ])

                // API 요청
                requestSTT(textToSend)
              }
            }
          }, 5000)

          let finalTranscript = ''
          let interimTranscript = ''

          // 모든 결과 처리
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
              currentTranscript += transcript // 최종 결과를 현재 텍스트에 누적
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

            // STT API 요청
            requestSTT(finalTranscript)
            console.log('음성 녹음을 중지합니다.')
          }
        }

        // 오디오 시작 이벤트 처리
        recognition.onaudiostart = () => {
          console.log('오디오 녹음이 시작되었습니다.')
          lastSpeechTime = Date.now()
          currentTranscript = '' // 녹음 시작 시 현재 텍스트 초기화

          // no-speech 에러를 5초 동안 무시하도록 설정
          ignoringNoSpeech = true

          // 5초 후에 no-speech 에러 처리 활성화
          noSpeechTimer = setTimeout(() => {
            ignoringNoSpeech = false
            setIsRecording(false)
            if (recognitionRef.current) {
              recognitionRef.current.stop()
            }
            console.log('no-speech 에러 처리가 활성화되었습니다.')
          }, 5000)
        }

        // 오류 처리
        recognition.onerror = (event: any) => {
          console.error('음성 인식 오류', event.error)

          // no-speech 에러 처리
          if (event.error === 'no-speech') {
            // 5초 이내의 no-speech 에러는 무시하고 재시작
            if (ignoringNoSpeech) {
              console.log('초기 no-speech 에러 무시, 녹음 계속')

              // 녹음 재시작 시도
              try {
                recognition.stop()
                setTimeout(() => {
                  if (isRecording) {
                    recognition.start()
                    console.log('녹음 재시작됨')
                  }
                }, 100)
              } catch (error) {
                console.error('녹음 재시작 실패:', error)
              }

              return // 함수 종료하여 isRecording을 false로 설정하지 않음
            } else {
              // 5초 이후의 no-speech 에러는 정상적으로 처리
              console.log('5초 이상 말이 없어 녹음을 중지합니다.')
            }
          }

          // 다른 에러이거나 5초 이후의 no-speech 에러인 경우
          setIsRecording(false)
          setInterimTranscript('')

          // 타이머 정리
          if (silenceTimer) {
            clearTimeout(silenceTimer)
            silenceTimer = null
          }

          if (noSpeechTimer) {
            clearTimeout(noSpeechTimer)
            noSpeechTimer = null
          }
        }

        // 음성 인식 종료 처리
        recognition.onend = () => {
          console.log('음성 인식 종료')

          // no-speech 타이머가 있다면 초기화
          if (noSpeechTimer) {
            clearTimeout(noSpeechTimer)
            noSpeechTimer = null
          }

          // 강제로 상태 업데이트 및 UI 리렌더링
          setIsRecording(false)
          setInterimTranscript('')

          // 타이머 정리
          if (silenceTimer) {
            clearTimeout(silenceTimer)
            silenceTimer = null
          }

          // 디버깅용 로그 추가
          console.log('녹음 상태 변경: false')
        }
      }
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error('음성 인식 정리 중 오류:', error)
        }
      }
    }
  }, [])

  const handleSendMessage = () => {
    if (!input.trim() && !selectedImage) return

    // 사용자 메시지 추가
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: input || (selectedImage ? '이미지를 전송했습니다.' : ''),
        image: selectedImage || undefined,
      },
    ])

    // STT API 요청
    requestSTT(input, selectedImage || undefined)

    setInput('')
  }

  // 음성 인식 선택 핸들러
  const handleImageSelect = (imageData: string | null) => {
    setSelectedImage(imageData)
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

  // TTS 관련 상태 추가
  const [isTtsLoading, setIsTtsLoading] = useState(false)
  const [isTtsPlaying, setIsTtsPlaying] = useState(false)
  const { toast } = useToast()

  // TTS API 호출 함수 추가
  const generateTTS = async (text: string) => {
    setIsTtsLoading(true)

    try {
      // 내부 API 엔드포인트 호출
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        let errorMessage = '음성 생성 중 오류가 발생했습니다.'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // JSON 파싱 오류 무시
        }
        throw new Error(errorMessage)
      }

      // 응답에서 오디오 데이터를 Blob으로 가져옵니다
      const audioBlob = await response.blob()

      // Blob URL 생성
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioUrl(audioUrl)

      // 오디오 재생
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.onplay = () => setIsTtsPlaying(true)
        audioRef.current.onended = () => setIsTtsPlaying(false)
        audioRef.current.onpause = () => setIsTtsPlaying(false)
        audioRef.current.play()
      }
    } catch (error) {
      console.error('TTS 생성 오류:', error)
      toast({
        variant: 'destructive',
        title: 'TTS 생성 실패',
        description:
          error instanceof Error
            ? error.message
            : '음성 생성 중 오류가 발생했습니다.',
      })
    } finally {
      setIsTtsLoading(false)
    }
  }

  // TTS 재생/일시정지 토글 함수
  const toggleTtsPlayback = () => {
    if (!audioRef.current) return

    if (isTtsPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  return (
    <>
      <div className='container mx-auto px-4 py-8'>
        {/* 오디오 요소 추가 */}
        <audio ref={audioRef} className='hidden' />

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
                          {message.image && (
                            <div className='mb-2 rounded overflow-hidden'>
                              <Image
                                src={message.image}
                                alt='Uploaded image'
                                width={300}
                                height={200}
                                className='object-contain'
                              />
                            </div>
                          )}

                          {message.role === 'assistant' ? (
                            <div className='prose prose-sm dark:prose-invert max-w-none'>
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                  // 코드 블록 스타일링
                                  code({
                                    node,
                                    className,
                                    children,
                                    ...props
                                  }) {
                                    const match = /language-(\w+)/.exec(
                                      className || ''
                                    )
                                    return match ? (
                                      <div className='rounded bg-gray-800 p-2 my-2'>
                                        <code
                                          className={`${className} text-sm`}
                                          {...props}
                                        >
                                          {children}
                                        </code>
                                      </div>
                                    ) : (
                                      <code
                                        className='bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm'
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    )
                                  },
                                  // 링크 스타일링
                                  a({ node, className, children, ...props }) {
                                    return (
                                      <a
                                        className='text-primary hover:underline'
                                        {...props}
                                      >
                                        {children}
                                      </a>
                                    )
                                  },
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className='text-lg'>{message.content}</p>
                          )}
                          {message.role === 'assistant' && audioUrl && (
                            <Button
                              variant='ghost'
                              size='sm'
                              className='mt-2 h-8 w-8 p-0'
                              onClick={() => audioRef.current?.play()}
                              title='음성으로 듣기'
                            >
                              <Volume2 className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className='flex justify-start'>
                        <div className='max-w-[80%] rounded-lg p-3 bg-muted'>
                          <p className='text-lg'>응답을 생성 중입니다...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <TabsContent value='text' className='mt-0'>
                <div className='flex flex-col space-y-3'>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    disabled={isLoading}
                  />
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
                      disabled={isLoading}
                    >
                      <Send className='h-6 w-6' />
                    </Button>
                  </div>
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

                  <div className='w-full mb-4'>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      disabled={isLoading || isRecording}
                    />
                  </div>

                  <Button
                    onClick={toggleRecording}
                    size='lg'
                    className={`h-20 w-20 rounded-full ${
                      isRecording
                        ? 'bg-destructive hover:bg-destructive/90'
                        : 'bg-secondary hover:bg-secondary/90'
                    }`}
                    disabled={isLoading}
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
      <AlertDialog open={showTimeoutAlert} onOpenChange={setShowTimeoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>전송 실패</AlertDialogTitle>
            <AlertDialogDescription>
              전송에 실패하였습니다. 다시 시도해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowTimeoutAlert(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
