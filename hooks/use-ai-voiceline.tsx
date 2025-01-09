import { useEvilAiStore } from "@/store/use-evil-ai-store";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";


interface AiVoiceline {
	sendMessage?: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

const useAiVoiceline = ({ sendMessage }: AiVoiceline) => {
	const { setAudio, stopAudio, pauseAudio, resumeAudio, setEvilAiPanelActive } = useEvilAiStore();

	const generateAudio = async (text: string) => {
		try {
			const response = await fetch('/api/ai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text }),
			});

			if (!response.ok) {
				throw new Error('Failed to generate speech');
			}

			const audioBlob = await response.blob();
			const audioUrl = URL.createObjectURL(audioBlob);
			const newAudio = new Audio(audioUrl);

			// If there's already an audio playing, stop it
			stopAudio();

			// Wait for audio to be loaded before playing
			await new Promise((resolve, reject) => {
				newAudio.preload = 'auto';  // Ensure audio is preloaded

				// Handle successful loading
				newAudio.oncanplaythrough = () => {
					newAudio.play().then(resolve).catch(reject);
				};

				// Handle loading error
				newAudio.onerror = (error) => {
					reject(error);
					setEvilAiPanelActive(false);
				};

				// Clean up the URL object when done
				newAudio.onended = () => {
					URL.revokeObjectURL(audioUrl);
					setEvilAiPanelActive(false);
					if (sendMessage) {
						sendMessage("AudioManager", "SetVolume", 1);
					}
				};

				// Start loading the audio
				newAudio.load();
			});

			// Store the new audio instance in the Zustand store
			setAudio(newAudio);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handlePause = () => {
		pauseAudio();
	};

	const handleResume = () => {
		resumeAudio();
	};

	return { generateAudio, stopAudio, handlePause, handleResume };
};

export default useAiVoiceline;
