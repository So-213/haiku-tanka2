'use client'
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"




export default function LoginModal({ show, onCancel }: { show: boolean; onCancel: () => void }) {
  const [showLineNotice, setShowLineNotice] = useState(false)


  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-lg font-semibold mb-4">ログイン方法を選択</h2>

        <Button
          onClick={() => setShowLineNotice(true)}
          className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          LINEでログイン
        </Button>

        <Button
          onClick={() => {
            signIn("google")
            onCancel()
          }}
          className="w-full mb-2 bg-green-500 hover:bg-green-600 text-white"
        >
          Googleでログイン
        </Button>

        <Button
          onClick={onCancel}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black"
        >
          キャンセル
        </Button>



        {showLineNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-left w-96">
              <p className="mb-4">
                本Webサービスでは、ログイン時の認証画面にて許可を頂いた場合のみ、
                あなたのLINEアカウントに登録されているメールアドレスを取得します。
                取得したメールアドレスは、以下の目的以外では使用いたしません。
                また、法令に定められた場合を除き、第三者への提供はいたしません。
              </p>
              <ul className="list-disc pl-5 mb-4 text-sm text-left">
                <li>ユーザーIDとしてアカウントの管理に利用</li>
                <li>パスワード再発行時の本人確認に利用</li>
              </ul>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowLineNotice(false)} className="bg-gray-300 hover:bg-gray-400">
                  キャンセル
                </Button>
                <Button
                  onClick={() => {
                    setShowLineNotice(false)
                    signIn("line")
                    onCancel()
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  同意してログイン
                </Button>





              </div>
            </div>
          </div>
        )}












      </div>
    </div>
  )
}
