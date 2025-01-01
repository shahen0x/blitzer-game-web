"use client";

import { ButtonHTMLAttributes, FC } from "react";
import { MoveRight } from "lucide-react";
import useSound from 'use-sound';

const SOUND_URL = '/sfx/ui-click.wav';


interface MainMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	description: string;
}


const MainMenuButton: FC<MainMenuButtonProps> = ({ onClick, title, description }) => {

	const [play] = useSound(SOUND_URL, { volume: 1 });

	return (
		<>
			<button
				onClick={onClick}
				onMouseDown={() => play()}
				className="group w-[22rem] py-3 px-4 rounded-2xl text-left transition-all border border-white/10 hover:border-primary bg-white/10 hover:bg-primary/5"
			>
				<div className={`flex items-center justify-between text-xl tracking-normal transition-all group-hover:text-primary group-hover:tracking-wider`}>
					{title} <MoveRight strokeWidth={2} className="mr-10 opacity-0 transition-all group-hover:mr-0 group-hover:opacity-100" />
				</div>
				<div className="transition-all text-sm text-white/70 group-hover:text-white">{description}</div>
			</button>

		</>
	)
}

export default MainMenuButton;