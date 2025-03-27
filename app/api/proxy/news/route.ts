import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 요청 본문 가져오기
    const body = await request.json()

    // 백엔드 서버로 요청 전달
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/news`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    // 백엔드 응답 처리
    const data = await backendResponse.json()

    // 클라이언트에 응답 반환
    return NextResponse.json(data)
  } catch (error) {
    console.error('프록시 API 오류:', error)
    return NextResponse.json(
      { error: '서버 요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
