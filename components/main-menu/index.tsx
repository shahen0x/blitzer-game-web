"use client";

import { FC, HTMLAttributes } from "react";
import Image from "next/image";

import { useApplicationStore } from "@/store/use-application-store";
import { StarsBackground } from "../background/stars";
import { Meteors } from "../background/meteors";

interface MainMenuProps extends HTMLAttributes<HTMLDivElement> { }

const MainMenu: FC<MainMenuProps> = ({ children }) => {

	const { isMainMenuActive, } = useApplicationStore();

	if (!isMainMenuActive) return null;

	return (
		<div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#4F2C7D] via-[#200643] to-[#05001c]">
			<StarsBackground className="absolute z-10" />
			<div className="absolute top-0 right-0 w-full h-full -scale-x-100">
				<Meteors number={20} />
			</div>

			<div className="flex flex-col justify-center items-center">
				<Image src="/logo.png" alt="logo" width={720} height={215} className="w-auto h-auto max-w-xl mb-8 relative z-50" priority />

				<div className="relative z-50 space-y-6">
					<div className="flex flex-col space-y-4">
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}

export default MainMenu;