/**
 * MAIN PAGE
 * The main page of the application that initiates the game as well as all the other components
 *
 */


"use client";

import { useEffect, useRef } from "react";
import { useRefStore } from "@/store/use-ref-store";
import { Unity, useUnityContext } from "react-unity-webgl";
import UnityLoader from "@/components/unity-loader";
import MainMenu from "@/components/main-menu/index";
import LevelGenerator from "@/components/level-generator";
import MenuCompletedLevel from "@/components/menu-completed-level";
import Leaderboard from "@/components/leaderboard";
import LevelBrowser from "@/components/level-browser";
import LevelUploader from "@/components/level-generator/level-uploader";
import MenuPause from "@/components/menu-pause";
import MenuDeath from "@/components/menu-death";
import Credits from "@/components/credits";
import OverlordDialog from "@/components/overlord-dialog";
import SurvivalManager from "@/components/survival-manager";
import SurvivalSubmitToLeaderboard from "@/components/survival-manager/submit";


export default function App() {


	// CONTAINER REFERENCE
	// Used for fullscreen menu modal compatibility
	const containerRef = useRef<HTMLDivElement>(null);
	const { setContainerRef } = useRefStore();
	useEffect(() => {
		setContainerRef(containerRef);
	}, [setContainerRef]);


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

			<LevelGenerator sendMessage={sendMessage} />

			<LevelBrowser sendMessage={sendMessage} />

			<LevelUploader
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				takeScreenshot={takeScreenshot}
			/>

			<Leaderboard />

			<MenuCompletedLevel
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
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			<Credits />

		</main>
	);
}