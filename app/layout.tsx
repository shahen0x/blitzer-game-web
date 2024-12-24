import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnimatedBackground from "@/components/background";
import ConfigureAmplifyClientSide from "@/components/amplify/amplify-client-config";
import AmplifyAuthProvider from "@/components/amplify/amplify-auth-provider";
import { StarsBackground } from "@/components/background/stars";

const inter = Inter({ subsets: ["latin"] });

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
			<body className={`${inter.className} overflow-hidden`}>
				<StarsBackground className="absolute top-0 left-0 z-0 w-full h-full" />
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
