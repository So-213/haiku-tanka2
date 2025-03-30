'use client'
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function LoginModal({ show, onCancel }: { show: boolean; onCancel: () => void }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-lg font-semibold mb-4">ログイン方法を選択</h2>
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
      </div>
    </div>
  )
}
