import React from 'react';
import {
  GiDiceTarget,
  GiRollingDices,
  GiCheckMark,
  GiTrophy,
  GiDeathSkull,
} from 'react-icons/gi';
import { Link } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';

export const JudgmentRulePage: React.FC = () => {
  const judgmentSteps = [
    {
      number: 1,
      title: '判定の宣言',
      description: 'GMはそのヒーローの行動に判定が必要であることを宣言する。',
      icon: GiDiceTarget,
    },
    {
      number: 2,
      title: '技能の決定',
      description:
        'GMはその判定がどの技能で行われるかを決定する。例えば「瓦礫をどかす」判定ならば〈パワー〉技能による判定となるだろう。',
      icon: GiRollingDices,
    },
    {
      number: 3,
      title: '判定値の確認',
      description:
        '判定に使用する技能が決定したら、ヒーローがその技能について何％の確率で成功するか、判定値を確認する。',
      icon: GiCheckMark,
    },
    {
      number: 4,
      title: 'ダイスロール',
      description:
        '片方を十の位、もう片方を一の位と決めたD10を二個を振り、出目を決定する。',
      icon: GiRollingDices,
    },
    {
      number: 5,
      title: '行動の成功/失敗の決定',
      description:
        '出目が判定値以下ならば成功、判定値より大きければ失敗となる。',
      icon: GiTrophy,
    },
  ];

  const oppositionResults = [
    {
      winner: '判定成功',
      loser: '判定失敗',
      result: '成功者の勝利',
      color: 'bg-green-50 border-green-200 text-green-800',
    },
    {
      winner: '判定成功',
      loser: '判定成功',
      result: '成功度の高い者が勝利',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
    },
  ];

  return (
    <article className="max-w-4xl mx-auto">
      <PageHeader
        title="判定ルール"
        description="　「Age of Hero」のセッションにおいて、ヒーローは様々な行動をとる。そのうちには「成功するかどうかが分からない」行動がある。例えば、ヴィランの情報を入手する、瓦礫をどける、銃器の調達を行う等だ。キャラクターがそのような行動を起こそうとする場合、その行動が成立するかどうかの判定が行われる。判定とはダイスを振りその結果とキャラクターの持つデータとを参照して成否を決めることである。"
        centered
      />

      <div className="space-y-12">
        <Section title="判定の手順" icon="📋">
          <p className="text-gray-600 mb-6">
            行為判定の手順は以下の通りとなる。
          </p>
          <div className="space-y-6">
            {judgmentSteps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <step.icon size={20} />①{step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                  {step.number === 2 && (
                    <p className="text-gray-500 text-xs mt-2">
                      判定に使用する技能については「キャラクター作成」のページを参照して欲しい。
                    </p>
                  )}
                  {step.number === 3 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800 text-sm">
                        <strong>判定値の計算：</strong>
                      </p>
                      <ul className="text-blue-700 text-sm mt-1 space-y-1">
                        <li>
                          • ポイント割り振り済み: [能力値×１０％＋技能値％]
                        </li>
                        <li>• ポイント未割り振り: [能力値×１０％]</li>
                      </ul>
                    </div>
                  )}
                  {step.number === 4 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800 text-sm">
                        <strong>特殊な出目：</strong>
                      </p>
                      <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                        <li>• 01～05: クリティカル</li>
                        <li>• 96～00: ファンブル</li>
                      </ul>
                    </div>
                  )}
                  {step.number === 5 && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800 text-sm">
                        ヒーロースキルやアイテムの効果で判定値や出目が変動した場合、効果が適用された後の数値を参照すること。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="クリティカルとファンブル" icon="🎯">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <GiTrophy size={24} />
                クリティカル
              </h3>
              <p className="text-gray-600 mb-4">
                バトルパート以外でのダイスロールでクリティカルが発生した場合、GMはその判定がより効果的な結果を生み出したとしてボーナスを与えてもよい。
              </p>
              <div className="bg-green-100 p-3 rounded border border-green-300">
                <p className="text-green-800 text-sm">
                  <strong>例：</strong>{' '}
                  情報を集める判定にクリティカルした場合に追加で情報が判明する
                </p>
                <p className="text-green-700 text-sm mt-2">
                  特にボーナスの内容が思い浮かばない場合はHPかSPを2D点回復できるとすると良い。
                </p>
              </div>
            </div>

            <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <GiDeathSkull size={24} />
                ファンブル
              </h3>
              <p className="text-gray-600 mb-4">
                バトルパート以外でのダイスロールでファンブルが発生した場合、その判定は例え出目が判定値を下回っていたとしても失敗となる。
              </p>
              <div className="bg-red-100 p-3 rounded border border-red-300">
                <p className="text-red-800 text-sm">
                  <strong>重要：</strong> ファンブルは判定値に関係なく必ず失敗
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="対抗判定" icon="⚔️">
          <p className="text-gray-600 mb-6">
            対抗判定とは、二人以上のキャラクターの間で何らかの争いや競合が起きた場合に発生する判定だ。例えば「ヒーローがヴィランを追いかけ、ヴィランが逃走を試みる」場合などに発生する。
          </p>

          <h3 className="font-semibold text-gray-800 mb-4">対抗判定の手順</h3>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                1
              </div>
              <span className="text-gray-700">
                対決の宣言：GMは使用する技能を決定。能動側、受動側キャラクターの確定
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                2
              </div>
              <span className="text-gray-700">能動側の判定</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                3
              </div>
              <span className="text-gray-700">受動側の判定</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                4
              </div>
              <span className="text-gray-700">判定結果の比較</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-800 mb-4">判定結果の比較</h3>
          <p className="text-gray-600 mb-6">
            ヒーロースキルや攻撃により発生する対抗判定でない場合、判定の成否の比べ合いは以下のようになる。
          </p>

          <div className="space-y-4">
            {oppositionResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg ${result.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">A: {result.winner}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="font-medium">B: {result.loser}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GiCheckMark size={20} />
                    <span className="font-semibold">{result.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-blue-800 text-sm">
              <strong>成功度について：</strong>
              <br />
              成功度は「判定値 -
              出目」で算出される。数値が大きいほど、より良い結果となる。
            </p>
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
            to="/rules/session"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            セッションの進行へ→
          </Link>
        </div>
      </nav>
    </article>
  );
};
