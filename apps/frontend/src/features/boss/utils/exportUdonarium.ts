import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { saveAs } from 'file-saver';
import { calcBossStamina, calcBossWillPower } from '../model/bossSlice';
import type { BossFormData } from '../model/bossSlice';

// XML生成ヘルパー関数
const createDoc = (): Document =>
  document.implementation.createDocument('', '', null);

const createElement = (
  doc: Document,
  elm: string,
  attributes: [string, string][] = [],
  text: string | null = null,
): Element => {
  const e = doc.createElement(elm);
  attributes.forEach(([attr, val]) => {
    e.setAttribute(attr, val);
  });
  if (text) {
    e.appendChild(document.createTextNode(text));
  }
  return e;
};

const convertDocToXML = (doc: Document): string => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
};

// ヌシデータをユドナリウムXMLに変換
export const bossToUdonariumDoc = (boss: BossFormData, bossId: string): string => {
  const doc = createDoc();
  const characterElm = createElement(doc, 'character', [
    ['location.name', 'table'],
    ['location.x', '0'],
    ['location.y', '0'],
    ['posZ', '0'],
    ['rotate', '0'],
    ['roll', '0'],
  ]);

  // #char
  const char = createElement(doc, 'data', [['name', 'character']]);

  // char common
  const common = createElement(doc, 'data', [['name', 'common']]);
  const name = createElement(doc, 'data', [['name', 'name']], boss.name);
  const size = createElement(doc, 'data', [['name', 'size']], '1');
  common.appendChild(name);
  common.appendChild(size);
  char.appendChild(common);

  // char detail
  const detail = createElement(doc, 'data', [['name', 'detail']]);

  // char detail リソース
  const resource = createElement(doc, 'data', [['name', 'リソース']]);
  const stamina = createElement(
    doc,
    'data',
    [
      ['name', '体力'],
      ['type', 'numberResource'],
      ['currentValue', String(boss.stamina)],
    ],
    String(calcBossStamina(boss.level)),
  );
  const willPower = createElement(
    doc,
    'data',
    [
      ['name', '気力'],
      ['type', 'numberResource'],
      ['currentValue', String(boss.willPower)],
    ],
    String(calcBossWillPower(boss.level)),
  );
  resource.appendChild(stamina);
  resource.appendChild(willPower);
  detail.appendChild(resource);

  // char detail 情報
  const info = createElement(doc, 'data', [['name', '情報']]);
  info.appendChild(
    createElement(doc, 'data', [['name', 'レベル']], String(boss.level)),
  );
  if (boss.appearance) {
    info.appendChild(
      createElement(
        doc,
        'data',
        [
          ['name', '外見'],
          ['type', 'note'],
        ],
        boss.appearance,
      ),
    );
  }
  info.appendChild(
    createElement(
      doc,
      'data',
      [
        ['name', 'URL'],
        ['type', 'note'],
      ],
      `${window.location.origin}/boss/${bossId}`,
    ),
  );
  detail.appendChild(info);

  // char detail アビリティ
  if (boss.abilities.length > 0) {
    const abilities = createElement(doc, 'data', [['name', 'アビリティ']]);
    boss.abilities.forEach((a) => {
      abilities.appendChild(
        createElement(
          doc,
          'data',
          [
            ['name', a.name],
            ['type', 'note'],
          ],
          `${a.group}/${a.type}/${a.specialty}/${a.target}/${a.recoil}/${a.effect}`,
        ),
      );
    });
    detail.appendChild(abilities);
  }

  char.appendChild(detail);
  characterElm.appendChild(char);

  // add palette
  let paletteText = '//------アビリティ\n';
  if (boss.abilities.length > 0) {
    paletteText += boss.abilities
      .map((a) => `[${a.name}] {${a.name}}`)
      .join('\n');
  }
  const palette = createElement(doc, 'chat-palette', [], paletteText);
  characterElm.appendChild(palette);

  doc.appendChild(characterElm);

  return convertDocToXML(doc);
};

// ユドナリウム用ZIPファイルを生成してダウンロード
export const exportBossToUdonarium = async (
  boss: BossFormData,
  bossId: string,
): Promise<void> => {
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'), {
    bufferedWrite: true,
  });

  const xml = bossToUdonariumDoc(boss, bossId);
  const xmlBlob = new Blob([xml], { type: 'text/xml' });
  await zipWriter.add('data.xml', new BlobReader(xmlBlob));

  const blob = await zipWriter.close();
  saveAs(blob, `${boss.name}.zip`);
};
