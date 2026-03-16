import Image from "next/image";
import LiveCard from "@/components/LiveCard";
import { ReservationProvider } from "@/components/ReservationContext";
import { getNextLive } from "@/lib/mdx";

const members = [
  { role: "Vo.", name: "森クリスタル", twitter: "ton69" },
  { role: "Dr.", name: "みやさきかく", twitter: "changachanga123" },
  { role: "Gt.", name: "yu-kai-han", twitter: "yu_kai_han" },
  { role: "Gt.", name: "つぎ", twitter: "tsugi_cockroach" },
  { role: "Gt. / Sax.", name: "鉄馬", twitter: "tetsumake" },
  { role: "Support Ba.", name: "NORITASO", twitter: "noname12ge" },
  { role: "Gt.", name: "かしわもち", twitter: "kashiwamo103" },
  { role: "Key.", name: "エイティン" },
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
              <p className="text-center text-sm text-(--muted) mt-2">
                のバンドです。
              </p>
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
              <a
                href="https://www.instagram.com/rakudanokobux/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md border-2 hover:scale-110 transition-transform"
                style={{ background: "#E1306C", borderColor: "#E1306C" }}
              >
                <span className="sr-only">Instagram</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@rakudanokobux"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                style={{ background: "#010101", border: "2px solid #333" }}
              >
                <span className="sr-only">TikTok</span>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"
                    fill="white"
                  />
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
								style={{ objectPosition: "center 20%" }}
								priority
							/>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-pop">
              <p className="text-sm leading-relaxed">
                大阪を拠点に活動する
                <span className="font-bold text-primary">
                  何人編成か分かりづらい
                </span>
                ロックバンド。
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
            {members.map((member, index) => {
              const content = (
                <>
                  <div className="member-badge mb-2">{member.role}</div>
                  <p className="font-bold text-sm">{member.name}</p>
                  {member.twitter && (
                    <p className="text-xs text-(--muted)">@{member.twitter}</p>
                  )}
                </>
              );
              const commonProps = {
                className: "card-pop animate-bounce-in opacity-0",
                style: { animationDelay: `${(index + 1) * 100}ms` },
              };

              return member.twitter ? (
                <a
                  key={member.name}
                  href={`https://x.com/${member.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...commonProps}
                >
                  {content}
                </a>
              ) : (
                <div key={member.name} {...commonProps}>
                  {content}
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-(--muted) mt-4">
            + ほか何人かのメンバー
          </p>
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
          <p className="text-xs text-(--muted)">
            © 2025 らくだのこぶX All Rights Reserved.
          </p>
        </footer>
      </main>
    </ReservationProvider>
  );
}
