"use client";

import { FC, useEffect } from "react";
import { useEvilAiStore } from "@/store/use-evil-ai-store";

import useSound from 'use-sound';

const SOUND_URL = '/voice/ai.mp3';

interface EvilAiPanelProps {

}

const EvilAiPanel: FC<EvilAiPanelProps> = () => {

	const { evilAiPanelActive, setEvilAiPanelActive } = useEvilAiStore();
	const [play] = useSound(SOUND_URL, { volume: 1 });

	useEffect(() => {
		if (evilAiPanelActive) {
			play();
			setTimeout(() => {
				setEvilAiPanelActive(false);
			}, 5000);
		}
	}, [evilAiPanelActive]);

	return evilAiPanelActive ? (
		<div className="absolute z-50 top-0 right-0 w-40 h-40 bg-white/10 rounded-xl">
			Evil Ai Panel
		</div>
	) : null;
}

export default EvilAiPanel;