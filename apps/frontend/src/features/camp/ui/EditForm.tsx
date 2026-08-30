import {
  dragonPlainEquipmentList,
  equipmentList,
} from '@lostrpg/core/game-data/camp';
import { buildItemCatalog } from '@lostrpg/core/game-data/item';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import { Link } from 'react-router';
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
}) => {
  const itemCatalog = useMemo(
    () => buildItemCatalog(camp.supplements ?? {}),
    [camp.supplements],
  );

  const facilityCatalog = useMemo(() => {
    const catalog = [...equipmentList];
    if (camp.supplements?.useDragonPlain)
      catalog.push(...dragonPlainEquipmentList);
    return catalog;
  }, [camp.supplements?.useDragonPlain]);

  return (
    <Box>
      {/* プレイヤー名 */}
      <Box sx={{ my: 2 }}>
        <TextField
          fullWidth
          label="プレイヤー名"
          value={camp.playerName}
          onChange={(e) => setCamp({ ...camp, playerName: e.target.value })}
        />
      </Box>

      {/* キャンプ名（必須） */}
      <Box sx={{ my: 2 }}>
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

      {/* サプリメント */}
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          サプリメント
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={camp.supplements?.useStrangeField ?? false}
                onChange={(e) =>
                  setCamp({
                    ...camp,
                    supplements: {
                      ...camp.supplements,
                      useStrangeField: e.target.checked,
                    },
                  })
                }
              />
            }
            label="異界の原野"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={camp.supplements?.useDragonPlain ?? false}
                onChange={(e) =>
                  setCamp({
                    ...camp,
                    supplements: {
                      ...camp.supplements,
                      useDragonPlain: e.target.checked,
                    },
                  })
                }
              />
            }
            label="竜の平原"
          />
        </FormGroup>
      </Box>

      {/* 施設テーブル */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          施設
        </Typography>

        {/* 設備・人材追加 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <AddFacilityForm
            equipmentSelect={equipmentSelect}
            onEquipmentAdd={handleEquipmentAdd}
            catalog={facilityCatalog}
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
      <Box sx={{ my: 3 }}>
        <Typography variant="h6" gutterBottom>
          倉庫
        </Typography>

        <Box sx={{ mb: 2 }}>
          <AddItemForm catalog={itemCatalog} onItemAdd={handleItemAdd} />
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
      <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
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
      <Box sx={{ my: 2 }}>
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
      <Box sx={{ my: 2 }}>
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
      <Box sx={{ my: 2 }}>
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
      <Box sx={{ my: 2 }}>
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
        <Box sx={{ my: 2, display: 'none' }}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            削除
          </Button>
        </Box>
      )}

      {/* 戻るリンク */}
      <Box sx={{ mt: 4 }}>
        <MuiLink component={Link} to={prevPath} underline="hover">
          戻る
        </MuiLink>
      </Box>
    </Box>
  );
};

export default EditForm;
