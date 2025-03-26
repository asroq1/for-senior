'use client'

import React from 'react'
import Image from 'next/image'

interface MessageImageProps {
  src: string
}

export function MessageImage({ src }: MessageImageProps) {
  return (
    <div className='mb-2 rounded overflow-hidden'>
      <Image
        src={src}
        alt='Uploaded image'
        width={300}
        height={200}
        className='object-contain'
      />
    </div>
  )
}
