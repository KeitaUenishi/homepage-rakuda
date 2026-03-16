const contactMethods = [
	{
		id: 1,
		name: "X (Twitter) DM",
		description: "チケット取り置き・お問い合わせはこちら",
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
			</svg>
		),
		link: "https://x.com/rakuda_no_kobu",
		buttonText: "DMを送る",
		color: "bg-(--color-dark)",
		isMain: true,
	},
	{
		id: 2,
		name: "YouTube",
		description: "ライブ映像・MV公開中",
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
			</svg>
		),
		link: "https://www.youtube.com/channel/UC-OKAbrcAqrRYuLvuiMt6oQ",
		buttonText: "チャンネルへ",
		color: "bg-accent",
		isMain: false,
	},
	{
		id: 3,
		name: "Instagram",
		description: "写真・日常を発信中",
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
			</svg>
		),
		link: "https://www.instagram.com/rakudanokobux/",
		buttonText: "フォローする",
		color: "bg-[#E1306C]",
		isMain: false,
	},
	{
		id: 4,
		name: "TikTok",
		description: "ショート動画公開中",
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
			</svg>
		),
		link: "https://www.tiktok.com/@rakudanokobux",
		buttonText: "フォローする",
		color: "bg-(--color-dark)",
		isMain: false,
	},
];

export default function ContactPage() {
	return (
		<main className="page-content">
			{/* ヘッダー */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-(--color-dark) opacity-5" />
				<div className="relative px-6 pt-12 pb-8">
					<h1 className="text-4xl font-black mb-2 animate-bounce-in tracking-tight">
						Contact<span className="text-primary">.</span>
					</h1>
					<p className="text-(--muted) text-sm tracking-wide">お問い合わせ</p>
				</div>
			</section>

			{/* 連絡方法 */}
			<section className="section">
				<h2 className="section-title title-pop">SNS</h2>

				<div className="space-y-4">
					{contactMethods.map((method, index) => (
						<div
							key={method.id}
							className={`card-pop animate-bounce-in opacity-0 ${
								method.isMain ? "border-primary" : ""
							}`}
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<div className="flex items-center gap-4 mb-4">
								<div
									className={`w-14 h-14 ${method.color} text-secondary rounded-lg flex items-center justify-center`}
								>
									{method.icon}
								</div>
								<div>
									<h3 className="font-bold">{method.name}</h3>
									<p className="text-sm text-(--muted)">{method.description}</p>
								</div>
							</div>
							<a
								href={method.link}
								target="_blank"
								rel="noopener noreferrer"
								className={`btn-pop w-full ${method.isMain ? "btn-primary" : "btn-secondary"}`}
							>
								{method.buttonText}
							</a>
						</div>
					))}
				</div>
			</section>

			{/* ライブブッキング */}
			<section className="section bg-secondary/50">
				<h2 className="section-title title-pop">ライブブッキング</h2>

				<div className="card-pop">
					<div className="flex items-center gap-3 mb-4">
						<span className="text-3xl">🎤</span>
						<div>
							<p className="font-bold">イベント出演依頼</p>
						</div>
					</div>
					<p className="text-sm text-(--muted) mb-4">
						イベントへの出演依頼やコラボレーションのご相談は、 X(Twitter)のDMまでお願いします。
					</p>
					<a
						href="https://x.com/rakuda_no_kobu"
						target="_blank"
						rel="noopener noreferrer"
						className="btn-pop btn-primary w-full"
					>
						お問い合わせする
					</a>
				</div>
			</section>

			{/* バンド情報 */}
			<section className="section">
				<h2 className="section-title title-pop">Band Info</h2>

				<div className="card-pop">
					<div className="space-y-4">
						<div>
							<p className="text-sm text-(--muted) mb-1">バンド名</p>
							<p className="font-bold text-lg">
								らくだのこぶX<span className="text-sm">（クロス）</span>
							</p>
						</div>
						<div>
							<p className="text-sm text-(--muted) mb-1">活動拠点</p>
							<p className="font-bold">大阪</p>
						</div>
						<div>
							<p className="text-sm text-(--muted) mb-1">X (Twitter)</p>
							<a
								href="https://x.com/rakuda_no_kobu"
								target="_blank"
								rel="noopener noreferrer"
								className="font-bold text-primary hover:underline"
							>
								@rakuda_no_kobu
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
