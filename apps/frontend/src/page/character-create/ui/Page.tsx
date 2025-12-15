import { CharacterCreationForm } from '@age-of-hero/ui';
import type { CharacterFormData } from '@age-of-hero/ui';
import { useNavigate } from 'react-router';
import {
  useSpreadSheetItemData,
  useSpreadSheetSkillData,
  useSpreadSheetUltimateData,
} from '@age-of-hero/frontend/shared/spreadsheet';

export function Page() {
  const navigate = useNavigate();
  const skillData = useSpreadSheetSkillData();
  const ultimateSkillData = useSpreadSheetUltimateData();
  const presetItems = useSpreadSheetItemData();

  const handleSubmit = async (data: CharacterFormData) => {
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('キャラクター作成に失敗しました');
      }

      const result = await response.json();

      // キャラクター詳細ページに移動
      navigate(`/character/${result.id}`);
    } catch (error) {
      console.error('キャラクター作成エラー:', error);
      alert('キャラクター作成に失敗しました。');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Age of Hero キャラクター作成
      </h1>
      <CharacterCreationForm
        onSubmit={handleSubmit}
        externalSkills={skillData}
        ultimateSkills={ultimateSkillData}
        presetItems={presetItems}
      />
    </div>
  );
}
