import Login from "~/components/global/Login";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();
  console.log(session)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-teal sm:text-[5rem]">
          FIT
        </h1>
        <Login/>
      </div>
    </main>
  );
}
