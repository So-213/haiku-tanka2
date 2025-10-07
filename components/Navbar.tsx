// ./components/Navbar.tsx
"use client";



import Link from "next/link";
import { useState } from "react";  //開閉状態管理
import { useSession } from "next-auth/react"



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession(); 


  
  if (!session) return null;

  return (
    <nav className="navbar">
      {/* ハンバーガーボタン */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* ナビゲーションメニュー */}
      <ul className={`menu ${isOpen ? "open" : ""}`}>  
        <li>
            <Link href="/">ホーム</Link>
        </li> 
        <li>
            <Link href="/account">アカウント情報</Link>
        </li> 
        {/* <li>
          <Link href="/torihikihou">特定商取引法に基づく表記</Link>
        </li>  */}

      </ul>


      <style jsx>{`
        .navbar {
          position: fixed;
          top: 10px;
          left: 10px;
          background:rgb(246, 210, 239); /* 淡いピンク */
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        }

        /* ハンバーガーボタン */
        .hamburger {
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          color: #ff5a5f;
        }

        /* メニュー (デフォルトは非表示) */
        .menu {
          list-style: none;
          padding: 0;
          display: none; /* クリックされるまで非表示 */
          flex-direction: column;
          position: absolute;
          top: 40px; /* ハンバーガーのすぐ下 */
          left: 0;
          background: white;
          border: 1px solid #ff8c94;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          min-width: 180px; /* 幅を統一 */
          text-align: left;
        }

        /* ハンバーガークリック時に表示 */
        .menu.open {
          display: flex;
        }

        /* ボタン風リンク */
        .menu li {
          margin-bottom: 8px; /* ボタン間の余白 */
        }

        .menu li a {
          display: block !important; /* 確実に適用 */
          width: 100%; /* ボタン幅を固定 */
          padding: 12px 15px;
          background: #ffecec; /* 淡いピンク */
          border-radius: 6px;
          text-decoration: none;
          color: #d64550;
          font-weight: bold;
          text-align: center;
          border: 1px solid #ff8c94;
          transition: background 0.3s, transform 0.1s;
        }

        /* ホバー時 */
        .menu li a:hover {
          background: #ffccd5; /* ちょっと濃いピンク */
        }

        /* クリック時のエフェクト */
        .menu li a:active {
          transform: scale(0.96); /* クリック時に少し縮む */
        }
      `}</style>
    </nav>
  );
}
