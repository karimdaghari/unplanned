import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="rounded-lg m-4">
				<div className="w-full rounded-full bg-background p-6">
					<Navbar />
					<main className="p-4 gap-4 flex flex-col h-[80dvh]">{children}</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
