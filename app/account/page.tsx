"use client";

import { signOut } from "next-auth/react"; 
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";

interface Subscription {
    id: string;
    user_id: string;
    stripe_subscription_id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
}

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            if (status === 'loading') {
                return;
            }

            if (!session?.user?.id) {
                console.error('セッションまたはユーザーIDが見つかりません');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/subscription?userId=${session.user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSubscription(data);
                } else {
                    console.error('Failed to fetch subscription:', response.status);
                    setSubscription(null);
                }
            } catch (error) {
                console.error('Error fetching subscription:', error);
                setSubscription(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, [session, status]);

    const handleSubscribe = async () => {
        try {
            if (!session?.user?.id) {
                console.error('ユーザーIDが見つかりません');
                return;
            }

            setLoading(true);

            // 1. Stripe顧客の作成
            const customerResponse = await fetch('/api/stripe/customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                }),
            });

            if (!customerResponse.ok) {
                const errorData = await customerResponse.json();
                console.error('Failed to create Stripe customer:', customerResponse.status, errorData);
                throw new Error('Failed to create Stripe customer');
            }

            const { customerId } = await customerResponse.json();

            // 2. Stripeサブスクリプションの作成
            const subscriptionResponse = await fetch('/api/stripe/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId,
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, // 環境変数から取得
                }),
            });

            if (!subscriptionResponse.ok) {
                const errorData = await subscriptionResponse.json();
                console.error('Failed to create Stripe subscription:', subscriptionResponse.status, errorData);
                throw new Error('Failed to create Stripe subscription');
            }

            const subscriptionData = await subscriptionResponse.json();

            // 3. DBへの保存
            const dbResponse = await fetch('/api/db/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    stripeSubscriptionId: subscriptionData.subscriptionId,
                    status: subscriptionData.status,
                    currentPeriodStart: subscriptionData.currentPeriodStart,
                    currentPeriodEnd: subscriptionData.currentPeriodEnd,
                }),
            });

            if (dbResponse.ok) {
                const data = await dbResponse.json();
                if (data && Object.keys(data).length > 0) {
                    setSubscription(data);
                } else {
                    console.error('サブスクリプションデータが空です');
                    setSubscription(null);
                }
            } else {
                const errorData = await dbResponse.json();
                console.error('Failed to save subscription to database:', dbResponse.status, errorData);
                setSubscription(null);
            }
        } catch (error) {
            console.error('Error in subscription process:', error);
            setSubscription(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/subscription/cancel', {
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
                if (data && Object.keys(data).length > 0) {
                    setSubscription(data);
                } else {
                    console.error('サブスクリプションデータが空です');
                    setSubscription(null);
                }
            } else {
                console.error('Failed to cancel subscription:', response.status);
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        } finally {
            setLoading(false);
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
                    {/* <p className="user-id">ユーザーID: {session.user?.id || "未設定"}</p> */}
                </div>

                {/* デバッグ情報（開発中のみ表示） */}
                <div className="debug-info">
                    <h3>デバッグ情報</h3>
                    <pre>
                        {JSON.stringify({
                            sessionUser: session.user,
                            subscription: subscription
                        }, null, 2)}
                    </pre>
                </div>

                <div className="subscription-status">
                    {/* <h2>サブスクリプション状態</h2> */}
                    {loading ? (
                        <p>読み込み中...</p>
                    ) : subscription ? (
                        <div>
                            <p>ステータス: {subscription.status === 'active' ? 'サブスク加入中' : '無料プラン'}</p>
                            {subscription.current_period_end && (
                                <p>次回更新日: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                            )}
                            {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                                <button
                                    onClick={handleCancelSubscription}
                                    className="cancel-subscription-button"
                                    disabled={loading}
                                >
                                    {loading ? '処理中...' : 'サブスクを解約する'}
                                </button>
                            )}
                            {subscription.cancel_at_period_end && (
                                <div className="cancellation-scheduled">
                                    <p className="cancellation-message">サブスク解約予定</p>
                                    <p className="cancellation-date">
                                        解約日: {new Date(subscription.current_period_end).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <p>現在無料プランです</p>
                            <button
                                onClick={handleSubscribe}
                                className="subscribe-button"
                                disabled={loading}
                            >
                                {loading ? '処理中...' : 'サブスクに加入する'}
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
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin: 20px 0;
                }
                .user-id {
                    font-size: 14px;
                    color: #666;
                    margin-top: 5px;
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
                .subscription-id {
                    font-size: 12px;
                    color: #888;
                    font-family: monospace;
                }
                .debug-info {
                    margin-top: 20px;
                    padding: 10px;
                    background: #f5f5f5;
                    border-radius: 5px;
                    font-size: 12px;
                    text-align: left;
                    overflow: auto;
                    max-height: 300px;
                }
                .debug-info h3 {
                    font-size: 14px;
                    margin-bottom: 10px;
                    color: #666;
                }
                .debug-info pre {
                    white-space: pre-wrap;
                    word-break: break-all;
                }
                .cancel-subscription-button {
                    margin-top: 15px;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: white;
                    background-color: #ff5a8d;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .cancel-subscription-button:hover {
                    background-color: #e04876;
                }
                .cancellation-scheduled {
                    margin-top: 15px;
                    padding: 10px;
                    background-color: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                }
                .cancellation-message {
                    color: #6c757d;
                    font-weight: 500;
                    margin: 0;
                }
                .cancellation-date {
                    color: #6c757d;
                    font-size: 0.9em;
                    margin: 5px 0 0 0;
                }
            `}</style>
        </div>
    );
}
