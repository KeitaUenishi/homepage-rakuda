"use client";

import type { LiveFrontmatter } from "@/types/content";
import { useReservation } from "./ReservationContext";

interface LiveCardButtonsProps {
	frontmatter: LiveFrontmatter;
	buttonClass: string;
}

export default function LiveCardButtons({ frontmatter, buttonClass }: LiveCardButtonsProps) {
	const { openReservation } = useReservation();

	return (
		<div className="flex flex-col gap-2 mt-4">
			{frontmatter.detailUrl && (
				<a
					href={frontmatter.detailUrl}
					target="_blank"
					rel="noopener noreferrer"
					className={`${buttonClass} w-full text-center`}
				>
					詳細
				</a>
			)}
			<button
				type="button"
				onClick={() => openReservation(frontmatter)}
				className={`${buttonClass} w-full text-center`}
			>
				チケット予約
			</button>
		</div>
	);
}

