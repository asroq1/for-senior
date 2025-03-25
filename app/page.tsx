import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LucideMessageSquare } from 'lucide-react'

export default function Home() {
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
      </div>
    </div>
  )
}
