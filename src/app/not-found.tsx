import Link from "next/link";

export default function NotFound() {
	return (
		<main className="page-content flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
			<div className="animate-bounce-in">
				<div className="text-8xl font-black text-primary mb-4">404</div>
				<h1 className="text-2xl font-black mb-6">Page Not Found</h1>

				<div className="card-pop mb-8 max-w-sm mx-auto">
					<p className="text-sm text-(--muted) leading-relaxed">
						お探しのページは見つかりませんでした。
						<br />
						移動または削除された可能性があります。
					</p>
				</div>

				<Link href="/" className="btn-pop btn-primary min-w-[200px]">
					トップページへ戻る
				</Link>
			</div>

			<div className="mt-12 opacity-20">
				<span className="text-6xl animate-wiggle inline-block">🐪</span>
			</div>
		</main>
	);
}
