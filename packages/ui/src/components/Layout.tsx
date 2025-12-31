import React from 'react';
import { Link } from 'react-router';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'LOSTRPGサポートツール',
}) => (
  <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
    <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight hover:text-emerald-400 transition-colors duration-300 font-serif"
          >
            {title}
          </Link>
          <nav className="mt-4 sm:mt-0">
            <ul className="flex space-x-1 sm:space-x-4 overflow-x-auto w-full justify-center sm:justify-end pb-2 sm:pb-0">
              <li>
                <a
                  href="https://lostrpg-751c1.firebaseapp.com/lost/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-emerald-400 transition-all duration-300 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    📜
                  </span>
                  <span className="hidden sm:inline font-medium">
                    ルールブック
                  </span>
                </a>
              </li>
              <li>
                <Link
                  to="/camp"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-amber-400 transition-all duration-300 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    ⛺
                  </span>
                  <span className="hidden sm:inline font-medium">キャンプ</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/character"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-sky-400 transition-all duration-300 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    👤
                  </span>
                  <span className="hidden sm:inline font-medium">
                    キャラクター
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
      {children}
    </main>

    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center bg-slate-900">
        <p className="text-sm font-mono tracking-wider">
          &copy; 2025 LOSTRPG / SYSTEM ONLINE
        </p>
      </div>
    </footer>
  </div>
);
