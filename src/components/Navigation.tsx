"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{
		href: "/",
		label: "Home",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
				<polyline points="9 22 9 12 15 12 15 22" />
			</svg>
		),
	},
	{
		href: "/live",
		label: "Live",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M9 18V5l12-2v13" />
				<circle cx="6" cy="18" r="3" />
				<circle cx="18" cy="16" r="3" />
			</svg>
		),
	},
	{
		href: "/music",
		label: "Music",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<polygon points="10 8 16 12 10 16 10 8" />
			</svg>
		),
	},
	// {
	// 	href: "/release",
	// 	label: "Release",
	// 	icon: (
	// 		<svg
	// 			width="24"
	// 			height="24"
	// 			viewBox="0 0 24 24"
	// 			fill="none"
	// 			stroke="currentColor"
	// 			strokeWidth="2.5"
	// 			strokeLinecap="round"
	// 			strokeLinejoin="round"
	// 			aria-hidden="true"
	// 		>
	// 			<circle cx="12" cy="12" r="10" />
	// 			<circle cx="12" cy="12" r="3" />
	// 		</svg>
	// 	),
	// },
	{
		href: "/contact",
		label: "Contact",
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
				<polyline points="22,6 12,13 2,6" />
			</svg>
		),
	},
];

export default function Navigation() {
	const pathname = usePathname();

	return (
		<nav className="nav-fixed">
			<ul className="flex items-center justify-around">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<li key={item.href}>
							<Link
								href={item.href}
								className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
									isActive
										? "text-primary scale-110"
										: "text-(--muted) hover:text-foreground"
								}`}
							>
								<span
									className={`transition-transform duration-300 ${isActive ? "animate-bounce-in" : ""}`}
								>
									{item.icon}
								</span>
								<span
									className={`text-[10px] font-bold tracking-wide ${isActive ? "text-primary" : ""}`}
								>
									{item.label}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

