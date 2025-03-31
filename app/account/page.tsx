"use client";

import { signOut } from "next-auth/react"; 
import { useSession } from "next-auth/react"


export default function AccountPage() {
    const { data: session } = useSession(); 
  


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
        <p className="name">{session?.user?.name} さん </p>

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
        }
        .icon {
          width: 28px;
          height: 28px;
          color: #ff5a8d;
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
