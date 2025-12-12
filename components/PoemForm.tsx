'use client'
import { Button } from "@/components/ui/button"

interface PoemFormProps {
  poem: string
  setPoem: (poem: string) => void
  isLoading: boolean
  onSubmit: () => void
}

export default function PoemForm({ poem, setPoem, isLoading, onSubmit }: PoemFormProps) {
  return (
    <div className="w-full">
      <label className="block text-sm mb-2">ここに文章を入力してください：</label>
      <textarea
        value={poem}
        onChange={(e) => setPoem(e.target.value)}
        className="w-full border rounded-md p-2 min-h-[100px]"
      />
      <Button
        onClick={onSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 rounded-none h-12 text-white font-normal mt-2"
        disabled={isLoading}
      >
        {isLoading ? "処理中..." : "提出"}
      </Button>
    </div>
  )
}
