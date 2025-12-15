import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Button } from './Button';
import { FormField, InputField, TextAreaField } from './FormField';

interface SessionHistoryField {
  id: string;
  sessionName: string;
  gmName: string;
  sessionDate: string;
  currentHp: number;
  currentSp: number;
  currentFc?: number;
  experiencePoints: number;
  memo?: string;
  createdAt: string;
}

interface SessionHistoryFormProps {
  session: SessionHistoryField;
  index: number;
  onUpdate: (
    index: number,
    field: keyof SessionHistoryField,
    value: string | number,
  ) => void;
  onRemove: (index: number) => void;
}

export const SessionHistoryForm: React.FC<SessionHistoryFormProps> = ({
  session,
  index,
  onUpdate,
  onRemove,
}) => (
  <div className="p-4 border border-gray-200 rounded-md">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="セッション名">
        <InputField
          value={session.sessionName}
          onChange={(value) => onUpdate(index, 'sessionName', value)}
          placeholder="セッション名を入力"
        />
      </FormField>

      <FormField label="GM名">
        <InputField
          value={session.gmName}
          onChange={(value) => onUpdate(index, 'gmName', value)}
          placeholder="GM名を入力"
        />
      </FormField>

      <FormField label="セッション実施日">
        <InputField
          type="date"
          value={session.sessionDate}
          onChange={(value) => onUpdate(index, 'sessionDate', value)}
        />
      </FormField>

      <FormField label="獲得経験点">
        <InputField
          type="number"
          min="0"
          value={session.experiencePoints}
          onChange={(value) =>
            onUpdate(index, 'experiencePoints', parseInt(value, 10) || 0)
          }
        />
      </FormField>

      <FormField label="現在HP">
        <InputField
          type="number"
          min="0"
          value={session.currentHp}
          onChange={(value) =>
            onUpdate(index, 'currentHp', parseInt(value, 10) || 0)
          }
        />
      </FormField>

      <FormField label="現在SP">
        <InputField
          type="number"
          min="0"
          value={session.currentSp}
          onChange={(value) =>
            onUpdate(index, 'currentSp', parseInt(value, 10) || 0)
          }
        />
      </FormField>

      <FormField label="ファンチット">
        <InputField
          type="number"
          min="0"
          value={session.currentFc || 0}
          onChange={(value) =>
            onUpdate(index, 'currentFc', parseInt(value, 10) || 0)
          }
        />
      </FormField>

      <FormField label="セッションメモ" className="md:col-span-2">
        <TextAreaField
          value={session.memo || ''}
          onChange={(value) => onUpdate(index, 'memo', value)}
          placeholder="セッションの振り返りや覚えておきたいことを記録"
          rows={3}
        />
      </FormField>
    </div>

    <div className="mt-2">
      <Button onClick={() => onRemove(index)} variant="danger" size="sm">
        <FaTrash size={12} />
        削除
      </Button>
    </div>
  </div>
);
