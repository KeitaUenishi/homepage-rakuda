"use client";

import { useState } from "react";
import type { LiveFrontmatter } from "@/types/content";

interface ReservationModalProps {
	live: LiveFrontmatter;
	isOpen: boolean;
	onClose: () => void;
}

export default function ReservationModal({ live, isOpen, onClose }: ReservationModalProps) {
	const [name, setName] = useState("");
	const [count, setCount] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			// Cloudflare Worker の URL (本番環境のURLに置き換えてください)
			const workerUrl = process.env.NEXT_PUBLIC_RESERVATION_API_URL;
			if (!workerUrl) {
				throw new Error("RESERVATION_API_URL is not set");
			}

			const response = await fetch(workerUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					count,
					liveTitle: live.title,
					liveDate: live.date,
				}),
			});

			if (!response.ok) {
				throw new Error("予約の送信に失敗しました。時間をおいて再度お試しください。");
			}

			setIsSuccess(true);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : "エラーが発生しました。";
			setError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
			<div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-bounce-in">
				{/* ヘッダー */}
				<div className="bg-primary p-6 text-(--color-dark)">
					<h2 className="text-xl font-black mb-1">チケット予約</h2>
					<p className="text-sm font-bold opacity-80">{live.title}</p>
				</div>

				<div className="p-6 text-(--color-dark)">
					{isSuccess ? (
						<div className="text-center py-8">
							<div className="text-5xl mb-4">✅</div>
							<h3 className="text-xl font-black mb-2">送信完了しました！</h3>
							<p className="text-(--muted) mb-6">
								ご予約ありがとうございます。
								<br />
								当日会場受付にてお名前をお伝えください。
							</p>
							<button
								type="button"
								onClick={onClose}
								className="btn-pop btn-primary w-full text-(--color-dark)"
							>
								閉じる
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label htmlFor="name" className="block text-sm font-black mb-1">
									お名前
								</label>
								<input
									type="text"
									id="name"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="お名前（フルネーム）"
									className="w-full px-4 py-2 border-2 border-(--muted)/20 rounded-lg focus:border-primary outline-none transition-colors text-(--color-dark)"
								/>
							</div>

							<div>
								<p className="block text-sm font-black mb-1">枚数</p>
								<div className="flex items-center gap-4">
									<button
										type="button"
										onClick={() => setCount(Math.max(1, count - 1))}
										className="w-10 h-10 flex items-center justify-center border-2 border-(--muted)/20 rounded-lg font-bold hover:bg-primary/10 transition-colors text-(--color-dark)"
									>
										-
									</button>
									<span className="text-lg font-black w-8 text-center">{count}</span>
									<button
										type="button"
										onClick={() => setCount(count + 1)}
										className="w-10 h-10 flex items-center justify-center border-2 border-(--muted)/20 rounded-lg font-bold hover:bg-primary/10 transition-colors text-(--color-dark)"
									>
										+
									</button>
								</div>
							</div>

							{error && <p className="text-red-500 text-sm font-bold">{error}</p>}

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={onClose}
									className="btn-pop bg-(--muted)/10 flex-1 text-(--color-dark) font-bold"
								>
									キャンセル
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="btn-pop btn-primary flex-1 disabled:opacity-50 text-(--color-dark) font-bold"
								>
									{isSubmitting ? "送信中..." : "予約を確定する"}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
