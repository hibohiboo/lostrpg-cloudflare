// スプレッドシートの数値セルは "+3" や "-"(未設定)のような表記が入る可能性があるため、
// 変換に失敗した場合は0にフォールバックする
export const parseNumeric = (value: string | undefined): number => {
  if (!value) return 0;
  const normalized = value.trim().replace(/^\+/, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};
