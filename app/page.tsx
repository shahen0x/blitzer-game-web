"use client";

import { useEffect, useRef } from "react";
import { useRefStore } from "@/store/use-ref-store";

import { Unity, useUnityContext } from "react-unity-webgl";

import UnityLoader from "@/components/unity/unity-loader";
import MainMenu from "@/components/main-menu";
import LevelGenerator from "@/components/level-generator";
import SubmitToLeaderboard from "@/components/submit-to-leaderboard";
import Leaderboard from "@/components/leaderboard";
import LevelBrowser from "@/components/level-browser";
import LevelUploader from "@/components/level-uploader";

export default function App() {

	const containerRef = useRef<HTMLDivElement>(null);
	const { setContainerRef } = useRefStore();


	// UNITY CONTEXT
	// Used for loading and interacting unity
	const {
		unityProvider,
		isLoaded,
		loadingProgression,
		addEventListener,
		removeEventListener,
		sendMessage,
		takeScreenshot
	} = useUnityContext({
		loaderUrl: "/game/Build/blitzer.loader.js",
		dataUrl: "/game/Build/blitzer.data",
		frameworkUrl: "/game/Build/blitzer.framework.js",
		streamingAssetsUrl: "/game/StreamingAssets",
		codeUrl: "/game/Build/blitzer.wasm",
		companyName: "AWS Hackathon",
		productName: "Blitzer",
		productVersion: "1",
		webglContextAttributes: {
			preserveDrawingBuffer: true,
		}
	});



	// CONTAINER REFERENCE
	// Used for fullscreen compatibility
	useEffect(() => {
		setContainerRef(containerRef)
	}, [setContainerRef]);



	return (
		<div className="w-full h-full" ref={containerRef}>

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

			<LevelGenerator sendMessage={sendMessage} />

			<LevelBrowser />
			<LevelUploader addEventListener={addEventListener} removeEventListener={removeEventListener} takeScreenshot={takeScreenshot} />

			<Leaderboard />
			<SubmitToLeaderboard addEventListener={addEventListener} removeEventListener={removeEventListener} />

		</div>
	);
}