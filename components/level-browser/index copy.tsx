import { useApplicationStore } from "@/store/use-application-store";
import { FC, useEffect, useRef, useState, KeyboardEvent as ReactKeyboardEvent } from "react";
import Dialog from "../ui/dialog";
import { StarsBackground } from "../background/stars";

interface LevelBrowserProps {

}

interface MenuItem {
	id: string;
	label: string;
}

const GRID_COLS = 3; // Number of columns in the grid
const menuItems: MenuItem[] = [
	{ id: '1', label: 'Home' },
	{ id: '2', label: 'About' },
	{ id: '3', label: 'Services' },
	{ id: '4', label: 'Contact' },
	{ id: '5', label: 'Settings' },
	{ id: '6', label: 'Profile' },
	{ id: '7', label: 'Messages' },
	{ id: '8', label: 'Dashboard' },
	{ id: '9', label: 'Help' },
];

const LevelBrowser: FC<LevelBrowserProps> = () => {

	const { levelBrowserActive, setLevelBrowserActive } = useApplicationStore();

	const [selectedIndex, setSelectedIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);


	const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
		const totalItems = menuItems.length;
		const currentRow = Math.floor(selectedIndex / GRID_COLS);
		const currentCol = selectedIndex % GRID_COLS;
		const totalRows = Math.ceil(totalItems / GRID_COLS);

		switch (e.key) {
			case 'ArrowUp': {
				e.preventDefault();
				const newIndex = selectedIndex - GRID_COLS;
				if (newIndex >= 0) {
					setSelectedIndex(newIndex);
				} else {
					// Wrap to bottom row in same column
					const lastRowIndex = Math.min(
						currentCol + GRID_COLS * (totalRows - 1),
						totalItems - 1
					);
					setSelectedIndex(lastRowIndex);
				}
				break;
			}
			case 'ArrowDown': {
				e.preventDefault();
				const newIndex = selectedIndex + GRID_COLS;
				if (newIndex < totalItems) {
					setSelectedIndex(newIndex);
				} else {
					// Wrap to top row in same column
					setSelectedIndex(currentCol);
				}
				break;
			}
			case 'ArrowLeft': {
				e.preventDefault();
				if (currentCol > 0) {
					setSelectedIndex(selectedIndex - 1);
				} else {
					// Wrap to end of row
					const lastColIndex = Math.min(
						selectedIndex - currentCol + (GRID_COLS - 1),
						totalItems - 1
					);
					setSelectedIndex(lastColIndex);
				}
				break;
			}
			case 'ArrowRight': {
				e.preventDefault();
				if (currentCol < GRID_COLS - 1 && selectedIndex < totalItems - 1) {
					setSelectedIndex(selectedIndex + 1);
				} else {
					// Wrap to start of row
					setSelectedIndex(selectedIndex - currentCol);
				}
				break;
			}
			case 'Enter':
				e.preventDefault();
				handleSelect(menuItems[selectedIndex]);
				break;
		}
	};


	const handleSelect = (item: MenuItem) => {
		console.log('Selected:', item.label);
		// Add your selection handling logic here
	};


	// Focus the container on mount and when clicking anywhere in the menu
	useEffect(() => {
		containerRef.current?.focus();
	}, []);

	const handleContainerClick = () => {
		containerRef.current?.focus();
	};


	// Add global keyboard event listeners
	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
				containerRef.current?.focus();
			}
		};

		window.addEventListener('keydown', handleGlobalKeyDown);
		return () => window.removeEventListener('keydown', handleGlobalKeyDown);
	}, []);

	return (
		<Dialog
			open={levelBrowserActive}
			onOpenChange={setLevelBrowserActive}
			className="max-w-5xl min-h-[calc(100vh_-_10rem)]"
		>
			<StarsBackground className="absolute z-0" />
			<div
				ref={containerRef}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				onClick={handleContainerClick}
				className="relative z-10 h-full flex flex-col justify-center items-center space-y-10 outline-none"
			>

				<div className="grid grid-cols-3 gap-2">
					{menuItems.map((item, index) => (
						<div
							key={item.id}
							className={`
              px-4 py-3 rounded-md cursor-pointer
              transition-colors duration-200 text-center
              ${index === selectedIndex
									? 'bg-blue-500 text-white'
									: 'hover:bg-gray-100'
								}
            `}
							onClick={() => {
								setSelectedIndex(index);
								handleSelect(item);
							}}
						>
							{item.label}
						</div>
					))}
				</div>


			</div>
		</Dialog>
	)
}

export default LevelBrowser;