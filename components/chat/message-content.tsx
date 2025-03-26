'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface MessageContentProps {
  content: string
  isAssistant: boolean
}

export function MessageContent({ content, isAssistant }: MessageContentProps) {
  if (!isAssistant) {
    return <p className='text-lg'>{content}</p>
  }

  return (
    <div className='prose prose-sm dark:prose-invert max-w-none'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 코드 블록 스타일링
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
        {content}
      </ReactMarkdown>
    </div>
  )
}