'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Button } from '@/components/ui/button'
import { Volume2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  onPlayTTS: (text: string) => void
  audioUrl: string | null
}

export function MessageList({
  messages,
  isLoading,
  onPlayTTS,
  audioUrl,
}: MessageListProps) {
  // Add state for typing animation
  const [typingText, setTypingText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(-1)
  const [fullText, setFullText] = useState<string>('')
  const typingSpeed = 30 // milliseconds per character

  // 스크롤 영역에 대한 참조 생성
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Watch for new assistant messages to animate
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant' && !isLoading) {
      // Start typing animation for the new message
      setIsTyping(true)
      setCurrentMessageIndex(messages.length - 1)
      setFullText(lastMessage.content)
      setTypingText('')
    }
  }, [messages, isLoading])

  // Typing animation effect
  useEffect(() => {
    if (!isTyping || currentMessageIndex < 0) return

    let currentIndex = 0
    const text = fullText

    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypingText(text.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [isTyping, fullText, currentMessageIndex])

  // 메시지가 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    // 즉시 실행 및 약간의 지연 후 다시 실행 (애니메이션 및 렌더링 완료 보장)
    scrollToBottom()

    // 약간의 지연 후 다시 스크롤 (렌더링 완료 보장)
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [messages, isLoading, typingText])

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'end', // Ensure it scrolls to the very bottom
        inline: 'nearest',
      })
    }

    // Direct DOM manipulation for ScrollArea
    if (scrollAreaRef.current) {
      const scrollableElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollableElement) {
        // Force immediate scroll without animation
        const element = scrollableElement as HTMLElement
        element.scrollTop = element.scrollHeight

        // Add a small delay and check again to ensure proper scrolling
        setTimeout(() => {
          element.scrollTop = element.scrollHeight
        }, 50)
      }
    }
  }

  // Add a second useEffect to handle window resize events
  useEffect(() => {
    // Scroll to bottom on window resize
    const handleResize = () => {
      setTimeout(scrollToBottom, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Add a third useEffect to handle initial load
  useEffect(() => {
    // Scroll to bottom on initial load
    scrollToBottom()
  }, [])

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className='h-[400px] rounded-md border border-border bg-secondary/20'
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        className='space-y-4 p-4'
        ref={scrollRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100%',
          justifyContent: 'flex-end',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        <div className='flex flex-col space-y-4 w-full'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex message-animation ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
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
                      components={
                        {
                          // ... existing code components ...
                        }
                      }
                    >
                      {isTyping && index === currentMessageIndex
                        ? typingText
                        : message.content}
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
                    onClick={() => onPlayTTS(message.content)}
                    title='음성으로 듣기'
                  >
                    <Volume2 className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className='flex justify-start message-animation'>
              <div className='max-w-[80%] rounded-lg p-3 bg-muted'>
                <p className='text-lg'>
                  <span className='typing-animation'>응답을 생성 중입니다</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 스크롤 위치를 맨 아래로 이동시키기 위한 빈 div */}
        <div
          ref={messagesEndRef}
          style={{
            height: '2px',
            marginTop: '8px',
            marginBottom: '8px',
            scrollMarginBottom: '20px',
            clear: 'both',
            visibility: 'hidden',
          }}
          aria-hidden='true'
        />
      </div>
    </ScrollArea>
  )
}
