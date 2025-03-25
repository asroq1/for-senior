import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  console.log('TTS API 호출')
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '유효한 텍스트가 필요합니다.' },
        { status: 400 }
      )
    }

    // OpenAI TTS API 호출
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy', // 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer' 중 선택
      input: text,
    })

    // 응답에서 오디오 데이터를 ArrayBuffer로 가져옵니다
    const buffer = await response.arrayBuffer()

    // 오디오 데이터를 응답으로 반환
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.byteLength.toString(),
      },
    })
  } catch (error: any) {
    console.error('TTS API 오류:', error)
    return NextResponse.json(
      { error: error.message || '음성 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
