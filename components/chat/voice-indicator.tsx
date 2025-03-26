'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface VoiceIndicatorProps {
  isRecording?: boolean
  isLoading?: boolean
  isTtsPlaying?: boolean
  interimTranscript?: string
  aiResponse?: string
}

const VoiceIndicator = ({
  isRecording = false,
  isLoading = false,
  isTtsPlaying = false,
  interimTranscript = '',
  aiResponse = '',
}: VoiceIndicatorProps) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Typing animation effect for AI response
  useEffect(() => {
    if (isTtsPlaying && aiResponse) {
      if (currentIndex < aiResponse.length) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + aiResponse[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }, 50) // Speed of typing animation
        return () => clearTimeout(timer)
      }
    } else {
      // Reset when not playing TTS
      setDisplayText('')
      setCurrentIndex(0)
    }
  }, [isTtsPlaying, aiResponse, currentIndex])

  return (
    <div className='flex flex-col items-center justify-center h-[400px] rounded-md border border-border bg-secondary/20 p-4'>
      {isRecording ? (
        // Recording state remains unchanged
        <div className='flex flex-col items-center'>
          <div className='mb-4'>
            <Image
              src='/speaking-animation.jpg'
              alt='Recording animation'
              width={150}
              height={150}
              className='rounded-full'
            />
          </div>
          <div className='text-center'>
            <p className='text-lg font-medium mb-2'>
              {interimTranscript || '음성을 인식하는 중...'}
            </p>
            <div className='flex justify-center space-x-2'>
              <div
                className='w-2 h-2 bg-primary rounded-full animate-pulse'
                style={{ animationDelay: '0s' }}
              ></div>
              <div
                className='w-2 h-2 bg-primary rounded-full animate-pulse'
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className='w-2 h-2 bg-primary rounded-full animate-pulse'
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      ) : isTtsPlaying ? (
        <div className='flex flex-col items-center'>
          <div className='mb-4'>
            <Image
              src='/speaking-animation.gif'
              alt='TTS speaking animation'
              width={150}
              height={150}
              className='rounded-full'
            />
          </div>
          {/* Updated text display with overflow handling and markdown support */}
          <div className='text-lg font-medium max-w-md text-center w-full overflow-y-auto max-h-[200px] prose prose-sm dark:prose-invert'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                // Code block styling
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <div className='rounded bg-gray-800 p-2 my-2'>
                      <code className={`${className} text-sm`} {...props}>
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
                // Link styling
                a({ node, className, children, ...props }) {
                  return (
                    <a className='text-primary hover:underline' {...props}>
                      {children}
                    </a>
                  )
                },
              }}
            >
              {displayText}
            </ReactMarkdown>
            <span className='inline-block w-2 h-4 ml-1 bg-primary animate-blink'></span>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center text-center'>
          <Image
            src='/speaking-animation.jpg'
            alt='TTS speaking animation'
            width={150}
            height={150}
            className='rounded-full'
          />
        </div>
      )}
    </div>
  )
}

export default VoiceIndicator
