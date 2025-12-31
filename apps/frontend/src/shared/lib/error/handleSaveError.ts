/**
 * 保存エラーのハンドリング
 * 401エラーの場合はパスワード確認のアラートを表示
 * その他のエラーは一般的なエラーメッセージを表示
 */
export const handleSaveError = (error: unknown): void => {
  console.warn('保存エラー:', error);

  if (error && typeof error === 'object') {
    const err = error as { originalStatus?: number };

    // RTK Queryのエラーは status または originalStatus を持つ
    const statusCode = err.originalStatus;

    if (statusCode === 401) {
      alert('パスワードが正しくありません。もう一度ご確認ください');
      return;
    }
  }

  // その他のエラー
  alert('保存中にエラーが発生しました。もう一度お試しください。');
};
