"use client";

import { FC, HTMLAttributes, useEffect, useState } from "react";
import { StarsBackground } from "./stars";
import { Meteors } from "./meteors";

interface AnimatedBackgroundProps extends HTMLAttributes<HTMLDivElement> {

}

const AnimatedBackground: FC<AnimatedBackgroundProps> = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className={`animated-background group fixed top-0 left-0 w-full h-full z-0
			
		`}>
			{/* <div className="absolute top-0 left-0 w-full h-full z-10 transition-all bg-black opacity-100 group-hover:opacity-0" />
			<div className="absolute top-0 left-0 w-full h-full z-10 transition-all bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#4F2C7D] via-[#200643] to-[#05001c] opacity-0 group-hover:opacity-100" /> */}
			{/* bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#4F2C7D] via-[#200643] to-[#05001c] */}
			<StarsBackground className="absolute top-0 left-0 z-20 w-full h-full" />
			{/* <div className="absolute top-0 right-0 z-30 w-full h-full -scale-x-100">
				<Meteors number={20} />
			</div> */}
		</div>
	)
}

export default AnimatedBackground;