import { CharacterListPage, type Character } from '@age-of-hero/ui';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export function Page() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/characters');
      if (!response.ok) {
        throw new Error('キャラクター一覧の取得に失敗しました');
      }
      const data = await response.json();
      setCharacters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleRetry = () => {
    fetchCharacters();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">キャラクター一覧</h1>
        <Link
          to="/character/create"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ＋ 新しいキャラクターを作成
        </Link>
      </div>

      <CharacterListPage
        characters={characters}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
}
