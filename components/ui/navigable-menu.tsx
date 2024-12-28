/**
 * A custom component for creating keyboard selectable menus
 * 
 */

import React, { useState, useEffect, useRef, KeyboardEvent as ReactKeyboardEvent } from 'react';

export type MenuLayout = 'vertical' | 'horizontal' | 'grid';

export interface MenuItem {
	id: string;
	[key: string]: any;
}

export interface MenuProps<T extends MenuItem> {
	items: T[];
	layout?: MenuLayout;
	gridCols?: number;
	onSelect?: (item: T) => void;
	children: (props: MenuRenderProps<T>) => React.ReactNode;
	className?: string;
}

export interface MenuRenderProps<T extends MenuItem> {
	item: T;
	isSelected: boolean;
	index: number;
}



function NavigableMenu<T extends MenuItem>({
	items,
	layout = 'vertical',
	gridCols = 3,
	onSelect,
	children,
	className = ''
}: MenuProps<T>) {

	const [selectedIndex, setSelectedIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);


	const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
		const totalItems = items.length;

		if (layout === 'grid') {
			const currentRow = Math.floor(selectedIndex / gridCols);
			const currentCol = selectedIndex % gridCols;
			const totalRows = Math.ceil(totalItems / gridCols);

			switch (e.key) {
				case 'ArrowUp': {
					e.preventDefault();
					const newIndex = selectedIndex - gridCols;
					if (newIndex >= 0) {
						setSelectedIndex(newIndex);
					} else {
						// Wrap to bottom row in same column
						const lastRowIndex = Math.min(
							currentCol + gridCols * (totalRows - 1),
							totalItems - 1
						);
						setSelectedIndex(lastRowIndex);
					}
					break;
				}
				case 'ArrowDown': {
					e.preventDefault();
					const newIndex = selectedIndex + gridCols;
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
							selectedIndex - currentCol + (gridCols - 1),
							totalItems - 1
						);
						setSelectedIndex(lastColIndex);
					}
					break;
				}
				case 'ArrowRight': {
					e.preventDefault();
					if (currentCol < gridCols - 1 && selectedIndex < totalItems - 1) {
						setSelectedIndex(selectedIndex + 1);
					} else {
						// Wrap to start of row
						setSelectedIndex(selectedIndex - currentCol);
					}
					break;
				}
			}
		} else {
			// Vertical or horizontal navigation
			const isVertical = layout === 'vertical';
			const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
			const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

			switch (e.key) {
				case prevKey: {
					e.preventDefault();
					setSelectedIndex((prev) =>
						prev > 0 ? prev - 1 : totalItems - 1
					);
					break;
				}
				case nextKey: {
					e.preventDefault();
					setSelectedIndex((prev) =>
						prev < totalItems - 1 ? prev + 1 : 0
					);
					break;
				}
			}
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			onSelect?.(items[selectedIndex]);
		}
	};


	useEffect(() => {
		containerRef.current?.focus();
	}, []);

	const handleContainerClick = () => {
		containerRef.current?.focus();
	};

	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			const navigationKeys = layout === 'grid'
				? ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
				: layout === 'vertical'
					? ['ArrowUp', 'ArrowDown']
					: ['ArrowLeft', 'ArrowRight'];

			if (navigationKeys.includes(e.key)) {
				containerRef.current?.focus();
			}
		};

		window.addEventListener('keydown', handleGlobalKeyDown);
		return () => window.removeEventListener('keydown', handleGlobalKeyDown);
	}, [layout]);

	const getLayoutClasses = () => {
		switch (layout) {
			case 'grid':
				return `grid grid-cols-${gridCols} gap-2`;
			case 'horizontal':
				return 'flex flex-row gap-2';
			case 'vertical':
			default:
				return 'flex flex-col gap-2';
		}
	};



	return (
		<div
			ref={containerRef}
			className={`focus:outline-none focus:ring-2 focus:ring-red-500 p-4 ${className}`}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			onClick={handleContainerClick}
		>
			<div className={getLayoutClasses()}>
				{items.map((item, index) => (
					<div
						key={item.id}
						onClick={() => {
							setSelectedIndex(index);
							onSelect?.(item);
						}}
						onMouseEnter={() => setSelectedIndex(index)} // Update selection on hover
						className={`menu-item ${index === selectedIndex ? 'selected' : ''}`}
						style={{
							cursor: 'pointer',
						}}
					>
						{children({
							item,
							isSelected: index === selectedIndex,
							index,
						})}
					</div>
				))}
			</div>
		</div>
	)
}

export default NavigableMenu;