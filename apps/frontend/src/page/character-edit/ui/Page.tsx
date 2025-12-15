import { CharacterCreationForm } from '@age-of-hero/ui';
import { useParams } from 'react-router';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useCharacterEdit } from '../hooks/useCharacterEdit';
import { transformCharacterToFormData } from '../utils/transformCharacterData';

export function Page() {
  const { id } = useParams<{ id: string }>();
  const {
    character,
    loading,
    error,
    handleSubmit,
    navigateToCharacterList,
    skillData,
    ultimateSkillData,
    presetItems,
  } = useCharacterEdit(id);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !character) {
    return (
      <ErrorState
        error={error || 'キャラクターが見つかりません'}
        onNavigateToList={navigateToCharacterList}
      />
    );
  }

  const initialData = transformCharacterToFormData(character);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        キャラクター編集: {character.name}
      </h1>
      <CharacterCreationForm
        onSubmit={handleSubmit}
        initialData={initialData}
        externalSkills={skillData}
        ultimateSkills={ultimateSkillData}
        presetItems={presetItems}
      />
    </div>
  );
}
