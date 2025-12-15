import { CharacterDetailPage, type CharacterDetail } from '@lostrpg/ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export function Page() {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<CharacterDetail | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = async () => {
    if (!id) {
      setError('キャラクターIDが指定されていません');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/characters/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('キャラクターが見つかりません');
        }
        throw new Error('キャラクターの取得に失敗しました');
      }

      const data = await response.json();
      setCharacter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  const handleRetry = () => {
    fetchCharacter();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CharacterDetailPage
        character={character}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
}
