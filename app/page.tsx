import { auth } from "@/lib/auth"
import HomeClient from "./HomeClient" // クライアント用のUI部分
import Navbar from "@/components/Navbar";



export default async function Page() {
  const session = await auth()
  return (
    <>
      <HomeClient session={session} />
      <Navbar session={session} />
    </>
  )
}
