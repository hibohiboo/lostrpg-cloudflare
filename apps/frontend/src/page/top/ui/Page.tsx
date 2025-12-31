import { Link } from 'react-router';
// @ts-expect-error assets alias might not be configured in tsconfig, but vite handles it. Using relative path just in case.
import bgImage from '../../../assets/ruins_forest_bg.png';

export const Page = () => (
  <div className="min-h-screen relative flex flex-col items-center justify-center text-white overflow-hidden font-sans">
    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <img
        src={bgImage}
        alt="Ruins and Forest Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />{' '}
      {/* Overlay for readability */}
    </div>

    {/* Content Container */}
    <div className="relative z-10 container mx-auto px-4 text-center">
      {/* Hero Section */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg tracking-tight font-serif">
        Lost RPG
      </h1>
      <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto drop-shadow-md text-gray-200 leading-relaxed">
        文明崩壊後の世界で、新たな冒険が始まる。
        <br />
        廃墟と森の奥深く、子供たちのサバイバル。
      </p>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <a
          href="https://lostrpg-751c1.firebaseapp.com/lost/"
          target="_blank"
          rel="noopener noreferrer"
          className="group block p-8 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 hover:border-emerald-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-900/20 hover:shadow-2xl"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            📓
          </div>
          <h2 className="text-2xl font-bold mb-3 text-emerald-300 group-hover:text-emerald-200">
            ルールブック
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            この世界の掟と
            <br />
            生存のための知識を確認する
          </p>
        </a>

        <Link
          to="/camp"
          className="group block p-8 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-900/20 hover:shadow-2xl"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            ⛺
          </div>
          <h2 className="text-2xl font-bold mb-3 text-amber-300 group-hover:text-amber-200">
            キャンプ
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            仲間との休息、
            <br />
            次の探索への準備を整える
          </p>
        </Link>

        <Link
          to="/character"
          className="group block p-8 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 hover:border-sky-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-sky-900/20 hover:shadow-2xl"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            🧢
          </div>
          <h2 className="text-2xl font-bold mb-3 text-sky-300 group-hover:text-sky-200">
            キャラクター
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            自身の能力を確認し、
            <br />
            生き残る術を磨く
          </p>
        </Link>
      </div>

      <div className="mt-20 text-xs text-gray-500 font-mono tracking-widest uppercase">
        System Operational // Connected
      </div>
    </div>
  </div>
);
