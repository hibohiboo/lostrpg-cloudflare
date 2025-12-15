import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import {
  GiCrossedSwords,
  GiClockwork,
  GiChecklist,
  GiRunningShoe,
  GiSwordClash,
  GiFinishLine,
  GiFist,
  GiCrosshair,
  GiMagicSwirl,
  GiShield,
  GiDodge,
  GiTargetArrows,
  GiHeartPlus,
  GiStopSign,
  GiDirectionSign,
  GiMove,
  GiFootTrip,
  GiPoisonBottle,
  GiFluffyCloud,
  GiHandcuffs,
  GiDespair,
} from 'react-icons/gi';
import { Link } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';

export const BattleRulePage: React.FC = () => {
  const battleFlow = [
    {
      step: 1,
      title: '戦闘開始',
      icon: GiCrossedSwords,
      description:
        'ＧＭは戦闘の開始を宣言する。各キャラクターはこのタイミングでアイテムの準備などを行える。',
    },
    {
      step: 2,
      title: 'スタートプロセス',
      icon: GiClockwork,
      description:
        'ラウンドの開始し、準備を行うプロセス。すべてのキャラクターが未行動の状態となる。',
    },
    {
      step: 3,
      title: '行動値チェック',
      icon: GiChecklist,
      description:
        '次にどのキャラクターが行動するかを決定する。未行動のキャラクターの内、最も行動値の高いキャラクターが行動する。',
    },
    {
      step: 4,
      title: 'メインプロセス',
      icon: GiRunningShoe,
      description:
        '攻撃や回復、移動などの様々なアクションを行う。ムーブ、マイナー、メジャーアクションをそれぞれ１回ずつ。',
    },
    {
      step: 5,
      title: 'エンドプロセス',
      icon: GiFinishLine,
      description: 'ラウンドの終了を表すプロセス。戦闘終了の条件を確認する。',
    },
    {
      step: 6,
      title: '戦闘終了',
      icon: GiSwordClash,
      description:
        '戦闘の終了処理を行う。バッドステータスを解除し、戦闘不能のＰＣはＨＰを１まで回復する。',
    },
  ];

  const attackTypes = [
    {
      title: '白兵攻撃',
      icon: GiFist,
      description:
        '素手や剣などを用いて接近戦を行う。基本的には素手での攻撃ならば〈パワー〉技能、武器での攻撃ならば〈技術〉技能での判定を行う。',
      range: 'エンゲージしている対象にのみ行える',
      color: 'bg-red-50 border-red-200',
    },
    {
      title: '射撃攻撃',
      icon: GiCrosshair,
      description:
        '銃や弓などを用いて遠距離戦を行う。基本的には〈射撃〉技能での判定を行う。',
      range: '至近距離の対象には行えない',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: '特殊攻撃',
      icon: GiMagicSwirl,
      description:
        '魔術や超能力を用いて攻撃を行う。基本的にはヒーロースキルの使用でのみ発生する。',
      range: '特殊攻撃でのダメージには防護点は適用されない',
      color: 'bg-purple-50 border-purple-200',
    },
  ];

  const distances = [
    { name: '至近距離', description: 'エンゲージ状態、白兵攻撃可能' },
    {
      name: '近距離',
      description:
        '至近でのエンゲージから離脱して近距離に移動するには二段階の移動が必要',
    },
    { name: '中距離', description: '' },
    { name: '遠距離', description: '' },
    { name: '超遠距離', description: '' },
  ];

  const actionTypes = [
    {
      type: 'ムーブアクション',
      icon: GiMove,
      color: 'bg-green-50 border-green-200',
      examples: ['１段階の移動', 'エンゲージの管理'],
    },
    {
      type: 'マイナーアクション',
      icon: GiDirectionSign,
      color: 'bg-blue-50 border-blue-200',
      examples: [
        'ヒーロースキルの使用',
        '追加移動',
        '装備の交換',
        'アイテムの回収',
        'ＳＰヒール',
      ],
    },
    {
      type: 'メジャーアクション',
      icon: GiTargetArrows,
      color: 'bg-red-50 border-red-200',
      examples: ['攻撃', 'ヒーロースキルの使用', 'アイテムの受け渡し'],
    },
  ];

  const reactionTypes = [
    {
      title: 'ドッジ',
      icon: GiDodge,
      description:
        '攻撃の回避を試みるリアクション。〈運動〉か使用したヒーロースキルで指定された技能を用いて判定を行う。',
      effect: '判定に成功した場合、攻撃を回避し無効化する',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'ガード',
      icon: GiShield,
      description:
        '攻撃を防御し耐えるリアクション。判定に成功した場合、受けるダメージをガード値分だけ軽減する。',
      effect:
        'コンボ回数に関わらず１回のみ発生、全てのダメージにガード値を適用',
      color: 'bg-blue-50 border-blue-200',
    },
  ];

  const attackProcess = [
    '攻撃側キャラクターの宣言',
    '攻撃側のキャラクターの判定',
    'リアクション側のキャラクターの宣言',
    'リアクション側のキャラクターの判定',
    '対決の確定',
    'ダメージ算出',
  ];

  const badStatuses = [
    {
      title: 'ＢＳ：重圧',
      icon: GiDespair,
      description: 'オートアクションのヒーロースキルが使用できなくなる。',
      color: 'bg-gray-50 border-gray-200',
    },
    {
      title: 'ＢＳ：硬直',
      icon: GiFootTrip,
      description: '移動を行うことができなくなる。',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'ＢＳ：スリップ',
      icon: GiPoisonBottle,
      description: 'メインプロセス終了時にｎ点のHPダメージを受ける。',
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'ＢＳ：放心',
      icon: GiFluffyCloud,
      description: '全ての判定に－２０％の修正を受ける。',
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      title: 'ＢＳ：捕縛',
      icon: GiHandcuffs,
      description: '選択した装備品の使用ができなくなる。',
      color: 'bg-red-50 border-red-200',
    },
  ];

  return (
    <article className="max-w-4xl mx-auto">
      <PageHeader
        title="戦闘ルール"
        description="「Age of Hero」の戦闘は以下のようなルールで進行する。"
        centered
      />

      <div className="space-y-12">
        <Section title="戦闘の流れ" icon="⚔️">
          <div className="space-y-6">
            {battleFlow.map((phase, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold">
                  {phase.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <phase.icon size={20} />
                    {phase.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{phase.description}</p>
                </div>
                {index < battleFlow.length - 1 && (
                  <FaArrowRight size={16} className="text-gray-400 mt-4" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>ラウンドについて：</strong>
              <br />
              ②スタートプロセスから⑤エンドプロセスまでをラウンドと呼ぶ。登場しているすべてのキャラクターが行動を終え、エンドプロセスの処理を行うまでを１ラウンドとし、キャラクターは基本的に１ラウンドに１回行動することができる。
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-blue-800 text-sm">
              <strong>③～④の繰り返し：</strong>
              <br />
              行動値チェックからメインプロセスまでを未行動のキャラクターがいなくなるまで繰り返す。⑤エンドプロセス後、戦闘終了条件を満たしていなければ②スタートプロセスへ戻る。
            </p>
          </div>
        </Section>

        <Section title="距離とエンゲージ" icon="📐">
          <p className="text-gray-600 mb-6">
            「Age of
            Hero」の戦闘において、キャラクター間の距離の概念は５段階で区別される。通常、１回の移動で動ける範囲は１段階である。
          </p>

          <div className="grid gap-3 mb-6">
            {distances.map((distance, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">
                    {distance.name}
                  </span>
                  <span className="text-gray-600 text-sm ml-3">
                    {distance.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">エンゲージ</h4>
              <p className="text-green-700 text-sm mb-2">
                二人以上のキャラクターがお互いに至近距離にある状態のことをエンゲージと呼ぶ。エンゲージしている場合、相手に白兵攻撃が可能になる。
              </p>
              <ul className="text-green-700 text-sm space-y-1">
                <li>
                  •
                  移動の途中に他のキャラクターとエンゲージしてしまう場合、移動はそこで終了
                </li>
                <li>
                  •
                  敵対キャラクターが存在するエンゲージから離脱するには二段階の移動が必要
                </li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">
                エンゲージの封鎖
              </h4>
              <p className="text-orange-700 text-sm">
                瓦礫などの障害物がある場合や何らかの力で移動が妨害されるような状況を「エンゲージの封鎖」と呼ぶ。封鎖されたエンゲージは入る際には制限はないが、離脱にはメジャーアクションの消費を必要とする。
              </p>
            </div>
          </div>
        </Section>

        <Section title="アクションの種類" icon="🎯">
          <p className="text-gray-600 mb-6">
            メインプロセスで行えるのはムーブアクション、マイナーアクション、メジャーアクションをそれぞれ１回ずつである。これらの３つのアクションはどのような順番で行ってもよい。
          </p>

          <div className="space-y-6">
            {actionTypes.map((action, index) => (
              <div
                key={index}
                className={`p-4 ${action.color} rounded-lg border-2`}
              >
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <action.icon size={24} />
                  {action.type}
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {action.examples.map((example, exIndex) => (
                    <div
                      key={exIndex}
                      className="p-2 bg-white rounded text-sm text-gray-700"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="攻撃の種類" icon="⚔️">
          <div className="space-y-6">
            {attackTypes.map((attack, index) => (
              <div
                key={index}
                className={`p-4 ${attack.color} rounded-lg border-2`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <attack.icon
                    size={24}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {attack.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {attack.description}
                    </p>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="text-gray-700 text-xs">
                        <strong>制限：</strong> {attack.range}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="攻撃の流れ" icon="🎯">
          <div className="space-y-4 mb-6">
            {attackProcess.map((process, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-700">{process}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">
              コンボについて
            </h4>
            <p className="text-yellow-700 text-sm mb-2">
              コンボを適用した場合、設定されたコンボの数値以下の任意の回数、攻撃の判定を行うことができる。各判定における判定値は[（判定値＋修正）÷コンボ回数]となる。
            </p>
            <div className="p-2 bg-yellow-100 rounded text-yellow-800 text-xs">
              <strong>例：</strong>{' '}
              〈パワー〉100％のキャラクターがコンボ２の攻撃 →
              50％の判定を２回行う
            </div>
          </div>
        </Section>

        <Section title="リアクション" icon="🛡️">
          <p className="text-gray-600 mb-6">
            攻撃の対象となったキャラクターは攻撃に対してリアクションをとることができる。リアクションの種類は「ドッジ」か「ガード」の二種類である。
          </p>

          <div className="space-y-6">
            {reactionTypes.map((reaction, index) => (
              <div
                key={index}
                className={`p-4 ${reaction.color} rounded-lg border-2`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <reaction.icon
                    size={24}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {reaction.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {reaction.description}
                    </p>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="text-gray-700 text-xs">
                        <strong>効果：</strong> {reaction.effect}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="特殊ルール" icon="⭐">
          <div className="space-y-6">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <GiTargetArrows size={20} />
                攻撃判定でのクリティカル
              </h4>
              <p className="text-red-700 text-sm">
                攻撃判定でクリティカルが出た場合、その攻撃でのダメージロールに＋１Ｄする。コンボでのクリティカルは１判定ごとに別のものとして扱う。
              </p>
            </div>

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <GiHeartPlus size={20} />
                カバーリング
              </h4>
              <p className="text-blue-700 text-sm mb-2">
                同じエンゲージに存在するキャラクターに対する攻撃を代わりに受けることをカバーリングと呼ぶ。カバーリングを行うには未行動でなければならず、カバーリングを行うと行動終了となる。
              </p>
              <div className="p-2 bg-blue-100 rounded text-blue-800 text-xs">
                <strong>宣言タイミング：</strong> ダメージロールの直前
                <br />
                <strong>効果：</strong>{' '}
                ガードを行ったものとしてダメージ算出を行う
              </div>
            </div>

            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <GiStopSign size={20} />
                ダメージ算出
              </h4>
              <p className="text-purple-700 text-sm">
                ダメージは[ヒット数]回のダメージロールを行う。基本ダメージは[（使用技能の属する能力値）Ｄ＋武器の攻撃力]。受ける側は１回のダメージロールごとに防護点分ダメージを軽減し、ガードを選択していた場合はガード値分も軽減する。
              </p>
            </div>
          </div>
        </Section>

        <Section title="バッドステータス" icon="💀">
          <p className="text-gray-600 mb-6">
            戦闘中、キャラクターは様々な悪い状況に陥ることがある。これをバッドステータス（ＢＳ）と呼ぶ。バッドステータスは戦闘終了時に自動的に解除される。
          </p>

          <div className="space-y-4">
            {badStatuses.map((status, index) => (
              <div
                key={index}
                className={`p-4 ${status.color} rounded-lg border-2`}
              >
                <div className="flex items-start gap-3">
                  <status.icon
                    size={24}
                    className="text-gray-700 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {status.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {status.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
            <p className="text-orange-800 text-sm">
              <strong>バッドステータスの解除：</strong>
              <br />
              バッドステータスは基本的に戦闘終了時に自動的に解除される。ただし、一部のヒーロースキルやアイテムの効果で早期に解除できる場合もある。
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
            to="/rules/hero-skill-guide"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ヒーロースキルの見方へ →
          </Link>
        </div>
      </nav>
    </article>
  );
};
