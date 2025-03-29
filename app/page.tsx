import { auth } from "@/lib/auth"
import HomeClient from "./HomeClient" // クライアント用のUI部分

export default async function Page() {
  const session = await auth()
  return <HomeClient session={session} />
}
