import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import {
  GiEvilMinion,
  GiDominoMask,
  GiBrain,
  GiNetworkBars,
  GiTrophy,
  GiCrownedHeart,
  GiEarthAsiaOceania,
  GiFist,
  GiEyeball,
} from 'react-icons/gi';
import { Link } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';

export const HeroBirthPage: React.FC = () => {
  const timeline = [
    {
      period: '約30年前',
      event: 'ワールドネゲイト出現',
      icon: GiEvilMinion,
      color: 'bg-red-100',
    },
    {
      period: '初期',
      event: 'クリス・バスカヴィル登場',
      icon: GiDominoMask,
      color: 'bg-blue-100',
    },
    {
      period: '中期',
      event: '国際特定異能者協同法承認',
      icon: GiEarthAsiaOceania,
      color: 'bg-green-100',
    },
    {
      period: '転機',
      event: 'ブリッジ事件発生',
      icon: GiBrain,
      color: 'bg-purple-100',
    },
    {
      period: '5年後',
      event: 'ワールドネゲイト事件終着',
      icon: GiTrophy,
      color: 'bg-yellow-100',
    },
  ];

  const keyFigures = [
    {
      name: 'ドゥームシャドウ',
      role: 'ワールドネゲイト指導者',
      description:
        '世界初の異能悪組織を率い、「世界の終わり」と「ルールの否定」を提唱',
      icon: GiEvilMinion,
      color: 'bg-red-50 border-red-200',
    },
    {
      name: 'クリス・バスカヴィル',
      role: '最初のヒーロー',
      description:
        '特定異能者第一号。迫害を受けながらも人々を守るために戦った英雄',
      icon: GiDominoMask,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      name: 'ラン',
      role: 'テレパシスト',
      description: 'ブリッジ事件を起こし、世界の人々の心を繋げた謎の異能者',
      icon: GiBrain,
      color: 'bg-purple-50 border-purple-200',
    },
  ];

  return (
    <article className="max-w-4xl mx-auto">
      <PageHeader
        title="ヒーローの誕生"
        description="異能者とヒーローがこの世界に現れるまでの歴史を辿る。"
        centered
      />

      <div className="space-y-12">
        <Section title="歴史の流れ" icon="📅">
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div
                  className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-sm`}
                >
                  <item.icon size={28} className="text-gray-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <FaCalendarAlt size={14} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {item.period}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{item.event}</h3>
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-px h-8 bg-gray-300 ml-8"></div>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section title="異能犯罪の出現" icon="💥">
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <GiEyeball size={20} />
                異能の歴史
              </h4>
              <p className="text-amber-700 text-sm mb-3">
                元々、世界には「異能」と呼ばれる力が存在していた。異常なまでの武力、人をまとめあげるカリスマ、魔法のような不思議な力…。それらの力を持つ者たちは時たま英雄として歴史に名を残してきたが、それは極一部の幸運な例である。
              </p>
              <p className="text-amber-700 text-sm">
                「異能」を持つ者のほとんどは恐れられ、虐げられ、時には人からの恐れのあまりに殺されてきた。その迫害の歴史は異民族の征伐や、魔女狩りといった形で未だに刻まれている。
              </p>
            </div>

            <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <GiEvilMinion size={32} className="text-red-700 mt-1" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">
                    ワールドネゲイトの登場
                  </h4>
                  <p className="text-red-700 text-sm mb-3">
                    その「異能」の者たちが表舞台に現れたのは約30年前。世界初の「異能」を用いる悪の組織「ワールドネゲイト」の登場である。ワールドネゲイトは世界の破滅を目論む組織であり、異能を用いてのテロや国家の重要人物の殺害などを行った。
                  </p>
                  <div className="p-3 bg-red-100 rounded">
                    <p className="text-red-800 text-sm">
                      <strong>ドゥームシャドウの呼び掛け：</strong>
                      <br />
                      「自分たちと同じ考えの者はいないか？世界など終わってしまえと思ったことはないか？世界のルールを否定したいと願ったことはないか？」
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded">
              <p className="text-gray-700 text-sm">
                ドゥームシャドウの声は排斥され、抑圧されていた「異能」を持つ人々にこそ向けられたものだった。これにより、世界中で「異能」を用いた犯罪が発生することとなる。各地で起こった「異能」を用いた犯罪はワールドネゲイトの元へと集い、果てにはとあるアジアの小国が転覆、体制の崩壊へと至らしめた。
              </p>
            </div>
          </div>
        </Section>

        <Section title="最初のヒーロー" icon="🦸‍♂️">
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-4">
                <GiCrownedHeart size={32} className="text-blue-700 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    クリス・バスカヴィルの決起
                  </h4>
                  <p className="text-blue-700 text-sm mb-3">
                    無論、ワールドネゲイトの動きに反発する者たちもいた。しかし、その多くは異能を持たざる人々であり、ワールドネゲイトの有する異能者集団との戦いは一向に好転しなかった。
                  </p>
                  <p className="text-blue-700 text-sm mb-3">
                    しかしそんな中、一人の異能者の青年が立ち上がることとなる。その青年は自らの持つ異能の力を使い独りワールドネゲイトに立ち向かったのだ。彼の名はクリス・バスカヴィル。
                  </p>
                  <div className="p-3 bg-blue-100 rounded">
                    <p className="text-blue-800 text-sm">
                      <strong>彼の信念：</strong>
                      <br />
                      「自分には大事な人たちがいる、守りたい場所がある」
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <GiEarthAsiaOceania size={20} />
                国際特定異能者協同法
              </h4>
              <p className="text-green-700 text-sm mb-3">
                クリス・バスカヴィルの行動と世論の反応を見た国際連合は兼ねてより提案されていた「国際特定異能者協同法」を議会で承認。異能を持つ人々の中で「世界を守る」側に立つ者を「特定異能者」として国連がその立場を保証することを取り決めたのである。
              </p>
              <p className="text-green-700 text-sm">
                この「特定異能者」の概念はのちに「ヒーロー」として世に広く知られていくことになる。
              </p>
            </div>
          </div>
        </Section>

        <Section title="ワールドネゲイト事件の終着" icon="🏆">
          <div className="space-y-6">
            <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-start gap-4">
                <GiNetworkBars size={32} className="text-purple-700 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    ブリッジ事件
                  </h4>
                  <p className="text-purple-700 text-sm mb-3">
                    クリス・バスカヴィルが世論に認められるようになった理由のひとつとして、当時彼の横にいた一人の異能者の存在があった。「ラン」というコードネームのテレパシストが、世界人口の一割を超える人々の頭の中にテレパシーを駆使して話しかけた。
                  </p>
                  <div className="p-3 bg-purple-100 rounded mb-3">
                    <p className="text-purple-800 text-sm">
                      <strong>ランのメッセージ：</strong>
                      <br />
                      「本当にこのまま世界が終わってしまっていいのか、もうこの世界を守りたいと考えている人はいないのか。」
                    </p>
                  </div>
                  <p className="text-purple-700 text-sm">
                    彼女はクリス・バスカヴィルと世界の人々の心を一瞬だけ繋げ、彼が心の底から世界を守りたいと考えていることを伝えた。
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <GiFist size={20} />
                最終決戦と終着
              </h4>
              <p className="text-yellow-700 text-sm mb-3">
                この「ブリッジ」と呼ばれる出来事以来、少しずつだが世界各地で「異能」を隠していた人々が立ち上がり始める。国連に保護を求めたり、協力を申し出る異能者が増加し、クリスを旗印として対ワールドネゲイトの戦線が敷かれることとなる。
              </p>
              <p className="text-yellow-700 text-sm">
                出現から5年、「最初のヒーロー」クリス・バスカヴィルと指導者ドゥームシャドウとの会敵の後、ワールドネゲイトとの戦いは一旦の終着を迎えることとなった。
              </p>
            </div>
          </div>
        </Section>

        <Section title="重要人物" icon="👥">
          <div className="space-y-6">
            {keyFigures.map((figure, index) => (
              <div
                key={index}
                className={`p-4 ${figure.color} rounded-lg border-2`}
              >
                <div className="flex items-start gap-4">
                  <figure.icon
                    size={28}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-800 text-lg">
                        {figure.name}
                      </h4>
                      <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-600">
                        {figure.role}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {figure.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="この時代の影響" icon="🌍">
          <div className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded">
            <p className="text-gray-700 text-sm mb-3">
              ワールドネゲイト事件は世界に大きな変化をもたらした。異能者の存在が公になり、ヒーローという概念が誕生。それまで暗がりに隠れていた異能者たちが、世界を守る側と破壊する側に分かれて表舞台に立つこととなった。
            </p>
            <p className="text-gray-700 text-sm">
              この出来事が現在の「Age of
              Hero」時代の始まりとなり、ヒーローとヴィランが活躍する現代へと繋がっていくのである。
            </p>
          </div>
        </Section>
      </div>

      <nav className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Link
            to="/world"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← ワールド一覧に戻る
          </Link>
          <Link
            to="/character-creation"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            キャラクター作成へ →
          </Link>
        </div>
      </nav>
    </article>
  );
};
