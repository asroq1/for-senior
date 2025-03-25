'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageSelect: (imageData: string | null) => void
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result as string
      setSelectedImage(imageData)
      onImageSelect(imageData)
    }
    reader.readAsDataURL(file)
  }

  // 이미지 제거
  const removeImage = () => {
    setSelectedImage(null)
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 이미지 선택 버튼 클릭
  const handleImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col space-y-2">
      {selectedImage && (
        <div className="relative w-full h-40 mb-2 border rounded-md overflow-hidden">
          <Image 
            src={selectedImage} 
            alt="Selected image" 
            fill 
            className="object-contain"
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex">
        <Button
          onClick={handleImageButtonClick}
          size='icon'
          variant='outline'
          className='h-10 w-10 border-primary/30'
          disabled={disabled}
        >
          <ImageIcon className='h-5 w-5' />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  )
}