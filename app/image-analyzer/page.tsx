"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ImageIcon } from "lucide-react"

export default function ImageAnalyzerPage() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setResult(null)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = () => {
    if (!image) return

    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setResult(
        "이 이미지는 공원에서 찍은 사진으로 보입니다. 푸른 나무들과 벤치가 보이고, 사람들이 산책을 즐기고 있습니다. 날씨는 맑고 화창해 보입니다. 이 공원은 도시 중심부에 위치한 것으로 추정됩니다.",
      )
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="text-lg">홈으로 돌아가기</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-secondary">이미지 분석</h1>

      <Card className="max-w-4xl mx-auto border-2 border-secondary/20 bg-white">
        <CardHeader className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-t-lg">
          <CardTitle className="text-2xl text-center text-secondary">
            이미지를 업로드하면 AI가 설명해 드립니다
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <input type="file" accept="image/*" id="image-upload" className="hidden" onChange={handleImageUpload} />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors border-secondary/30"
                >
                  {image ? (
                    <img
                      src={image || "/placeholder.svg"}
                      alt="업로드된 이미지"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-12 h-12 mb-4 text-secondary" />
                      <p className="mb-2 text-lg text-secondary">이미지를 업로드하려면 클릭하세요</p>
                      <p className="text-sm text-muted-foreground">(JPG, PNG 파일 지원)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {image && !result && (
              <div className="flex justify-center">
                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  size="lg"
                  className="text-lg bg-secondary hover:bg-secondary/90"
                >
                  {isAnalyzing ? "분석 중..." : "이미지 분석하기"}
                  {isAnalyzing && <span className="ml-2 inline-block animate-spin">⟳</span>}
                </Button>
              </div>
            )}

            {result && (
              <div className="mt-6 p-4 bg-muted rounded-lg border border-secondary/20">
                <h3 className="text-xl font-medium mb-2 text-secondary">분석 결과</h3>
                <p className="text-lg">{result}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setImage(null)
                    setResult(null)
                  }}
                  className="mt-4 border-secondary/30 text-secondary hover:bg-secondary/10"
                >
                  다시 시작하기
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

