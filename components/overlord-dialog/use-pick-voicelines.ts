import useOverlordStore from "@/store/use-overlord-store";


interface RecentVoicelines {
	[key: string]: string[];
}

const MAX_RECENT_HISTORY = 4;
const recentVoicelines: RecentVoicelines = {
	spawn: [],
	death: [],
	beforeBossFight: [],
	afterBossFight: []
};


const usePickVoicelines = () => {

	const addToRecentVoicelines = (type: string, voiceline: string) => {
		if (!recentVoicelines[type]) {
			recentVoicelines[type] = [];
		}

		recentVoicelines[type].push(voiceline);

		// Keep only the most recent voicelines
		if (recentVoicelines[type].length > MAX_RECENT_HISTORY) {
			recentVoicelines[type].shift();
		}
	};


	const pickVoiceline = async (): Promise<string> => {
		const state = useOverlordStore.getState();

		const {
			voicelineType,
			voicelinesSpawn,
			voicelinesDeath,
			voicelinesBeforeBossFight,
			voicelinesAfterBossFight,
			setActiveVoiceline
		} = state;

		let voicelines: string[];

		switch (voicelineType) {
			case "spawn":
				voicelines = voicelinesSpawn;
				break;
			case "death":
				voicelines = voicelinesDeath;
				break;
			case "beforeBossFight":
				voicelines = voicelinesBeforeBossFight;
				break;
			case "afterBossFight":
				voicelines = voicelinesAfterBossFight;
				break;
			default:
				throw new Error("Invalid event type");
		}

		// No voiceline found
		if (!voicelines || voicelines.length === 0) {
			console.warn(`No voicelines available for type: ${voicelineType}`);
			return "I am the Overlord!";
		}

		// Filter out recently played voicelines
		const availableVoicelines = voicelines.filter(
			voiceline => !recentVoicelines[voicelineType]?.includes(voiceline)
		);

		// If all voicelines have been recently played, reset the history and use all voicelines
		const poolToUse = availableVoicelines.length > 0 ? availableVoicelines : voicelines;

		const pickedVoiceline = poolToUse[Math.floor(Math.random() * poolToUse.length)];

		// Add the picked voiceline to recent history
		addToRecentVoicelines(voicelineType, pickedVoiceline);

		setActiveVoiceline(pickedVoiceline);
		return pickedVoiceline;
	}

	return { pickVoiceline }
}

export default usePickVoicelines;