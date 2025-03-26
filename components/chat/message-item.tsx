'use client'

import React from 'react'
import { MessageContent } from '@/components/chat/message-content'
import { MessageImage } from '@/components/chat/message-image'
import { Button } from '@/components/ui/button'
import { Volume2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

interface MessageItemProps {
  message: Message
  index: number
  onPlayTTS: (text: string) => void
  audioUrl: string | null
}

export function MessageItem({
  message,
  index,
  onPlayTTS,
  audioUrl,
}: MessageItemProps) {
  return (
    <div
      className={`flex message-animation ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
      style={{
        animationDelay: `${index * 0.1}s`,
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
      }}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {message.image && <MessageImage src={message.image} />}

        <MessageContent
          content={message.content}
          isAssistant={message.role === 'assistant'}
        />

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
  )
}
