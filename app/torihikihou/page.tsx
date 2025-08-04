import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"



export default function TorihikihouPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-purple-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="w-full border rounded-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              特定商取引法に基づく表記
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* 事業者情報 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-pink-200 pb-2">
                事業者情報
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-600">萱沼 颯</h3>
                  <p className="text-gray-800">AI俳句短歌アプリ</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">代表者</h3>
                  <p className="text-gray-800">萱沼 颯</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">所在地</h3>
                  <p className="text-gray-800">ご請求により遅滞なく開示いたします</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">連絡先</h3>
                  <p className="text-gray-800">ご請求により遅滞なく開示いたします</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">メールアドレス</h3>
                  <p className="text-gray-800">betepp7@gmail.com</p>
                </div>
              </div>
            </section>

            {/* サービス情報 */}
            <section>　
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-pink-200 pb-2">
                サービス情報
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-600">サービス名</h3>
                  <p className="text-gray-800">AI俳句短歌アプリ</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">サービス内容</h3>
                  <p className="text-gray-800">AIを活用した俳句・短歌の解釈・感想サービス</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">価格</h3>
                  <p className="text-gray-800">
                    基本サービス：月額500円（税込）
                  </p>
                </div>
              </div>
            </section>

            {/* 支払い方法 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-pink-200 pb-2">
                支払い方法
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-600">利用可能な決済方法</h3>
                  <p className="text-gray-800">クレジットカード決済（Visa、Mastercard、JCB、American Express）</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">支払い時期</h3>
                  <p className="text-gray-800">クレジットカード決済：即座に処理されます</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">追加料金</h3>
                  <p className="text-gray-800">決済手数料：無料<br />
                  その他の追加料金：なし</p>
                </div>
              </div>
            </section>

            {/* サービス提供時期 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-pink-200 pb-2">
                サービス提供時期
              </h2>
              <div>
                <h3 className="font-medium text-gray-600">サービス開始時期</h3>
                <p className="text-gray-800">お申し込み完了後、即座にサービスをご利用いただけます</p>
              </div>
            </section>

            {/* 返品・キャンセルポリシー */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-pink-200 pb-2">
                返品・キャンセルポリシー
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-600">お客様都合によるキャンセル</h3>
                  <p className="text-gray-800">
                    サービス開始後のお客様都合による返金はお受けできません。
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">サービス不具合による返金</h3>
                  <p className="text-gray-800">
                    サービスに重大な不具合がある場合、該当期間分の料金を返金いたします。<br />
                    不具合の報告は、betepp7@gmail.comまでご連絡ください。
                  </p>
                </div>
              </div>
            </section>

            {/* 利用規約 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-pink-200 pb-2">
                利用規約
              </h2>
              <div>
                <p className="text-gray-800">
                  本サービスの利用にあたっては、別途定める利用規約に従っていただきます。<br />
                  利用規約の詳細は、サービス利用時にご確認いただけます。
                </p>
              </div>
            </section>

            {/* プライバシーポリシー */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-pink-200 pb-2">
                プライバシーポリシー
              </h2>
              <div>
                <p className="text-gray-800">
                  お客様の個人情報の取り扱いについては、別途定めるプライバシーポリシーに従って適切に管理いたします。
                </p>
              </div>
            </section>

            {/* お問い合わせ */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-pink-200 pb-2">
                お問い合わせ
              </h2>
              <div className="space-y-2">
                <p className="text-gray-800">
                  サービスに関するお問い合わせは、以下の方法でお受けいたします：
                </p>
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  <li>メール：betepp7@gmail.com</li>
                </ul>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 