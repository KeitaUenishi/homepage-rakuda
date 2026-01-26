import LiveCard from "@/components/LiveCard";
import { ReservationProvider } from "@/components/ReservationContext";
import { getPickupLives, getUpcomingLives } from "@/lib/mdx";

export default function LivePage() {
	const upcomingLives = getUpcomingLives(10);
	const pickupLives = getPickupLives();

	return (
		<ReservationProvider>
			<main className="page-content">
				{/* ヘッダー */}
				<section className="relative overflow-hidden">
					<div className="absolute inset-0 bg-(--color-dark) opacity-5" />
					<div className="relative px-6 pt-12 pb-8">
						<h1 className="text-4xl font-black mb-2 animate-bounce-in tracking-tight">
							Live<span className="text-primary">.</span>
						</h1>
						<p className="text-(--muted) text-sm tracking-wide">ライブ情報</p>
					</div>
				</section>

				{/* Pickup */}
				{pickupLives.length > 0 && (
					<section className="section">
						<h2 className="section-title title-pop">Pickup</h2>

						{pickupLives.map((live, index) => (
							<LiveCard
								key={live.slug}
								frontmatter={live.frontmatter}
								variant="highlight"
								animationDelay={index * 100}
							/>
						))}
					</section>
				)}

				{/* スケジュール */}
				<section className="section">
					<h2 className="section-title title-pop">スケジュール</h2>

					{upcomingLives.length === 0 ? (
						<div className="card-pop text-center py-8">
							<p className="text-(--muted)">現在予定されているライブはありません</p>
						</div>
					) : (
						upcomingLives.map((live, index) => (
							<LiveCard
								key={live.slug}
								frontmatter={live.frontmatter}
								variant="default"
								animationDelay={index * 100}
							/>
						))
					)}
				</section>

				{/* チケット予約方法 */}
				<section className="section bg-secondary/50">
					<h2 className="section-title title-pop">チケット予約</h2>

					<div className="card-pop">
						<div className="flex items-center gap-3 mb-4">
							<span className="text-3xl">🎫</span>
							<div>
								<p className="font-bold">X(Twitter) DMで受付中！</p>
								<p className="text-sm text-(--muted)">お気軽にお問い合わせください</p>
							</div>
						</div>

						<a
							href="https://x.com/rakuda_no_kobu"
							target="_blank"
							rel="noopener noreferrer"
							className="btn-pop btn-primary w-full"
						>
							DMを送る
						</a>
					</div>
				</section>
			</main>
		</ReservationProvider>
	);
}
