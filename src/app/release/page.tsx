import { notFound } from "next/navigation";

// const releases = [
// 	{
// 		id: 1,
// 		title: "Coming Soon...",
// 		type: "Album",
// 		year: "2026",
// 		description: "新作準備中！続報をお待ちください。",
// 		isUpcoming: true,
// 	},
// ];

// const achievements = [
// 	{
// 		id: 1,
// 		year: "2025",
// 		title: "KITA WHEEL 2025",
// 		description: "大阪北エリア一帯サーキットイベント主催決定",
// 		icon: "🎪",
// 	},
// 	{
// 		id: 2,
// 		year: "2023",
// 		title: "エマージェンザジャパン2023",
// 		description: "大阪準決勝突破・味園ユニバース決勝進出",
// 		icon: "🏆",
// 	},
// 	{
// 		id: 3,
// 		year: "2017",
// 		title: "バンド結成",
// 		description: "8人編成ロックバンド「らくだのこぶX」始動",
// 		icon: "🐪",
// 	},
// ];

export default function ReleasePage() {
	// TODO： 必要であれば作成 一旦保留
	return notFound();

	// return (
	// 	<main className="page-content">
	// 		{/* ヘッダー */}
	// 		<section className="relative overflow-hidden">
	// 			<div className="absolute inset-0 bg-(--color-dark) opacity-5" />
	// 			<div className="relative px-6 pt-12 pb-8">
	// 				<h1 className="text-4xl font-black mb-2 animate-bounce-in tracking-tight">
	// 					Release<span className="text-primary">.</span>
	// 				</h1>
	// 				<p className="text-(--muted) text-sm tracking-wide">
	// 					リリース情報
	// 				</p>
	// 			</div>
	// 		</section>

	// 		{/* リリース情報 */}
	// 		<section className="section">
	// 			<h2 className="section-title title-pop">Discography</h2>

	// 			<div className="space-y-4">
	// 				{releases.map((release, index) => (
	// 					<div
	// 						key={release.id}
	// 						className={`card-pop animate-bounce-in opacity-0 ${
	// 							release.isUpcoming
	// 								? "border-dashed border-primary"
	// 								: ""
	// 						}`}
	// 						style={{ animationDelay: `${index * 100}ms` }}
	// 					>
	// 						{/* ジャケット */}
	// 						<div className="relative aspect-square bg-secondary rounded-lg mb-4 flex items-center justify-center">
	// 							{release.isUpcoming ? (
	// 								<div className="text-center">
	// 									<span className="text-6xl animate-float inline-block">🐪</span>
	// 									<p className="mt-2 text-sm font-bold text-(--muted)">
	// 										Coming Soon
	// 									</p>
	// 								</div>
	// 							) : (
	// 								<span className="text-8xl">💿</span>
	// 							)}
	// 						</div>

	// 						<div className="flex items-start justify-between mb-2">
	// 							<div>
	// 								<span className="inline-block bg-primary text-(--color-dark) text-xs font-bold px-2 py-1 rounded mb-2">
	// 									{release.type}
	// 								</span>
	// 								<h3 className="font-black text-lg">{release.title}</h3>
	// 							</div>
	// 							<span className="text-sm font-bold text-(--muted)">
	// 								{release.year}
	// 							</span>
	// 						</div>

	// 						<p className="text-sm text-(--muted)">{release.description}</p>
	// 					</div>
	// 				))}
	// 			</div>
	// 		</section>

	// 		{/* お知らせ */}
	// 		<section className="section bg-secondary/50">
	// 			<div className="card-pop">
	// 				<div className="flex items-center gap-3 mb-4">
	// 					<span className="text-3xl animate-wiggle inline-block">📢</span>
	// 					<div>
	// 						<p className="font-bold">最新情報はX(Twitter)で！</p>
	// 						<p className="text-sm text-(--muted)">
	// 							リリース情報をいち早くお届け
	// 						</p>
	// 					</div>
	// 				</div>
	// 				<a
	// 					href="https://x.com/rakuda_no_kobu"
	// 					target="_blank"
	// 					rel="noopener noreferrer"
	// 					className="btn-pop btn-primary w-full"
	// 				>
	// 					@rakuda_no_kobu
	// 				</a>
	// 			</div>
	// 		</section>

	// 		{/* History / Achievements */}
	// 		<section className="section">
	// 			<h2 className="section-title title-pop">History</h2>

	// 			<div className="relative">
	// 				{/* タイムライン線 */}
	// 				<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/30" />

	// 				<div className="space-y-6">
	// 					{achievements.map((achievement, index) => (
	// 						<div
	// 							key={achievement.id}
	// 							className="relative pl-16 animate-bounce-in opacity-0"
	// 							style={{ animationDelay: `${(index + 1) * 150}ms` }}
	// 						>
	// 							{/* タイムラインドット */}
	// 							<div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-primary border-4 border-background" />

	// 							<div className="card-pop">
	// 								<div className="flex items-center gap-2 mb-2">
	// 									<span className="text-2xl">{achievement.icon}</span>
	// 									<span className="text-sm font-bold text-primary">
	// 										{achievement.year}
	// 									</span>
	// 								</div>
	// 								<h3 className="font-bold mb-1">{achievement.title}</h3>
	// 								<p className="text-sm text-(--muted)">
	// 									{achievement.description}
	// 								</p>
	// 							</div>
	// 						</div>
	// 					))}
	// 				</div>
	// 			</div>
	// 		</section>
	// 	</main>
	// );
}
