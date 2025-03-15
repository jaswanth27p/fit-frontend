import { SidebarTrigger } from "~/components/ui/sidebar";

export default function TrainerNav() {
    return (
        <div className="w-full backdrop-blur-3xl border-b flex justify-between p-4">
            <div>Trainer Dashboard</div>
            <div className="lg:hidden">
                <SidebarTrigger />
            </div>
        </div>
    )
}