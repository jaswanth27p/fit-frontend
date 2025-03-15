import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import TrainerNav from "~/components/global/header/TrainerNav";
import { TrainerSidebar } from "~/components/global/sidebar/TrainerSidebar";
import { SidebarProvider } from "~/components/ui/sidebar"
import { auth } from "~/server/auth";

export default async function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth()
    if (!session) redirect("/auth")
    if (session.user.role !== UserRole.TRAINER){
        if (session.user.role !== UserRole.USER) redirect("/dashboard")
    }

    return (
        <SidebarProvider>
            <TrainerSidebar />
            <section className="relative w-full lg:w-[calc(100-16rem)]">
                <TrainerNav />
                <div className="px-2 md:px-6 lg:px-10 py-4 max-w-7xl mx-auto">
                    {children}
                </div>
            </section>
        </SidebarProvider>
    );
}
