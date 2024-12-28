import { useApplicationStore } from "@/store/use-application-store";
import { FC, useEffect, useRef, useState, KeyboardEvent as ReactKeyboardEvent } from "react";
import Dialog from "../ui/dialog";
import { StarsBackground } from "../background/stars";
import NavigableMenu, { MenuItem } from "../ui/navigable-menu";

interface LevelBrowserProps {

}

const LevelBrowser: FC<LevelBrowserProps> = () => {

	const { levelBrowserActive, setLevelBrowserActive } = useApplicationStore();

	const items = [
		{ id: '1', title: 'Sales', value: '$1,234', trend: '+5.2%' },
		{ id: '2', title: 'Users', value: '1,234', trend: '+2.1%' },
		{ id: '3', title: 'Revenue', value: '$12,345', trend: '+8.4%' },
		{ id: '4', title: 'Orders', value: '234', trend: '+3.7%' },
	];

	const handleSelect = (item: MenuItem) => {
		console.log('Selected item:', item);
		// Perform an action based on the selected item, e.g., navigation or function execution.
	};

	return (
		<Dialog
			open={levelBrowserActive}
			onOpenChange={setLevelBrowserActive}
			className="max-w-5xl min-h-[calc(100vh_-_10rem)]"
		>
			<StarsBackground className="absolute z-0" />
			<div
				className="relative z-10 h-full flex flex-col justify-center items-center space-y-10 outline-none"
			>

				<NavigableMenu
					items={items}
					onSelect={handleSelect}
					layout="grid"
					gridCols={2}
					className="w-full max-w-2xl bg-gray-50 rounded-xl grid-cols-2"
				>
					{({ item, isSelected }) => (
						<div
							className={`
            					p-4 rounded-lg
            					${isSelected
									? 'bg-white shadow-lg ring-2 ring-blue-500'
									: 'bg-white shadow hover:shadow-md'
								}
          					`}
						>
							<h3 className="text-gray-500 text-sm">{item.title}</h3>
							<div className="flex justify-between items-end mt-2">
								<span className="text-2xl font-bold">{item.value}</span>
								<span className="text-green-500">{item.trend}</span>
							</div>
						</div>
					)}
				</NavigableMenu>
			</div>
		</Dialog>
	)
}

export default LevelBrowser;