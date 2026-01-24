import Image from "next/image";

const musicVideos = [
	{
		id: 1,
		title: "らくだのこぶX - 梅酒ロック MV",
		link: "https://youtu.be/UfJyGwKNDSM?si=zu0-2hZiohRq3ba6",
	},
	{
		id: 2,
		title: "みつはちゃん(MV)",
		link: "https://youtu.be/87JPONNHrs4?si=klfwYq8b62vzvCpO",
	},
	{
		id: 3,
		title: "らくだのこぶXライブ動画　あのクロBIGCAT公演2022",
		link: "https://youtu.be/NnRbw0Ck5S4?si=TzizmgK-qBioaPCf",
	},
];

const playlists = [
	{
		id: 1,
		name: "らくだのこぶX - All Songs",
		platform: "Apple Music",
		icon: "/Apple_Music_icon.svg",
		link: "https://music.apple.com/jp/artist/%E3%82%89%E3%81%8F%E3%81%A0%E3%81%AE%E3%81%93%E3%81%B6x/1527717402",
		color: "bg-white",
	},
	{
		id: 2,
		name: "らくだのこぶX - All Songs",
		platform: "Spotify",
		icon: "/Spotify_icon.svg",
		link: "https://open.spotify.com/intl-ja/artist/0MNcVFdtIlRwyE2slZgvbe",
		color: "bg-white",
	},
];

// YouTubeのリンクから動画IDを抽出する関数
function getYouTubeId(url: string): string {
	const regex =
		/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
	const match = url.match(regex);
	return match ? match[1] : "";
}

export default function MusicPage() {
	return (
		<main className="page-content">
			{/* ヘッダー */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-(--color-dark) opacity-5" />
				<div className="relative px-6 pt-12 pb-8">
					<h1 className="text-4xl font-black mb-2 animate-bounce-in tracking-tight">
						Music<span className="text-primary">.</span>
					</h1>
					<p className="text-(--muted) text-sm tracking-wide">音楽・映像コンテンツ</p>
				</div>
			</section>

			{/* YouTube Videos */}
			<section className="section">
				<h2 className="section-title title-pop">Videos</h2>

				<div className="space-y-6">
					{musicVideos.map((video, index) => {
						const videoId = getYouTubeId(video.link);
						return (
							<div
								key={video.id}
								className="card-pop animate-bounce-in opacity-0"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								{/* 埋め込みプレイヤー */}
								<div className="relative aspect-video rounded-lg mb-3 overflow-hidden bg-dark">
									{videoId ? (
										<iframe
											width="100%"
											height="100%"
											src={`https://www.youtube.com/embed/${videoId}`}
											title={video.title}
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
											allowFullScreen
											className="absolute inset-0"
										/>
									) : (
										<div className="flex items-center justify-center h-full text-secondary">
											動画を読み込めませんでした
										</div>
									)}
								</div>

								<h3 className="font-bold text-sm">{video.title}</h3>
							</div>
						);
					})}
				</div>
			</section>

			{/* プレイリスト */}
			<section className="section bg-secondary/50">
				<h2 className="section-title title-pop">Playlist</h2>

				<div className="space-y-3">
					{playlists.map((playlist) => (
						<a
							key={playlist.id}
							href={playlist.link}
							target="_blank"
							rel="noopener noreferrer"
							className="card-pop flex items-center gap-4"
						>
							<div
								className={`w-14 h-14 ${playlist.color} rounded-lg flex items-center justify-center overflow-hidden `}
							>
								<Image
									src={playlist.icon}
									alt={playlist.platform}
									width={40}
									height={40}
									className="object-contain"
								/>
							</div>
							<div className="flex-1">
								<h3 className="font-bold text-sm">{playlist.name}</h3>
								<p className="text-xs text-(--muted)">{playlist.platform}</p>
							</div>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="text-(--muted)"
								aria-hidden="true"
							>
								<polyline points="9 18 15 12 9 6" />
							</svg>
						</a>
					))}
				</div>
			</section>

			{/* YouTube チャンネル */}
			<section className="section">
				<div className="card-gradient bg-accent text-secondary">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="var(--color-accent)"
								aria-hidden="true"
							>
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
							</svg>
						</div>
						<div>
							<p className="font-bold">YouTubeチャンネル</p>
							<p className="text-sm opacity-80">チャンネル登録お願いします！</p>
						</div>
					</div>
					<a
						href="https://www.youtube.com/channel/UC-OKAbrcAqrRYuLvuiMt6oQ"
						target="_blank"
						rel="noopener noreferrer"
						className="btn-pop bg-secondary text-accent border-secondary w-full"
					>
						チャンネルを見る
					</a>
				</div>
			</section>
		</main>
	);
}
