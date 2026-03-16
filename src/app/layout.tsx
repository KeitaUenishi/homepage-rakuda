import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const zenMaruGothic = Zen_Maru_Gothic({
	weight: ["400", "500", "700", "900"],
	subsets: ["latin"],
	variable: "--font-main",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://rakudanokobux.org"),
	title: "らくだのこぶX | 何人編成か分かりづらいバンド",
	description:
		"このジャンルでこんなにギターいらんやろ、のバンドです。8人編成の大阪発ロックバンド「らくだのこぶX」公式サイト",
	keywords: ["らくだのこぶX", "ロックバンド", "大阪", "ライブ", "8人編成"],
	openGraph: {
		title: "らくだのこぶX | 何人編成か分かりづらいバンド",
		description: "このジャンルでこんなにギターいらんやろ、のバンド",
		type: "website",
		locale: "ja_JP",
		images: [
			{
				url: "/rakudanokobu-x-profile.jpg",
				width: 400,
				height: 400,
				alt: "らくだのこぶX アーティスト写真",
			},
		],
	},
	twitter: {
		card: "summary",
		site: "@rakuda_no_kobu",
		images: ["/rakudanokobu-x-profile.jpg"],
	},
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: "#ff6b35",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={`${zenMaruGothic.variable} antialiased`}>
				<div className="mobile-container">
					{children}
					<Navigation />
				</div>
			</body>
		</html>
	);
}
