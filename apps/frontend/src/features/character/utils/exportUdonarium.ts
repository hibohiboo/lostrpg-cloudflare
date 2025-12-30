/* eslint-disable complexity */
import { bodyParts } from '@lostrpg/core/game-data/speciality';
import { CreateCharacterRequest } from '@lostrpg/schemas';
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { saveAs } from 'file-saver';

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

// キャラクターデータをユドナリウムXMLに変換
export const characterToUdonariumDoc = (
  character: CreateCharacterRequest,
  characterId: string,
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
  const name = createElement(doc, 'data', [['name', 'name']], character.name);
  const size = createElement(doc, 'data', [['name', 'size']], '1');
  common.appendChild(name);
  common.appendChild(size);
  char.appendChild(common);

  // char detail
  const detail = createElement(doc, 'data', [['name', 'detail']]);

  // char detail resource
  const resource = createElement(doc, 'data', [['name', 'リソース']]);
  const stamina = createElement(
    doc,
    'data',
    [
      ['name', '体力'],
      ['type', 'numberResource'],
      ['currentValue', String(character.stamina)],
    ],
    String(character.stamina * 2),
  );
  const willPower = createElement(
    doc,
    'data',
    [
      ['name', '気力'],
      ['type', 'numberResource'],
      ['currentValue', String(character.willPower)],
    ],
    String(character.willPower * 2),
  );
  resource.appendChild(stamina);
  resource.appendChild(willPower);
  detail.appendChild(resource);

  // char detail info
  const info = createElement(doc, 'data', [['name', '情報']]);
  if (character.playerName) {
    info.appendChild(
      createElement(doc, 'data', [['name', 'PL']], character.playerName),
    );
  }
  if (character.summary) {
    info.appendChild(
      createElement(
        doc,
        'data',
        [
          ['name', '概要'],
          ['type', 'note'],
        ],
        character.summary,
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
      `${window.location.origin}/character/${characterId}`,
    ),
  );
  detail.appendChild(info);

  // char detail 部位
  const area = createElement(doc, 'data', [['name', '部位']]);
  bodyParts.forEach((part) => {
    const damaged = character.damagedSpecialties?.some((s) => s.includes(part));
    area.appendChild(
      createElement(
        doc,
        'data',
        [
          ['name', part],
          ['type', 'numberResource'],
          ['currentValue', damaged ? '0' : '1'],
        ],
        '1',
      ),
    );
  });
  detail.appendChild(area);

  // char detail 変調
  const statusAilments = createElement(doc, 'data', [['name', '変調']]);
  character.statusAilments?.forEach((ailment) => {
    statusAilments.appendChild(
      createElement(
        doc,
        'data',
        [
          ['name', ailment],
          ['type', 'numberResource'],
          ['currentValue', '1'],
        ],
        '1',
      ),
    );
  });
  detail.appendChild(statusAilments);

  // char detail 特技
  if (character.specialties && character.specialties.length > 0) {
    const specialty = createElement(doc, 'data', [['name', '特技']]);
    character.specialties.forEach((s, i) => {
      specialty.appendChild(
        createElement(doc, 'data', [['name', `特技${i + 1}`]], s),
      );
    });
    detail.appendChild(specialty);
  }

  // char detail アビリティ
  if (character.abilities && character.abilities.length > 0) {
    const abilities = createElement(doc, 'data', [['name', 'アビリティ']]);
    character.abilities.forEach((a) => {
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

  // char detail アイテム
  if (character.items && character.items.length > 0) {
    const items = createElement(doc, 'data', [['name', 'アイテム']]);
    character.items.forEach((item) => {
      items.appendChild(
        createElement(
          doc,
          'data',
          [
            ['name', item.name],
            ['type', 'numberResource'],
            ['currentValue', String(item.number || 1)],
          ],
          String(item.number || 1),
        ),
      );
    });
    detail.appendChild(items);
  }

  // char detail 袋
  character.bags?.forEach((bag) => {
    const bagElm = createElement(doc, 'data', [['name', bag.name]]);
    bag.items?.forEach((item) => {
      bagElm.appendChild(
        createElement(
          doc,
          'data',
          [
            ['name', item.name],
            ['type', 'numberResource'],
            ['currentValue', String(item.number || 1)],
          ],
          String(item.number || 1),
        ),
      );
    });
    detail.appendChild(bagElm);
  });

  // char detail 装備
  if (character.equipments && character.equipments.length > 0) {
    const equipments = createElement(doc, 'data', [['name', '装備']]);
    character.equipments.forEach((e) => {
      equipments.appendChild(
        createElement(
          doc,
          'data',
          [
            ['name', e.name],
            ['type', 'note'],
          ],
          `${e.area}/${e.type}/${e.specialty}/${e.target}/${e.trait}/${e.effect}`,
        ),
      );
    });
    detail.appendChild(equipments);
  }

  // char detail
  char.appendChild(detail);

  // add char
  characterElm.appendChild(char);

  // add palette
  let paletteText = '//------アビリティ\n';
  if (character.abilities && character.abilities.length > 0) {
    paletteText += character.abilities.map((a) => `[${a.name}] {${a.name}}`).join('\n');
  }
  const palette = createElement(doc, 'chat-palette', [], paletteText);
  characterElm.appendChild(palette);

  // add character to doc
  doc.appendChild(characterElm);

  return convertDocToXML(doc);
};

// ユドナリウム用ZIPファイルを生成してダウンロード
export const exportCharacterToUdonarium = async (
  character: CreateCharacterRequest,
  characterId: string,
): Promise<void> => {
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'), {
    bufferedWrite: true,
  });

  let imageIdentifier: string | undefined;
  let imageExtension: string | undefined;

  // 画像がある場合は取得してハッシュ計算
  if (character.imageUrl) {
    try {
      const imageData = await fetchImageAsArrayBuffer(character.imageUrl);
      const hash = await calculateSHA256(imageData);
      imageIdentifier = hash;

      // 画像の拡張子を取得
      const urlPath = new URL(character.imageUrl).pathname;
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
  const xml = characterToUdonariumDoc(character, characterId, imageIdentifier);
  const xmlBlob = new Blob([xml], { type: 'text/xml' });
  await zipWriter.add('data.xml', new BlobReader(xmlBlob));

  // ZIPファイルを生成してダウンロード
  const blob = await zipWriter.close();
  saveAs(blob, `${character.name}.zip`);
};
