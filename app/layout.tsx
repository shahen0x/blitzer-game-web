import "./globals.css";
import { Saira } from "next/font/google";
import type { Metadata } from "next";
import ConfigureAmplifyClientSide from "@/components/amplify/amplify-client-config";
import AmplifyAuthProvider from "@/components/amplify/amplify-auth-provider";

const saira = Saira({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Play Blitzer",
	description: "A video game designed for AWS Game Builder Challenge",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<body className={`${saira.className} overflow-hidden`}>
				<ConfigureAmplifyClientSide />
				<main className="relative z-10 w-full h-screen flex justify-center items-center">
					<AmplifyAuthProvider>
						{children}
					</AmplifyAuthProvider>
				</main>
			</body>
		</html>
	);
}
