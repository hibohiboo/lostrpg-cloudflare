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

// SHA256ハッシュ計算
const calculateSHA256 = async (data: ArrayBuffer): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};

// 画像URLからArrayBufferを取得
const fetchImageAsArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return response.arrayBuffer();
};

// ヌシデータをユドナリウムXMLに変換
export const bossToUdonariumDoc = (
  boss: BossFormData,
  bossId: string,
  imageIdentifier?: string,
): string => {
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

  // char image
  if (imageIdentifier) {
    const image = createElement(doc, 'data', [['name', 'image']]);
    const imageIdentifierElm = createElement(
      doc,
      'data',
      [
        ['name', 'imageIdentifier'],
        ['type', 'image'],
      ],
      imageIdentifier,
    );
    image.appendChild(imageIdentifierElm);
    char.appendChild(image);
  }

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

  let imageIdentifier: string | undefined;
  let imageExtension: string | undefined;

  // 画像がある場合は取得してハッシュ計算
  if (boss.imageUrl) {
    try {
      const imageData = await fetchImageAsArrayBuffer(boss.imageUrl);
      const hash = await calculateSHA256(imageData);
      imageIdentifier = hash;

      // 画像の拡張子を取得
      const urlPath = new URL(boss.imageUrl).pathname;
      const match = urlPath.match(/\.([^.]+)$/);
      imageExtension = match ? match[1] : 'png';

      // ZIPに画像を追加
      const imageBlob = new Blob([imageData]);
      await zipWriter.add(
        `${hash}.${imageExtension}`,
        new BlobReader(imageBlob),
      );
    } catch (error) {
      console.error('画像の取得に失敗しました:', error);
    }
  }

  // XMLを生成してZIPに追加
  const xml = bossToUdonariumDoc(boss, bossId, imageIdentifier);
  const xmlBlob = new Blob([xml], { type: 'text/xml' });
  await zipWriter.add('data.xml', new BlobReader(xmlBlob));

  const blob = await zipWriter.close();
  saveAs(blob, `${boss.name}.zip`);
};
