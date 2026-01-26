import Image from "next/image";
import LiveCard from "@/components/LiveCard";
import { getNextLive } from "@/lib/mdx";
import { ReservationProvider } from "@/components/ReservationContext";

const members = [
	{ role: "Vo.", name: "森クリスタル", twitter: "ton69" },
	{ role: "Dr.", name: "みやさきかく", twitter: "changachanga123" },
	{ role: "Gt.", name: "yu-kai-han", twitter: "yu_kai_han" },
	{ role: "Gt.", name: "つぎ", twitter: "tsugi_cockroach" },
	{ role: "Gt. / Sax.", name: "鉄馬", twitter: "tetsumake" },
	{ role: "Support Ba.", name: "NORITASO", twitter: "noname12ge" },
	{ role: "Gt.", name: "かしわもち", twitter: "kashiwamo103" },
	{ role: "Web / (時々)Gt.", name: "ウゑニシケイタ", twitter: "KMottmoti" },
];

export default function Home() {
	const nextLive = getNextLive();

	return (
		<ReservationProvider>
			<main className="page-content">
			{/* ヒーローセクション */}
			<section className="relative overflow-hidden">
				{/* 背景パターン */}
				<div className="absolute inset-0 opacity-5 pattern-dots" />

				{/* メインビジュアル */}
				<div className="relative px-6 pt-12 pb-8">
					{/* バンド名 */}
					<div className="text-center mb-8 animate-bounce-in">
						<div className="inline-block bg-(--color-dark) text-secondary px-4 py-1.5 rounded text-sm font-bold mb-3 tracking-wider">
							？？人編成ロックバンド
						</div>
						<h1 className="text-4xl font-black tracking-tight mb-2">
							らくだのこぶ
							<span className="text-primary ml-1">X</span>
						</h1>
						<p className="text-sm text-(--muted) font-medium tracking-widest">
							- RAKUDA NO KOBU CROSS -
						</p>
					</div>

					{/* キャッチコピー */}
					<div className="card-pop mb-6 animate-bounce-in delay-100 opacity-0">
						<p className="text-center font-bold text-lg leading-relaxed">
							<span className="text-accent">「</span>
							このジャンルで
							<br />
							こんなにギターいらんやろ
							<span className="text-accent">」</span>
						</p>
						<p className="text-center text-sm text-(--muted) mt-2">のバンドです。</p>
					</div>

					{/* SNSリンク */}
					<div className="flex justify-center gap-4 mb-8 animate-bounce-in delay-200 opacity-0">
						<a
							href="https://x.com/rakuda_no_kobu"
							target="_blank"
							rel="noopener noreferrer"
							className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary text-secondary shadow-md border-2 border-(--color-dark) hover:scale-110 transition-transform"
						>
							<span className="sr-only">X (Twitter)</span>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
						</a>
						<a
							href="https://www.youtube.com/channel/UC-OKAbrcAqrRYuLvuiMt6oQ"
							target="_blank"
							rel="noopener noreferrer"
							className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent/90 text-secondary shadow-md border-2 border-accent hover:scale-110 transition-transform"
						>
							<span className="sr-only">YouTube</span>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
							</svg>
						</a>
					</div>
				</div>
			</section>

			{/* プロフィールセクション */}
			<section className="section">
				<h2 className="section-title title-pop">Profile</h2>
				{/* プロフィール画像 */}
				<div className="mb-8 animate-bounce-in delay-75 opacity-0">
					<div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xl border-4 border-secondary">
						<Image
							src="/rakudanokobu-x-profile.jpg"
							alt="らくだのこぶX アーティスト写真"
							fill
							className="object-cover"
							priority
						/>
					</div>
				</div>

				<div className="space-y-4">
					<div className="card-pop">
						<p className="text-sm leading-relaxed">
							大阪を拠点に活動する
							<span className="font-bold text-primary">何人編成か分かりづらい</span>ロックバンド。
							<br />
							「KITA WHEEL
							2025」や、「こぶフェス」「あのフェス」など大阪でいろいろなイベントを主催したりしています。
						</p>
					</div>
				</div>
			</section>

			{/* メンバーセクション */}
			<section className="section bg-secondary/50">
				<h2 className="section-title title-pop">Members</h2>

				<div className="grid grid-cols-2 gap-3">
					{members.map((member, index) => (
						<a
							key={member.name}
							href={`https://x.com/${member.twitter}`}
							target="_blank"
							rel="noopener noreferrer"
							className="card-pop animate-bounce-in opacity-0"
							style={{ animationDelay: `${(index + 1) * 100}ms` }}
						>
							<div className="member-badge mb-2">{member.role}</div>
							<p className="font-bold text-sm">{member.name}</p>
							<p className="text-xs text-(--muted)">@{member.twitter}</p>
						</a>
					))}
				</div>

				<p className="text-center text-sm text-(--muted) mt-4">+ ほか何人かのメンバー</p>
			</section>

			{/* 次回ライブ情報 */}
			{nextLive && (
				<section className="section">
					<h2 className="section-title title-pop">Next Live</h2>

					<LiveCard frontmatter={nextLive.frontmatter} variant="dark" />
				</section>
			)}

			{/* フッター */}
			<footer className="section text-center pb-8">
				<p className="text-xs text-(--muted)">© 2025 らくだのこぶX All Rights Reserved.</p>
			</footer>
		</main>
		</ReservationProvider>
	);
}
