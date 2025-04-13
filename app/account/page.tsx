"use client";

import { signOut } from "next-auth/react"; 
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";

export default function AccountPage() {
    const { data: session } = useSession(); 
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`/api/subscription?userId=${session.user.id}`);
                    const data = await response.json();
                    setSubscription(data);
                } catch (error) {
                    console.error('Error fetching subscription:', error);
                }
            }
            setLoading(false);
        };

        fetchSubscription();
    }, [session]);

    const handleSubscribe = async () => {
        try {
            const response = await fetch('/api/subscription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session?.user?.id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSubscription(data);
            } else {
                console.error('Failed to create subscription');
            }
        } catch (error) {
            console.error('Error creating subscription:', error);
        }
    };

    if (!session) {
        return <div>ログインが必要です</div>;
    }

    return (
        <div className="bg-gradient min-h-screen flex items-center justify-center">
            <div className="container">
                <h1 className="title">
                    <svg
                        className="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 12h9m0 0H7.5m9 0a4.5 4.5 0 100-9H9A4.5 4.5 0 007.5 12m9 0V21l-4.5-4.5H9a4.5 4.5 0 110-9"
                        />
                    </svg>
                    <span>アカウント情報</span>
                </h1>
                <div className="name">
                    <span>{session.user?.name}</span>
                </div>

                <div className="subscription-status">
                    <h2>サブスクリプション状態</h2>
                    {loading ? (
                        <p>読み込み中...</p>
                    ) : subscription ? (
                        <div>
                            <p>ステータス: {subscription.status === 'active' ? 'サブスク加入中' : '無料プラン'}</p>
                            {subscription.current_period_end && (
                                <p>次回更新日: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <p>現在無料プランです</p>
                            <button
                                onClick={handleSubscribe}
                                className="subscribe-button"
                            >
                                サブスクに加入する
                            </button>
                        </div>
                    )}
                </div>

                {/* ログアウトボタン */}
                <button className="logout-button" onClick={() => signOut({ callbackUrl: "/" })}>ログアウト</button>        
            </div>

            <style jsx>{`
                .bg-gradient {
                    background: linear-gradient(to bottom right, #fff5f7, #faf0ff);
                }
                .container {
                    max-width: 760px;
                    margin: 50px auto;
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    font-family: Arial, sans-serif;
                    color: #333;
                }
                .title {
                    font-size: 28px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .name {
                    font-size: 22px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin: 20px 0;
                }
                .icon {
                    width: 28px;
                    height: 28px;
                    color: #ff5a8d;
                }
                .subscription-status {
                    margin: 30px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .subscription-status h2 {
                    font-size: 20px;
                    margin-bottom: 15px;
                }
                .subscribe-button {
                    margin-top: 15px;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: white;
                    background-color: #4CAF50;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .subscribe-button:hover {
                    background-color: #45a049;
                }
                .logout-button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: white;
                    background-color: #ff5a8d;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .logout-button:hover {
                    background-color: #e04876;
                }
            `}</style>
        </div>
    );
}
