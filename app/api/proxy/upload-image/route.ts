import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // FormData 가져오기
    const formData = await request.formData();
    
    // 백엔드 서버로 요청 전달
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-image`, {
      method: 'POST',
      body: formData,
    });
    
    // 백엔드 응답 처리
    const data = await backendResponse.json();
    
    // 클라이언트에 응답 반환
    return NextResponse.json(data);
  } catch (error) {
    console.error('이미지 업로드 프록시 오류:', error);
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}