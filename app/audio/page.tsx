"use client";

import { useState } from 'react';

export default function TextToSpeech() {
	const [text, setText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	console.log(text);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

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

			// Create audio blob and play it
			const audioBlob = await response.blob();
			const audioUrl = URL.createObjectURL(audioBlob);
			const audio = new Audio(audioUrl);
			audio.play();
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 relative z-50">
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				className="w-full p-2 border rounded text-black"
				rows={4}
				placeholder="Enter text to convert to speech..."
			/>
			<button
				type="submit"
				disabled={isLoading}
				className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
			>
				{isLoading ? 'Converting...' : 'Convert to Speech'}
			</button>
		</form>
	);
}