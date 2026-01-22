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
	title: "らくだのこぶX | ポップロックバンド",
	description:
		"このジャンルでこんなギターいらんやろ、のバンドです。8人編成の大阪発ポップロックバンド「らくだのこぶX」公式サイト",
	keywords: ["らくだのこぶX", "ロックバンド", "大阪", "ライブ", "8人編成"],
	openGraph: {
		title: "らくだのこぶX | ポップロックバンド",
		description: "このジャンルでこんなギターいらんやろ、の8人編成バンド",
		type: "website",
		locale: "ja_JP",
	},
	twitter: {
		card: "summary_large_image",
		site: "@rakuda_no_kobu",
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
