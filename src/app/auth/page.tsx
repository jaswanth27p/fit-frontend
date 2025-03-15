import SignInButon from "~/components/global/SignInButon";
import Login from "~/components/global/SignUp";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth()
  if (session) redirect("/")
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-black">
      <Tabs defaultValue="sign-in" >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in" className="bg-white w-[300px] min-h-[150px]">
          <div
            className=" p-8 flex flex-col gap-4 my-auto"
          >
            <SignInButon />
          </div>
        </TabsContent>
        <TabsContent value="sign-up" className="bg-white w-[300px] min-h-[150px]">
          <Login />
        </TabsContent>
      </Tabs>
    </div>
  )
}