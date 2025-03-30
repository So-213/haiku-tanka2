import Image from "next/image"

export default function ResponseBox({ response }: { response: string }) {
  return (
    <div className="relative mt-6 flex flex-col items-center w-full">
      <div className="relative bg-white border-2 border-gray-600 rounded-2xl p-4 max-w-md shadow-lg text-base font-medium 
                      after:absolute after:top-full after:left-1/2 after:-ml-3 
                      after:w-0 after:h-0 
                      after:border-l-8 after:border-r-8 after:border-t-8 
                      after:border-l-transparent after:border-r-transparent after:border-t-white 
                      after:drop-shadow-md">
        {response}
      </div>
      <Image
        src="/gm.webp?height=100&width=100"
        alt="先生"
        width={100}
        height={100}
        className="opacity-80 mt-2"
      />
    </div>
  )
}
