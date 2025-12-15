import React from 'react';
import { Link } from 'react-router';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Age of Hero TRPG',
}) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold break-words">{title}</h1>
        <nav className="mt-4">
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <li>
              <Link
                to="/"
                className="block py-1 hover:text-blue-200 transition-colors"
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                to="/rules"
                className="block py-1 hover:text-blue-200 transition-colors"
              >
                ルール
              </Link>
            </li>
            <li>
              <Link
                to="/character-list"
                className="block py-1 hover:text-blue-200 transition-colors"
              >
                キャラクター一覧
              </Link>
            </li>
            {/* <li><Link to="/world" className="block py-1 hover:text-blue-200 transition-colors">ワールド</Link></li>
              <li><Link to="/character" className="block py-1 hover:text-blue-200 transition-colors text-sm sm:text-base">キャラクター作成</Link></li> */}
          </ul>
        </nav>
      </div>
    </header>

    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {children}
    </main>

    <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-12 sm:mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm sm:text-base">&copy; 2025 Age of Hero TRPG</p>
      </div>
    </footer>
  </div>
);
