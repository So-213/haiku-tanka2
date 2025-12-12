export default function AccountPage() {
    return (
        <div className="bg-gradient min-h-screen flex items-center justify-center">
            <div className="container">
                <h1 className="title">このページは利用できません</h1>
                <p className="message">
                    このバージョンでは認証機能が無効化されています。
                    <br />
                    アカウント情報の表示はできません。
                </p>
                <a href="/" className="home-link">ホームに戻る</a>
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
                    margin-bottom: 20px;
                }
                .message {
                    font-size: 16px;
                    margin: 20px 0;
                    line-height: 1.6;
                }
                .home-link {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: white;
                    background-color: #ff5a8d;
                    border: none;
                    border-radius: 8px;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                }
                .home-link:hover {
                    background-color: #e04876;
                }
            `}</style>
        </div>
    );
}
