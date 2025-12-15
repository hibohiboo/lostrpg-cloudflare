import React from 'react';
import { Link } from 'react-router';

export interface Character {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CharacterListPageProps {
  characters: Character[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const CharacterListPage: React.FC<CharacterListPageProps> = ({
  characters,
  loading = false,
  error = null,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            再読み込み
          </button>
        )}
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-24 h-24 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          キャラクターがありません
        </h3>
        <p className="text-gray-500 mb-6">
          最初のキャラクターを作成してみましょう！
        </p>
        <Link
          to="/character/create"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          キャラクターを作成する
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {characters.map((character) => (
        <div
          key={character.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <Link
                to={`/character/${character.id}`}
                className="text-xl font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                {character.name}
              </Link>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>
                  作成:{' '}
                  {new Date(character.createdAt).toLocaleDateString('ja-JP')}
                </span>
                <span className="mx-2">•</span>
                <span>
                  更新:{' '}
                  {new Date(character.updatedAt).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
            <Link
              to={`/character/${character.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              詳細を見る →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
