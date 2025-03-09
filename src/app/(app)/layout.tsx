export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="mx-auto w-full flex flex-col justify-center h-full">
			{children}
		</div>
	);
}
