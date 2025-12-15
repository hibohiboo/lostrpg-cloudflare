import React from 'react';

interface ClassStat {
  name: string;
  body: number;
  reflex: number;
  sense: number;
  intellect: number;
  supernatural: number;
  hp: number;
  sp: number;
}

const classStats: ClassStat[] = [
  {
    name: 'マッスル',
    body: 3,
    reflex: 2,
    sense: 2,
    intellect: 1,
    supernatural: 0,
    hp: 38,
    sp: 17,
  },
  {
    name: 'テクノロジー',
    body: 1,
    reflex: 2,
    sense: 3,
    intellect: 2,
    supernatural: 0,
    hp: 30,
    sp: 25,
  },
  {
    name: 'マジカル',
    body: 1,
    reflex: 1,
    sense: 1,
    intellect: 2,
    supernatural: 3,
    hp: 23,
    sp: 32,
  },
  {
    name: 'サイキック',
    body: 1,
    reflex: 1,
    sense: 2,
    intellect: 2,
    supernatural: 2,
    hp: 25,
    sp: 30,
  },
  {
    name: 'バイオ',
    body: 2,
    reflex: 2,
    sense: 2,
    intellect: 2,
    supernatural: 0,
    hp: 36,
    sp: 19,
  },
  {
    name: 'エスペラント',
    body: 1,
    reflex: 2,
    sense: 1,
    intellect: 2,
    supernatural: 2,
    hp: 27,
    sp: 28,
  },
  {
    name: 'アーティファクト',
    body: 2,
    reflex: 1,
    sense: 2,
    intellect: 1,
    supernatural: 2,
    hp: 34,
    sp: 21,
  },
  {
    name: 'アーツ',
    body: 1,
    reflex: 3,
    sense: 2,
    intellect: 2,
    supernatural: 0,
    hp: 32,
    sp: 23,
  },
];

const tableHeaders = [
  'クラス名',
  '肉体',
  '反射',
  '感覚',
  '知力',
  '超常',
  'ＨＰ',
  'ＳＰ',
];

const getClassStatValues = (classStat: ClassStat): (string | number)[] => [
  classStat.name,
  classStat.body,
  classStat.reflex,
  classStat.sense,
  classStat.intellect,
  classStat.supernatural,
  classStat.hp,
  classStat.sp,
];

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-3 py-2 border border-gray-300 font-semibold text-gray-700">
    {children}
  </th>
);

const TableCell: React.FC<{ 
  children: React.ReactNode; 
  isFirst?: boolean;
}> = ({ children, isFirst = false }) => (
  <td className={`px-3 py-2 border border-gray-300 ${isFirst ? 'font-medium' : 'text-center'}`}>
    {children}
  </td>
);

export const ClassStatsTable: React.FC = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-300 rounded-lg text-sm">
      <thead className="bg-gray-50">
        <tr>
          {tableHeaders.map((header) => (
            <TableHeader key={header}>{header}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {classStats.map((classStat) => (
          <tr key={classStat.name} className="hover:bg-gray-50">
            {getClassStatValues(classStat).map((value, index) => (
              <TableCell key={index} isFirst={index === 0}>
                {value}
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
