import React from 'react';
import { FaToolbox } from 'react-icons/fa6';
import {
  GiClapperboard,
  GiStairsGoal,
  GiConversation,
  GiSwordClash,
  GiTrophy,
  GiTheaterCurtains,
  GiCog,
  GiMagnifyingGlass,
  GiCrossedSwords,
  GiLifeInTheBalance,
  GiShakingHands,
  GiSkullCrack,
  GiHealthPotion,
  GiUpgrade,
  GiTreasureMap,
} from 'react-icons/gi';
import { Link } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';

export const SessionProgressPage: React.FC = () => {
  const sessionFlow = [
    { title: 'セッションの事前準備', icon: GiCog, color: 'bg-gray-100' },
    { title: 'オープニングパート', icon: GiClapperboard, color: 'bg-blue-100' },
    { title: 'ミドルパート', icon: GiStairsGoal, color: 'bg-green-100' },
    { title: 'クライマックスパート', icon: GiSwordClash, color: 'bg-red-100' },
    {
      title: 'エンディングパート',
      icon: GiTheaterCurtains,
      color: 'bg-purple-100',
    },
    { title: 'セッションの事後処理', icon: GiTrophy, color: 'bg-yellow-100' },
  ];

  const middlePartActivities = [
    {
      title: '情報収集',
      icon: GiMagnifyingGlass,
      description:
        '起こっている事件や残された証拠をもとにヴィランについての調査を行う。〈情報〉〈交渉〉や〈社会〉や〈コネ〉技能のうち、状況に適したものを用いて情報収集を行う。',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: '戦闘',
      icon: GiCrossedSwords,
      description: 'ヴィランの配下などと戦闘を行う。戦闘ルールを参照のこと。',
      color: 'bg-red-50 border-red-200',
    },
    {
      title: '救助',
      icon: GiLifeInTheBalance,
      description:
        '街において発生した事件や災害に対処する。〈パワー〉で倒壊した建物のがれきをどかす、〈医療〉や〈魔術〉を使用して被害者の治療を行うなどだ。',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: '合流',
      icon: GiShakingHands,
      description:
        '調査を進める、事件や戦闘が発生するといった中で他のヒーローたちと出会い合流する。一人では困難なことでも、他のヒーローと力を合わせれば解決できる範囲は大きく広がる。',
      color: 'bg-purple-50 border-purple-200',
    },
  ];

  const postSessionTasks = [
    {
      title: '死亡したＰＣの、ゲームからの除外',
      icon: GiSkullCrack,
    },
    {
      title: 'ＨＰ、ＳＰへのダメージの消去',
      icon: GiHealthPotion,
    },
    {
      title: 'ヒーロースキルや必殺技の使用回数の回復',
      icon: GiUpgrade,
    },
    {
      title:
        '消費したアイテムの回復、セッション中に調達、強化したアイテムの初期化',
      icon: GiTreasureMap,
    },
    {
      title: '経験点の配布',
      icon: GiUpgrade,
    },
  ];

  return (
    <article className="max-w-4xl mx-auto">
      <PageHeader title="セッションの進行" description="" centered />

      <div className="space-y-12">
        <Section title="セッションの流れ" icon="🎬">
          <p className="text-gray-600 mb-6">
            セッションは大まかに以下のような手順になる。
          </p>
          <div className="grid gap-4">
            {sessionFlow.map((phase, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 ${phase.color} rounded-lg border border-gray-200`}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <phase.icon size={24} className="text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{phase.title}</h3>
                </div>
                <div className="text-2xl font-bold text-gray-400">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="シーン" icon="🎭">
          <p className="text-gray-600 mb-4">
            セッション開始後の各パートはいくつかの「シーン」という単位に分けられる。これは映画やカートゥーンにおける「場面」や「カット」と同じようなものだ。
          </p>
          <p className="text-gray-600 mb-4">
            「Age of
            Hero」においてヒーローはシーンに登場していない限り技能やヒーロースキルを使用した行動を行えない。映画などにおいて「カメラが回っている」状態がシーンであるのだ。シーンには基本的に一人以上のＰＣが登場している必要がある。
          </p>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              シーンの設定について
            </h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>
                •
                ＧＭはシナリオ作成時にそのシーンに登場するPCを決めておいてもよい
              </li>
              <li>• 登場制限のあるシーンを設定してもよい</li>
              <li>
                •
                登場制限のないシーンでは、登場していないキャラクターはＧＭや他ＰＬの許可が得られればいつでも登場してもよい
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">
              ＰＣが登場しないシーン
            </h4>
            <p className="text-yellow-700 text-sm">
              セッションにおいて１～２シーンほど、ＰＣの登場しないシーンを設定することも可能だ。例えばヴィランがヒーローのいない場所で事件を起こすシーンなどだ。こういったシーンにはＰＣが登場できないと設定してもよい。
            </p>
          </div>

          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <p className="text-green-800 text-sm">
              <strong>シーンの提案：</strong>
              <br />
              ＰＬ側は「このような行動を描写するシーンを作りたい」と提案してもよい。ＧＭはこれを受けて新たにシーンを設けても構わないし、状況に即していないと感じるならば提案を退けてもよい。
            </p>
          </div>
        </Section>

        <Section title="セッションの事前準備" icon="⚙️">
          <p className="text-gray-600 mb-6">
            セッションが始まる前には、いくつかの準備をしておく必要がある。
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <GiConversation size={20} />
                キャラクター準備
              </h4>
              <p className="text-gray-600 text-sm">
                各プレイヤーはＧＭが準備したトレーラーとハンドアウトをもとにキャラクターの作成を行う。この際、以前のセッションで使用したキャラクターを使用しても構わない。
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FaToolbox size={20} />
                道具の準備
              </h4>
              <p className="text-gray-600 text-sm">
                セッション開始前にダイスとチットを用意する。ダイスは基本的には十面ダイスを使用する。チットについては、セッション中に配布できるトランプやカードのようなものがふさわしいだろう。
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <GiConversation size={20} />
                キャラクター紹介
              </h4>
              <p className="text-gray-600 text-sm">
                ダイス、チット、シート類の準備が整ったらキャラクター紹介に移る。ＰＬはそのセッションで使用するキャラクターの紹介を行う。そのキャラクターの普段の姿とヒーローとしての姿の両者について紹介ができるとロールの幅が広がるだろう。
              </p>
            </div>
          </div>
        </Section>

        <Section title="オープニングパート" icon="🎬">
          <p className="text-gray-600 mb-4">
            オープニングパートでは配布されたハンドアウトに沿って各キャラクターの物語の導入が描写される。
          </p>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">典型的な導入</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• ヴィランの影がちらつく</li>
              <li>• 事件の被害者が発見される</li>
              <li>• 誰かから助けを求められる</li>
            </ul>
            <p className="text-blue-700 text-sm mt-2">
              基本的には、ヒーローが事件に関わるきっかけとなるシーンが描かれることになる。
            </p>
          </div>
        </Section>

        <Section title="ミドルパート" icon="🎯">
          <p className="text-gray-600 mb-6">
            ミドルパートではヴィランとの戦いに向けて動き、合流し力を合わせていくヒーローたちが描写されることになる。ミドルパートの進行はシナリオによって大きく変わるが、以下のようなシーンが想定される。
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {middlePartActivities.map((activity, index) => (
              <div
                key={index}
                className={`p-4 ${activity.color} rounded-lg border-2`}
              >
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <activity.icon size={24} />
                  {activity.title}
                </h4>
                <p className="text-gray-600 text-sm">{activity.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="クライマックスパート" icon="⚔️">
          <p className="text-gray-600 mb-4">
            ミドルパートの後に、多くの場合ヒーローたちはヴィランと会敵することになる。ヒーローたちにとっては最も危険な場面であり、同時に人々に自分をアピールする絶好の機会でもある。
          </p>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <GiSwordClash size={20} />
              クライマックスパートの内容
            </h4>
            <p className="text-red-700 text-sm">
              基本的にはヴィランとの戦闘処理を行う。
            </p>
          </div>
        </Section>

        <Section title="エンディングパート" icon="🎭">
          <p className="text-gray-600 mb-4">
            エンディングパートは、セッションのエピローグに相当する。ヒーローたちが事件を終え、守ったＮＰＣと会話したり、日常に戻ったりといったシーンとなる。
          </p>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">
              エンディングの例
            </h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• 次のヴィランとの戦いに赴く</li>
              <li>• 事件の後に休暇を取る</li>
              <li>• 日常に戻る</li>
            </ul>
            <p className="text-purple-700 text-sm mt-2">
              シナリオの展開やヒーローの設定に合わせて描写するとよいだろう。
            </p>
          </div>
        </Section>

        <Section title="セッションの事後処理" icon="📋">
          <p className="text-gray-600 mb-6">
            セッション終了後には以下の処理を行う。
          </p>
          <div className="space-y-3">
            {postSessionTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <task.icon
                  size={20}
                  className="text-yellow-700 flex-shrink-0"
                />
                <span className="text-gray-700 text-sm">{task.title}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <nav className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Link
            to="/rules"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← ルール一覧に戻る
          </Link>
          <Link
            to="/rules/applause"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            喝采ルールへ →
          </Link>
        </div>
      </nav>
    </article>
  );
};
