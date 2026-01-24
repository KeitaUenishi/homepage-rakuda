import Link from "next/link";
import type { LiveFrontmatter } from "@/types/content";

type LiveCardVariant = "default" | "highlight" | "dark";

interface LiveCardProps {
	frontmatter: LiveFrontmatter;
	variant?: LiveCardVariant;
	animationDelay?: number;
}

// 日付から曜日を取得
function getWeekday(dateString: string): string {
	const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
	const date = new Date(dateString);
	return weekdays[date.getDay()];
}

// 日付をYYYY.MM.DD形式に変換
function formatDate(dateString: string): string {
	return dateString.replace(/-/g, ".");
}

export default function LiveCard({
	frontmatter,
	variant = "default",
	animationDelay = 0,
}: LiveCardProps) {
	const cardClass = {
		default: "card-pop",
		highlight: "card-gradient bg-accent text-secondary",
		dark: "card-gradient bg-(--color-dark) text-secondary",
	}[variant];

	const weekdayBadgeClass = {
		default: "bg-secondary",
		highlight: "bg-primary/20",
		dark: "bg-primary/20",
	}[variant];

	const subtitleClass = {
		default: "text-(--muted)",
		highlight: "opacity-80",
		dark: "opacity-80",
	}[variant];

	const detailsClass = {
		default: "text-(--muted)",
		highlight: "opacity-90",
		dark: "opacity-90",
	}[variant];

	const buttonClass = {
		default: "btn-pop btn-primary",
		highlight: "btn-pop bg-primary text-(--color-dark) border-primary",
		dark: "btn-pop bg-primary text-(--color-dark) border-primary",
	}[variant];

	return (
		<div
			className={`${cardClass} mb-4 animate-bounce-in opacity-0`}
			style={{ animationDelay: `${animationDelay}ms` }}
		>
			{/* 日付表示 */}
			<div className="flex items-baseline gap-3 mb-2">
				<span className="text-2xl font-black">{formatDate(frontmatter.date)}</span>
				<span className={`text-sm font-bold px-2 py-0.5 rounded ${weekdayBadgeClass}`}>
					{getWeekday(frontmatter.date)}
				</span>
			</div>

			{/* タイトル */}
			<h3 className="font-black text-lg mb-1">{frontmatter.title}</h3>

			{/* サブタイトル */}
			{frontmatter.subTitle && (
				<p className={`text-sm mb-3 ${subtitleClass}`}>『{frontmatter.subTitle}』</p>
			)}

			{/* 出演者 */}
			{frontmatter.act && frontmatter.act.length > 0 && (
				<p className={`text-sm mb-3 ${subtitleClass}`}>🎤 {frontmatter.act.join(" / ")}</p>
			)}

			{/* 詳細情報 */}
			<div className={`space-y-1 text-sm ${detailsClass}`}>
				<p>📍 {frontmatter.venue}</p>
				<p>
					🚪 OPEN {frontmatter.openTime} / START {frontmatter.startTime}
				</p>
				<p>🎫 {frontmatter.price}</p>
			</div>

			{/* 予約ボタン */}
			<Link href="/contact" className={`${buttonClass} mt-4 w-full`}>
				チケット予約
			</Link>
		</div>
	);
}
