import React from 'react';
import { IconType } from 'react-icons';
import { FaPlus } from 'react-icons/fa';
import { Card } from '../Card';
import { Button } from './Button';

interface CardSectionProps {
  title: string;
  icon: IconType;
  iconColor: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addButtonText?: string;
  addButtonVariant?: 'primary' | 'secondary' | 'danger' | 'success' | 'purple';
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  icon: Icon,
  iconColor,
  children,
  onAdd,
  addButtonText = '追加',
  addButtonVariant = 'primary',
}) => (
  <Card>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon className={iconColor} />
        {title}
      </h2>
    </div>
    {children}
    <div className="flex justify-end mt-4">
      {onAdd && (
        <Button onClick={onAdd} variant={addButtonVariant}>
          <FaPlus size={14} />
          {addButtonText}
        </Button>
      )}
    </div>
  </Card>
);
