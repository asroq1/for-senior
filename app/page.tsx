'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LucideMessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function Home() {
  const router = useRouter()
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [userName, setUserName] = useState('')
  const [nameError, setNameError] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const isFirst = localStorage.getItem('isFirst') === null
    setIsFirstVisit(isFirst)
  }, [])

  const handleStartClick = () => {
    setShowNameDialog(true)
  }

  const handleNameSubmit = () => {
    if (!userName.trim()) {
      setNameError(true)
      return
    }
    
    // 사용자 이름을 로컬 스토리지에 저장
    localStorage.setItem('user_id', userName.trim())
    // 첫 방문이 아님을 표시
    localStorage.setItem('isFirst', 'false')
    // 챗봇 페이지로 이동
    router.push('/chatbot')
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <header className='mb-12 text-center'>
        <h1 className='text-4xl font-bold tracking-tight text-primary mb-4'>
          시니어 서비스
        </h1>
        <p className='text-xl text-muted-foreground'>
          편리한 디지털 서비스를 경험해보세요
        </p>
      </header>

      {isFirstVisit ? (
        <div className='max-w-2xl mx-auto text-center'>
          <Card className='border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 shadow-lg'>
            <CardHeader>
              <CardTitle className='text-3xl text-primary'>환영합니다!</CardTitle>
              <CardDescription className='text-xl mt-2'>
                시니어 서비스는 디지털 생활을 더 쉽고 편리하게 만들어 드립니다.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <p className='text-lg'>
                  AI 챗봇을 통해 궁금한 점을 물어보고, 음성으로 대화하며 필요한 정보를 얻을 수 있습니다.
                </p>
                <p className='text-lg'>
                  지금 바로 시작해보세요!
                </p>
              </div>
              <Button 
                size='lg' 
                className='text-lg px-8 py-6'
                onClick={handleStartClick}
              >
                시작하기 <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <Link href='/chatbot'>
            <Card className='h-full transition-all hover:shadow-lg border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-2xl flex items-center gap-2 text-primary'>
                  <LucideMessageSquare className='h-6 w-6' />
                  챗봇
                </CardTitle>
                <CardDescription className='text-lg'>
                  질문하고 답변을 받아보세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-lg'>
                  텍스트나 음성으로 대화할 수 있는 AI 챗봇 서비스입니다.
                </p>
                <div className='mt-4 flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-primary/50 text-primary hover:bg-primary/10'
                  >
                    텍스트 모드
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-primary/50 text-primary hover:bg-primary/10'
                  >
                    음성 모드
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          {/* 다른 서비스 카드들... */}
        </div>
      )}

      {/* 이름 입력 다이얼로그 */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl'>사용자 이름 입력</DialogTitle>
            <DialogDescription className='text-lg'>
              서비스를 이용하기 위해 이름을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Input
              className={`text-lg p-6 ${nameError ? 'border-red-500' : 'border-primary/30'} focus-visible:ring-primary`}
              placeholder='이름을 입력하세요'
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value)
                setNameError(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameSubmit()
                }
              }}
            />
            {nameError && (
              <p className='text-red-500 mt-2'>이름을 입력해주세요.</p>
            )}
          </div>
          <DialogFooter>
            <Button 
              className='w-full text-lg py-6' 
              onClick={handleNameSubmit}
            >
              시작하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
