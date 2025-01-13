"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRefStore } from "@/store/use-ref-store";

import { Unity, useUnityContext } from "react-unity-webgl";

import UnityLoader from "@/components/unity/unity-loader";
import MainMenu from "@/components/main-menu/index";
import LevelGenerator from "@/components/level-generator";
import SubmitToLeaderboard from "@/components/leaderboard/submit";
import Leaderboard from "@/components/leaderboard";
import LevelBrowser from "@/components/level-browser";
import LevelUploader from "@/components/level-generator/level-uploader";
import MenuPause from "@/components/menu-pause";
import MenuDeath from "@/components/menu-death";
import Debug from "@/components/debug";
import Credits from "@/components/credits";
import OverlordDialog from "@/components/overlord-dialog";
import useOverlordStore, { VoicelineType } from "@/store/use-overlord-store";
import SurvivalManager from "@/components/survival-manager";
import SurvivalSubmitToLeaderboard from "@/components/survival-manager/submit";



export default function App() {


	// A ref for the container element and set it in the store for shared access.
	const containerRef = useRef<HTMLDivElement>(null);
	const hasRun = useRef(false);


	const { setContainerRef } = useRefStore();


	// Overlord's voicelines
	const { generateVoicelines, audio } = useOverlordStore();
	const [overlordDialogActive, setOverlordDialogActive] = useState(false);
	const [voiceEventSelected, setVoiceEventSelected] = useState<VoicelineType>("spawn");



	// UNITY CONTEXT
	// Used for loading and interacting unity
	const gameName = "b12";
	const {
		unityProvider,
		isLoaded,
		loadingProgression,
		addEventListener,
		removeEventListener,
		sendMessage,
		takeScreenshot,
	} = useUnityContext({
		loaderUrl: `/game/Build/${gameName}.loader.js`,
		dataUrl: `/game/Build/${gameName}.data`,
		frameworkUrl: `/game/Build/${gameName}.framework.js`,
		codeUrl: `/game/Build/${gameName}.wasm`,
		streamingAssetsUrl: "/game/StreamingAssets",
		companyName: "AWS Hackathon",
		productName: "Blitzer",
		productVersion: "1",
		webglContextAttributes: {
			preserveDrawingBuffer: true,
		}
	});



	// CONTAINER REFERENCE
	// Used for fullscreen menu modal compatibility
	useEffect(() => {
		setContainerRef(containerRef);
	}, [setContainerRef]);


	// Generate AI Overlord's voicelines
	// useEffect(() => {
	// 	if (hasRun.current) return;
	// 	hasRun.current = true;

	// 	generateVoicelines();
	// }, []);


	// Overlord Voiceline Events
	const voicelineEvents = useCallback((voicelineType: any) => {
		setVoiceEventSelected(voicelineType);
		setOverlordDialogActive(true);
	}, []);

	useEffect(() => {
		addEventListener("PlayVoiceline", voicelineEvents);
		return () => removeEventListener("PlayVoiceline", voicelineEvents);
	}, [addEventListener, removeEventListener, voicelineEvents]);



	// Prefetch data for better user experience




	return (
		<main className="relative z-10 w-full h-screen flex justify-center items-center" ref={containerRef}>

			<UnityLoader
				isLoaded={isLoaded}
				loadingProgression={loadingProgression}
			/>

			<Unity
				id="game"
				unityProvider={unityProvider}
				className="fixed top-0 left-0 z-0 aspect-video w-full h-screen"
			/>

			<MainMenu
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			<SurvivalManager
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			<SurvivalSubmitToLeaderboard
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			<LevelGenerator
				sendMessage={sendMessage}
			/>

			<LevelBrowser
				sendMessage={sendMessage}
			/>

			<LevelUploader
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				takeScreenshot={takeScreenshot}
			/>

			<Leaderboard />

			<SubmitToLeaderboard
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>


			<MenuPause
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			<MenuDeath
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			<OverlordDialog
				type={voiceEventSelected}
				isTriggered={overlordDialogActive}
				setIsTriggered={setOverlordDialogActive}
				sendMessage={sendMessage}
			/>

			<Credits />

			{/* <Debug /> */}

		</main>
	);
}