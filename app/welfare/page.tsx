import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"

export default function WelfarePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="text-lg">홈으로 돌아가기</span>
        </Link>
      </div>

      {/* 복지정보 페이지 디자인을 개선합니다 */}
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">시니어 복지 정보</h1>

      <Tabs defaultValue="health" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted">
          <TabsTrigger
            value="health"
            className="text-lg py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            건강
          </TabsTrigger>
          <TabsTrigger
            value="finance"
            className="text-lg py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            재정
          </TabsTrigger>
          <TabsTrigger
            value="housing"
            className="text-lg py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            주거
          </TabsTrigger>
          <TabsTrigger
            value="leisure"
            className="text-lg py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            여가
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <Card className="border-2 border-accent/20 bg-white">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-t-lg">
              <CardTitle className="text-2xl text-accent">건강 관련 복지 혜택</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2 text-accent">노인 건강검진</h3>
                <p className="text-lg">만 65세 이상 노인을 대상으로 무료 건강검진을 제공합니다.</p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 만 65세 이상 노인</li>
                  <li>내용: 기본 건강검진, 치매 검사 등</li>
                  <li>신청방법: 가까운 보건소 방문 또는 전화 신청</li>
                </ul>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2 text-accent">노인 치과 진료비 지원</h3>
                <p className="text-lg">만 65세 이상 노인을 대상으로 치과 진료비를 지원합니다.</p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 만 65세 이상 노인</li>
                  <li>내용: 틀니, 임플란트 등 치과 진료비 일부 지원</li>
                  <li>신청방법: 국민건강보험공단 지사 방문 또는 전화 신청</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2 text-accent">노인 장기요양보험</h3>
                <p className="text-lg">
                  일상생활을 혼자서 수행하기 어려운 노인에게 신체활동 및 가사지원 등의 서비스를 제공합니다.
                </p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 65세 이상 노인 또는 노인성 질병을 가진 65세 미만인 자</li>
                  <li>내용: 방문요양, 방문목욕, 방문간호, 주야간보호 등</li>
                  <li>신청방법: 국민건강보험공단 지사 방문 또는 온라인 신청</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card className="border-2 border-accent/20 bg-white">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-t-lg">
              <CardTitle className="text-2xl text-accent">재정 관련 복지 혜택</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2">기초연금</h3>
                <p className="text-lg">만 65세 이상이며 소득과 재산이 적은 어르신에게 매월 일정 금액을 지급합니다.</p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 만 65세 이상, 소득인정액이 선정기준액 이하인 노인</li>
                  <li>내용: 월 최대 30만원 지급</li>
                  <li>신청방법: 주소지 관할 읍/면/동 주민센터 방문 신청</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">노인 일자리 및 사회활동 지원</h3>
                <p className="text-lg">
                  노인에게 일자리 및 사회활동을 지원하여 소득을 창출하고 사회참여 기회를 제공합니다.
                </p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 만 65세 이상 노인</li>
                  <li>내용: 공익활동, 사회서비스형, 시장형 등 다양한 일자리 제공</li>
                  <li>신청방법: 가까운 노인복지관 또는 시니어클럽 방문 신청</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="housing">
          <Card className="border-2 border-accent/20 bg-white">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-t-lg">
              <CardTitle className="text-2xl text-accent">주거 관련 복지 혜택</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2">노인 공동생활홈</h3>
                <p className="text-lg">독거노인들이 함께 생활할 수 있는 공동생활홈을 제공합니다.</p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 만 65세 이상 독거노인</li>
                  <li>내용: 공동생활공간, 식사 제공, 프로그램 운영 등</li>
                  <li>신청방법: 주소지 관할 읍/면/동 주민센터 방문 신청</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">주택 개보수 지원</h3>
                <p className="text-lg">노인가구의 주거환경 개선을 위한 개보수 비용을 지원합니다.</p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 만 65세 이상 노인가구 중 소득인정액이 기준 이하인 가구</li>
                  <li>내용: 화장실 개조, 문턱 제거, 안전손잡이 설치 등</li>
                  <li>신청방법: 주소지 관할 읍/면/동 주민센터 방문 신청</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leisure">
          <Card className="border-2 border-accent/20 bg-white">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-t-lg">
              <CardTitle className="text-2xl text-accent">여가 관련 복지 혜택</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-medium mb-2">노인복지관 프로그램</h3>
                <p className="text-lg">노인복지관에서 다양한 여가 및 교육 프로그램을 제공합니다.</p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 만 60세 이상 노인</li>
                  <li>내용: 취미활동, 교육, 건강증진, 문화활동 등</li>
                  <li>신청방법: 가까운 노인복지관 방문 신청</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">경로당 활성화 사업</h3>
                <p className="text-lg">경로당을 이용하는 노인들에게 다양한 프로그램을 제공합니다.</p>
                <ul className="list-disc list-inside mt-2 text-lg">
                  <li>대상: 경로당 이용 노인</li>
                  <li>내용: 건강체조, 노래교실, 공예활동 등</li>
                  <li>신청방법: 가까운 경로당 방문</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

