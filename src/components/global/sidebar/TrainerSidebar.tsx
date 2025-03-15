import { Brain, Dumbbell, Home, Swords, Table2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar"
import { signOut, auth } from "~/server/auth"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/trainer/dashboard",
        icon: Home,
    },
]

export async function TrainerSidebar() {
    const session = await auth()
    return (
        <Sidebar variant="sidebar">
            <SidebarContent>
                <SidebarGroup className="h-full">
                    <SidebarGroupLabel>
                        <h1 className="text-3xl font-bold text-teal">FIT</h1>
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="pt-6">
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarFooter className="mt-auto">
                        {session ? (
                            <div className="space-y-2">
                                <p className="text-right">{session.user.name}</p>
                                <form className="flex items-center justify-end" action={async () => {
                                    "use server"
                                    await signOut();
                                }}>
                                    <Button type="submit" variant={"destructive"}>Sign Out</Button>
                                </form>
                            </div>
                        ) : null}
                    </SidebarFooter>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
