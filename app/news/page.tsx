import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewsPage() {
  // Sample news data
  const newsArticles = [
    {
      id: 1,
      title: "노인 일자리 지원 사업 확대",
      summary:
        "정부가 노인 일자리 지원 사업을 확대하여 더 많은 시니어들에게 일자리 기회를 제공합니다. 올해부터 지원 대상 연령을 확대하고 다양한 분야의 일자리를 새롭게 발굴할 예정입니다.",
      date: "2023-05-15",
      category: "정책",
    },
    {
      id: 2,
      title: "노인 건강을 위한 식이요법",
      summary:
        "노년기 건강 유지를 위한 식이요법에 대한 최신 연구 결과가 발표되었습니다. 단백질 섭취와 항산화 식품이 노인 건강에 중요한 역할을 한다는 것이 밝혀졌습니다.",
      date: "2023-05-10",
      category: "건강",
    },
    {
      id: 3,
      title: "디지털 교육으로 노인 정보격차 해소",
      summary:
        "지역 복지관에서 시니어를 위한 디지털 교육 프로그램을 운영합니다. 스마트폰 사용법부터 인터넷 뱅킹까지 실생활에 필요한 디지털 기술을 배울 수 있습니다.",
      date: "2023-05-05",
      category: "교육",
    },
    {
      id: 4,
      title: "노인 우울증 예방을 위한 사회활동 중요성",
      summary:
        "노인 우울증 예방에 사회활동 참여가 중요하다는 연구 결과가 발표되었습니다. 정기적인 모임과 취미활동이 노인의 정신 건강에 긍정적인 영향을 미친다고 합니다.",
      date: "2023-04-28",
      category: "건강",
    },
    {
      id: 5,
      title: "노인 친화 도시 조성 사업 추진",
      summary:
        "서울시가 노인 친화 도시 조성 사업을 추진합니다. 보행 환경 개선, 공공시설 접근성 향상 등 노인들이 살기 좋은 도시 환경을 만들기 위한 다양한 정책이 시행될 예정입니다.",
      date: "2023-04-20",
      category: "정책",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="text-lg">홈으로 돌아가기</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-primary">시니어 정보 기사</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {newsArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow border-2 border-primary/10 bg-white">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    article.category === "건강"
                      ? "bg-accent/20 text-accent"
                      : article.category === "정책"
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary/20 text-secondary"
                  }`}
                >
                  {article.category}
                </span>
                <span className="text-muted-foreground">{article.date}</span>
              </div>
              <CardTitle className="text-2xl text-primary">{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{article.summary}</p>
              <Link
                href={`/news/${article.id}`}
                className="inline-block mt-4 text-secondary hover:underline font-medium"
              >
                자세히 보기
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

