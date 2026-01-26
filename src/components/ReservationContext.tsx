"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

import type { LiveFrontmatter } from "@/types/content";
import ReservationModal from "./ReservationModal";

interface ReservationContextType {
	openReservation: (live: LiveFrontmatter) => void;
	closeReservation: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: ReactNode }) {
	const [activeLive, setActiveLive] = useState<LiveFrontmatter | null>(null);

	const openReservation = (live: LiveFrontmatter) => {
		setActiveLive(live);
	};

	const closeReservation = () => {
		setActiveLive(null);
	};

	return (
		<ReservationContext.Provider value={{ openReservation, closeReservation }}>
			{children}
			{activeLive && (
				<ReservationModal live={activeLive} isOpen={!!activeLive} onClose={closeReservation} />
			)}
		</ReservationContext.Provider>
	);
}

export function useReservation() {
	const context = useContext(ReservationContext);
	if (context === undefined) {
		throw new Error("useReservation must be used within a ReservationProvider");
	}
	return context;
}
