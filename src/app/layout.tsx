import "./styles/globals.css";
import { env } from "@/env/server";
import { TRPCReactProvider } from "@/trpc/client/react";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "../components/navbar";

const defaultUrl = env.VERCEL_URL
	? `https://${env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Next.js and Supabase Starter Kit",
	description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={geistSans.className} suppressHydrationWarning>
			<body className="bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Toaster richColors position="bottom-center" />
					<TRPCReactProvider>
						<main className="h-screen p-4 gap-4 flex flex-col">
							<Navbar />
							{children}
						</main>
					</TRPCReactProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
