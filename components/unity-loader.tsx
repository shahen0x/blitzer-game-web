/**
 * UnityLoader
 * Loader component displayed while the Unity game is loading.
 * 
 */

import { FC } from "react";


interface UnityLoaderProps {
	isLoaded: boolean;
	loadingProgression: number;
}


const UnityLoader: FC<UnityLoaderProps> = ({
	isLoaded,
	loadingProgression
}) => {

	if (isLoaded) return null;

	return (
		<div className="max-w-72 md:max-w-2xl w-full text-white">
			<div className="space-y-2">
				<div className="text-xl">
					Loading game...
				</div>

				<div className="relative">
					<div className="absolute z-10 top-1/2 -translate-y-1/2 left-0 w-full h-4 border-2 rounded-sm" />
					<div
						className="relative z-20 h-6 bg-primary rounded-sm"
						style={{ width: `${loadingProgression * 100}%` }}
					>
						<div className="px-2 text-black font-bold">{Math.round(loadingProgression * 100)}%</div>
					</div>
				</div>

				<p className="text-sm">It might take a little longer to load the first time.</p>
			</div>
		</div>
	);
}

export default UnityLoader;