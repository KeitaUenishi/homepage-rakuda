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
					<p className="text-(--muted) text-sm tracking-wide">
						お問い合わせ
					</p>
				</div>
			</section>

			{/* チケット予約案内 */}
			<section className="section">
				<div className="card-gradient bg-(--color-dark) text-secondary">
					<div className="flex items-center gap-3 mb-4">
						<span className="text-4xl animate-float">🎫</span>
						<div>
							<h2 className="font-black text-xl">チケット予約</h2>
							<p className="text-sm opacity-80">ライブチケットのお取り置き</p>
						</div>
					</div>
					<p className="text-sm opacity-80 mb-4">
						X(Twitter)のDMにて受け付けています！
						<br />
						お気軽にメッセージください。
					</p>
					<div className="bg-primary/20 rounded-lg p-4 mb-4">
						<p className="text-sm font-bold mb-2">DMに記載いただきたい内容：</p>
						<ul className="text-sm space-y-1 opacity-90">
							<li>• ご希望のライブ日程</li>
							<li>• お名前（フルネーム）</li>
							<li>• 枚数</li>
						</ul>
					</div>
					<a
						href="https://x.com/rakuda_no_kobu"
						target="_blank"
						rel="noopener noreferrer"
						className="btn-pop bg-primary text-(--color-dark) border-primary w-full"
					>
						予約のDMを送る
					</a>
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
									<p className="text-sm text-(--muted)">
										{method.description}
									</p>
								</div>
							</div>
							<a
								href={method.link}
								target="_blank"
								rel="noopener noreferrer"
								className={`btn-pop w-full ${
									method.isMain ? "btn-primary" : "btn-secondary"
								}`}
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
						イベントへの出演依頼やコラボレーションのご相談は、
						X(Twitter)のDMまでお願いします。
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
