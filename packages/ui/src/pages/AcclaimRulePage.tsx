import React from 'react';
import {
  GiTicket,
  GiMagicPalm,
  GiHealthCapsule,
  GiRaiseSkeleton,
  GiPowerButton,
  GiTheater,
  GiMicrophone,
  GiChart,
  GiFireBottle,
} from 'react-icons/gi';
import { PiHandsClapping } from 'react-icons/pi';
import { Link } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';

export const AcclaimRulePage: React.FC = () => {
  const fanChitAcquisition = [
    {
      title: 'シーンへの登場',
      icon: GiTheater,
      description:
        'シーン終了時、そのシーンに登場していた各ＰＣは１枚のファンチットを獲得する。',
      reward: '1枚',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: '必殺技の使用',
      icon: GiMagicPalm,
      description:
        'ＰＣが必殺技を使用した際、その効果や結果に関わらず５枚のファンチットを獲得する。',
      reward: '5枚',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'ロールプレイ',
      icon: GiMicrophone,
      description:
        'ＧＭやＰＬがキャラクターのロールプレイについて素晴らしいと感じたならば、ファンチットを渡してもよい。また、ヒーローが「ファンにうける」行動をとった際にもファンチットを渡してもよい。',
      reward: '可変',
      color: 'bg-green-50 border-green-200',
    },
  ];

  const fanChitUsage = [
    {
      title: '判定ブースト',
      icon: GiChart,
      description:
        '何らかの技能を用いて判定する際に使用することができる。消費したファンチット一枚につき、判定値に＋１０％の修正を得る。',
      limitation:
        '１ラウンドにつき消費できる枚数上限は、そのキャラクターの最も高い能力値と同じ',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'ＳＰヒール',
      icon: GiHealthCapsule,
      description:
        'ファンチットを消費してＳＰの回復をすることができる。マイナーアクションを使用して行い、[消費したファンチットの半分]ＤのＳＰを回復する。',
      limitation: 'マイナーアクションが必要',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'ストライヴ',
      icon: GiRaiseSkeleton,
      description:
        '戦闘不能になった際に使用する。<意志>での判定を行い、成功した場合、戦闘不能を解除しＨＰを[【肉体】×５]点回復する。',
      limitation:
        '試みる度に[（そのシーンで試みた回数－１）×５]枚のファンチットを消費',
      color: 'bg-red-50 border-red-200',
    },
    {
      title: '代償',
      icon: GiFireBottle,
      description:
        '一部のヒーロースキルにはファンチットを代償として消費するものが存在する。',
      limitation: 'ヒーロースキルの内容による',
      color: 'bg-purple-50 border-purple-200',
    },
  ];

  return (
    <article className="max-w-4xl mx-auto">
      <PageHeader
        title="喝采ルール"
        description="　喝采ルールとは、ヒーローであるＰＣたちがそのファンから受ける喝采を表現するためのルールである。"
        centered
      />

      <div className="space-y-12">
        <Section title="ファンチット" icon="🎫">
          <p className="text-gray-600 mb-6">
            「ファンチット」とはセッション中にＰＣが受けたファンや後援者からの声援や支援を表すものだ。「Age
            of
            Hero」において、ヒーローにはファンからの応援や企業・公的機関などからの支援は必要不可欠である。ファンチットはそう言ったものをどれだけ得られたかを表しており、ルール的にはトランプやカードの配布という形でＰＣに与えられる。
          </p>

          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <GiTicket size={20} />
              ファンチットとは
            </h4>
            <p className="text-yellow-700 text-sm">
              ファンからの応援や支援を表すもの。
              トランプやカードの配布という形でＰＣに与えられる。
            </p>
          </div>

          <h3 className="font-semibold text-gray-800 mb-4">
            ファンチット取得条件
          </h3>
          <div className="space-y-4">
            {fanChitAcquisition.map((condition, index) => (
              <div
                key={index}
                className={`p-4 ${condition.color} rounded-lg border-2`}
              >
                <div className="flex items-start gap-3">
                  <condition.icon
                    size={24}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {condition.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {condition.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
                        獲得: {condition.reward}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3">
              「ファンにうける」行動について
            </h4>
            <p className="text-green-700 text-sm mb-3">
              「ファンにうける」行動とは格好の良い啖呵や美麗な技ももちろんだが、何も格好の良い英雄的な行動だけに限るわけではない。
            </p>
            <div className="space-y-2 text-green-700 text-sm">
              <div className="p-2 bg-green-100 rounded">
                <strong>例：</strong>{' '}
                「ドジなところが可愛い少女ヒーロー」がファンブルしても、キャラクターに沿って「可愛い失敗」を演出できればファンは大いに沸く
              </div>
              <div className="p-2 bg-green-100 rounded">
                <strong>例：</strong>{' '}
                「金銭に汚いが努力するヒーロー」が所属企業のコマーシャルを会話に織り交ぜてアピール
              </div>
            </div>
          </div>
        </Section>

        <Section title="ファンチットの使用" icon="⚡">
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-blue-800 text-sm">
              <strong>ファンの力について：</strong>
              <br />
              ヒーローはファンからの声援を力に変えることができる。「自分の守りたいもの」や「自分が何のために戦うのか」を再認識することで、ヒーローたちは心を奮い立たせ、身体を起き上がらせる。自分の持てる力の限界を超えて戦うために、自分を応援してくれる声や讃えてくれる声が力となるのだ。
            </p>
          </div>

          <h3 className="font-semibold text-gray-800 mb-4">使用方法</h3>
          <div className="space-y-6">
            {fanChitUsage.map((usage, index) => (
              <div
                key={index}
                className={`p-4 ${usage.color} rounded-lg border-2`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <usage.icon
                    size={24}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {usage.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{usage.description}</p>
                  </div>
                </div>
                <div className="ml-9 p-3 bg-white rounded border border-gray-200">
                  <p className="text-gray-700 text-xs">
                    <strong>制限・条件：</strong> {usage.limitation}
                  </p>
                  {usage.title === '判定ブースト' && (
                    <p className="text-gray-700 text-xs mt-2">
                      <strong>戦闘時の注意：</strong>{' '}
                      攻撃の判定に使用する場合、コンボ数での判定値割り振りを行う前に使用し、割り振り前の数値に修正を加える。
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="ファンチット活用のポイント" icon="💡">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <PiHandsClapping size={20} />
                取得のコツ
              </h4>
              <ul className="text-yellow-700 text-sm space-y-2">
                <li>• 積極的にシーンに登場する</li>
                <li>• キャラクターらしいロールプレイを心がける</li>
                <li>• 必殺技の使用タイミングを見極める</li>
                <li>• 「ファンにうける」行動を意識する</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <GiPowerButton size={20} />
                使用のコツ
              </h4>
              <ul className="text-orange-700 text-sm space-y-2">
                <li>• 重要な判定で判定ブーストを活用</li>
                <li>• ＳＰが枯渇する前にヒールで回復</li>
                <li>• ストライヴは最後の切り札として</li>
                <li>• 能力値上限を意識した枚数管理</li>
              </ul>
            </div>
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
            to="/rules/combat"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            戦闘ルールへ →
          </Link>
        </div>
      </nav>
    </article>
  );
};
