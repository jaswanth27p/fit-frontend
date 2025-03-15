import { SidebarTrigger } from "~/components/ui/sidebar";

export default function UserNav() {
    return (
        <div className="w-full backdrop-blur-3xl border-b flex justify-between p-4">
            <div>Dashboard</div>
            <div className="lg:hidden">
                <SidebarTrigger />
            </div>
        </div>
    )
}