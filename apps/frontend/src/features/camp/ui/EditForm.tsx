import { items } from '@lostrpg/core/game-data/item';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  AddFacilityForm,
  AddPersonalityForm,
  FacilityTable,
} from '@lostrpg/frontend/entities/facility';
import { AddItemForm, ItemTable } from '@lostrpg/frontend/entities/item';
import { ImageUploadField } from '@lostrpg/frontend/shared/ui';
import { EditFormViewModel } from '../hooks/useEditFormHooks';

type Props = EditFormViewModel & {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

const EditForm: React.FC<Props> = ({
  camp,
  isValidError,
  previewUrl,
  equipmentSelect,
  personalitySelect,
  prevPath,
  setCamp,
  handleImageChange,
  handleEquipmentAdd,
  handlePersonalityAdd,
  handleItemAdd,
  handleFacilityDelete,
  handleItemDelete,
  handleFacilityUpdate,
  handleItemUpdate,
  handleSave,
  handleDelete,
}) => (
  <Box>
    {/* プレイヤー名 */}
    <Box my={2}>
      <TextField
        fullWidth
        label="プレイヤー名"
        value={camp.playerName}
        onChange={(e) => setCamp({ ...camp, playerName: e.target.value })}
      />
    </Box>

    {/* キャンプ名（必須） */}
    <Box my={2}>
      <TextField
        fullWidth
        required
        label="キャンプ名"
        error={!camp.name && isValidError}
        helperText={!camp.name && isValidError ? 'キャンプ名は必須です' : ''}
        value={camp.name}
        onChange={(e) => setCamp({ ...camp, name: e.target.value })}
      />
    </Box>

    {/* 画像アップロード */}
    <ImageUploadField
      previewUrl={previewUrl}
      currentImageUrl={camp.imageUrl}
      onImageChange={handleImageChange}
    />

    {/* 施設テーブル */}
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        施設
      </Typography>

      {/* 設備・人材追加 */}
      <Box display="flex" gap={2} mb={2}>
        <AddFacilityForm
          equipmentSelect={equipmentSelect}
          onEquipmentAdd={handleEquipmentAdd}
        />

        <AddPersonalityForm
          personalitySelect={personalitySelect}
          onPersonalityAdd={handlePersonalityAdd}
        />
      </Box>

      <Box sx={{ width: '100%' }}>
        <FacilityTable
          facilities={camp.facilities}
          handleFacilityDelete={handleFacilityDelete}
          handleFacilityUpdate={handleFacilityUpdate}
        />
      </Box>
    </Box>

    {/* アイテムテーブル */}
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        倉庫
      </Typography>

      <Box mb={2}>
        <AddItemForm catalog={items} onItemAdd={handleItemAdd} />
      </Box>

      <Box sx={{ width: '100%' }}>
        <ItemTable
          items={camp.items}
          handleItemDelete={handleItemDelete}
          handleItemUpdate={handleItemUpdate}
        />
      </Box>
    </Box>

    {/* キャンプポイント */}
    <Box display="flex" gap={2} my={2}>
      <TextField
        type="number"
        label="未使用CP"
        value={camp.unusedCampPoint}
        onChange={(e) =>
          setCamp({ ...camp, unusedCampPoint: Number(e.target.value) })
        }
        sx={{ flex: 1 }}
      />
      <TextField
        type="number"
        label="合計CP"
        value={camp.totalCampPoint}
        onChange={(e) =>
          setCamp({ ...camp, totalCampPoint: Number(e.target.value) })
        }
        sx={{ flex: 1 }}
      />
    </Box>

    {/* サマリー */}
    <Box my={2}>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="概要"
        value={camp.summary}
        onChange={(e) => setCamp({ ...camp, summary: e.target.value })}
      />
    </Box>

    {/* 詳細 */}
    <Box my={2}>
      <TextField
        fullWidth
        multiline
        rows={5}
        label="詳細"
        value={camp.freeWriting}
        onChange={(e) => setCamp({ ...camp, freeWriting: e.target.value })}
      />
    </Box>

    {/* パスワード */}
    <Box my={2}>
      <TextField
        fullWidth
        type="password"
        label="パスワード（任意）"
        value={camp.password || ''}
        onChange={(e) => setCamp({ ...camp, password: e.target.value })}
        helperText="パスワードを設定すると、キャンプの編集にパスワードが必要になります"
      />
    </Box>

    {/* 保存ボタン */}
    <Box my={2}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
        onClick={handleSave}
      >
        保存
      </Button>
    </Box>

    {/* 削除ボタン（編集時のみ表示する想定） */}
    {handleDelete && (
      <Box my={2} sx={{ display: 'none' }}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          削除
        </Button>
      </Box>
    )}

    {/* 戻るリンク */}
    <Box mt={4}>
      <MuiLink href={prevPath} underline="hover">
        戻る
      </MuiLink>
    </Box>
  </Box>
);

export default EditForm;
