import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useMemo } from 'react';
import { SpecialtiesTable } from '@lostrpg/frontend/shared/ui';
import type { EditFormViewModel } from '../hooks/useEditFormHooks';

type Props = EditFormViewModel & {
  handleSave: () => void;
  handleDelete?: () => void;
  prevPath: string;
};

// Helper function to create specialties table rows
const createSpecialtiesTableRows = (
  specialties: string[],
  damagedSpecialties: string[],
) => {
  const createCell = (name: string, isBodyParts = false) => ({
    name,
    selected: specialties.includes(name),
    damaged: damagedSpecialties.includes(name),
    isBodyParts,
  });

  return [
    {
      number: 1,
      talent: createCell('武器攻撃'),
      a: createCell(''),
      head: createCell('頭部', true),
      b: createCell(''),
      arms: createCell('腕部', true),
      c: createCell(''),
      torso: createCell('胴部', true),
      d: createCell(''),
      legs: createCell('脚部', true),
      e: createCell(''),
      survival: createCell('生存'),
    },
    {
      number: 2,
      talent: createCell('魔法攻撃'),
      a: createCell('武器攻撃'),
      head: createCell(''),
      b: createCell('魔法攻撃'),
      arms: createCell(''),
      c: createCell('回避'),
      torso: createCell(''),
      d: createCell('防御'),
      legs: createCell(''),
      e: createCell('生存'),
      survival: createCell(''),
    },
    {
      number: 3,
      talent: createCell('回避'),
      a: createCell(''),
      head: createCell('武器攻撃'),
      b: createCell(''),
      arms: createCell('魔法攻撃'),
      c: createCell(''),
      torso: createCell('回避'),
      d: createCell(''),
      legs: createCell('防御'),
      e: createCell(''),
      survival: createCell('知覚'),
    },
    {
      number: 4,
      talent: createCell('防御'),
      a: createCell('魔法攻撃'),
      head: createCell(''),
      b: createCell('回避'),
      arms: createCell(''),
      c: createCell('防御'),
      torso: createCell(''),
      d: createCell('知覚'),
      legs: createCell(''),
      e: createCell('知覚'),
      survival: createCell(''),
    },
    {
      number: 5,
      talent: createCell('知覚'),
      a: createCell(''),
      head: createCell('魔法攻撃'),
      b: createCell(''),
      arms: createCell('回避'),
      c: createCell(''),
      torso: createCell('防御'),
      d: createCell(''),
      legs: createCell('知覚'),
      e: createCell(''),
      survival: createCell('隠密'),
    },
    {
      number: 6,
      talent: createCell('隠密'),
      a: createCell('回避'),
      head: createCell(''),
      b: createCell('防御'),
      arms: createCell(''),
      c: createCell('知覚'),
      torso: createCell(''),
      d: createCell('隠密'),
      legs: createCell(''),
      e: createCell('隠密'),
      survival: createCell(''),
    },
    {
      number: 7,
      talent: createCell('交渉'),
      a: createCell(''),
      head: createCell('回避'),
      b: createCell(''),
      arms: createCell('防御'),
      c: createCell(''),
      torso: createCell('知覚'),
      d: createCell(''),
      legs: createCell('隠密'),
      e: createCell(''),
      survival: createCell('交渉'),
    },
    {
      number: 8,
      talent: createCell('知識'),
      a: createCell('防御'),
      head: createCell(''),
      b: createCell('知覚'),
      arms: createCell(''),
      c: createCell('隠密'),
      torso: createCell(''),
      d: createCell('交渉'),
      legs: createCell(''),
      e: createCell('交渉'),
      survival: createCell(''),
    },
  ];
};

/* eslint-disable complexity */
const EditForm: React.FC<Props> = ({
  character,
  isValidError,
  previewUrl,
  classSelect,
  itemSelect,
  equipmentArea,
  bagName,
  totalWeight,
  totalValue,
  classList,
  items,
  prevPath,
  setClassSelect,
  setItemSelect,
  setEquipmentArea,
  setBagName,
  setCharacter,
  handleImageChange,
  handleClassAdd,
  handleClassDelete,
  handleSpecialtyToggle,
  handleGapToggle,
  handleDamageToggle,
  handleItemAdd,
  handleItemUpdate,
  handleItemDelete,
  handleEquipmentAdd,
  handleEquipmentUpdate,
  handleEquipmentDelete,
  handleBagAdd,
  handleBagUpdate,
  handleBagDelete,
  handleStatusAilmentToggle,
  handleBackboneAdd,
  handleBackboneUpdate,
  handleBackboneDelete,
  handleSave,
  handleDelete,
}) => {
  // 特技テーブルのデータ構造を生成

  const specialtiesTableRows = useMemo(
    () =>
      createSpecialtiesTableRows(
        character.specialties,
        character.damagedSpecialties,
      ),
    [character.specialties, character.damagedSpecialties],
  );

  // アイテムテーブルの列定義
  const itemColumns: GridColDef[] = [
    { field: 'name', headerName: '名前', width: 200, editable: true },
    {
      field: 'number',
      headerName: '個数',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'weight',
      headerName: '重量',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'j',
      headerName: '価格(J)',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => handleItemDelete(params.row.id)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  // 装備テーブルの列定義
  const equipmentColumns: GridColDef[] = [
    { field: 'equipedArea', headerName: '部位', width: 120, editable: true },
    { field: 'name', headerName: '名前', width: 200, editable: true },
    {
      field: 'weight',
      headerName: '重量',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'j',
      headerName: '価格(J)',
      width: 100,
      type: 'number',
      editable: true,
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => handleEquipmentDelete(params.row.id)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  // バックボーンテーブルの列定義
  const backboneColumns: GridColDef[] = [
    { field: 'name', headerName: '名前', width: 200, editable: true },
    { field: 'type', headerName: '種類', width: 150, editable: true },
    { field: 'effect', headerName: '効果', width: 300, editable: true },
    {
      field: 'actions',
      headerName: '操作',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => handleBackboneDelete(params.row.id)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  return (
    <Box>
      {/* プレイヤー名 */}
      <Box my={2}>
        <TextField
          fullWidth
          label="プレイヤー名"
          value={character.playerName}
          onChange={(e) =>
            setCharacter({ ...character, playerName: e.target.value })
          }
        />
      </Box>

      {/* キャラクター名（必須） */}
      <Box my={2}>
        <TextField
          fullWidth
          required
          label="キャラクター名"
          error={!character.name && isValidError}
          helperText={
            !character.name && isValidError ? 'キャラクター名は必須です' : ''
          }
          value={character.name}
          onChange={(e) => setCharacter({ ...character, name: e.target.value })}
        />
      </Box>

      {/* 画像アップロード */}
      <Box my={2}>
        <InputLabel>画像</InputLabel>
        <Box
          border={1}
          borderColor="grey.300"
          borderRadius={1}
          p={2}
          mt={1}
          sx={{ maxWidth: 480, minHeight: 100, overflow: 'hidden' }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="プレビュー"
              style={{ width: '100%', display: 'block' }}
            />
          ) : (
            <Typography color="text.secondary">画像未選択</Typography>
          )}
        </Box>
        <Button component="label" variant="outlined" sx={{ mt: 1 }}>
          画像を選択
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      {/* クラス */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          クラス
        </Typography>
        <Select
          value={classSelect}
          label="クラス追加"
          onChange={(e: SelectChangeEvent) => {
            const { value } = e.target;
            setClassSelect(value);
            if (value) {
              handleClassAdd(value);
            }
          }}
          sx={{ minWidth: 200, mb: 2 }}
        >
          <MenuItem value="">未選択</MenuItem>
          {classList.map((cls) => (
            <MenuItem value={cls.name} key={cls.name}>
              {cls.name}
            </MenuItem>
          ))}
        </Select>

        <Box display="flex" flexWrap="wrap" gap={1}>
          {character.classes.map((cls) => (
            <Chip
              key={cls.id}
              label={cls.name}
              onDelete={() => handleClassDelete(cls.id)}
              color="primary"
            />
          ))}
          {character.classes.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              クラスが選択されていません
            </Typography>
          )}
        </Box>
      </Box>

      {/* 専門特技テーブル */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          専門特技
        </Typography>
        <SpecialtiesTable
          rows={specialtiesTableRows}
          gaps={character.gaps}
          damagedSpecialties={character.damagedSpecialties}
          onGapChange={handleGapToggle}
          onSpecialtySelect={handleSpecialtyToggle}
          onDamageChange={handleDamageToggle}
        />
      </Box>

      {/* 選択された専門特技の表示 */}
      <Box my={3}>
        <InputLabel>選択された専門特技</InputLabel>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {character.specialties.length > 0 ? (
            character.specialties.map((specialty) => (
              <Chip key={specialty} label={specialty} color="primary" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              専門特技が選択されていません
            </Typography>
          )}
        </Box>
      </Box>

      {/* スタミナと意志力 */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          能力値
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            type="number"
            label="スタミナ基本値"
            value={character.staminaBase}
            onChange={(e) =>
              setCharacter({
                ...character,
                staminaBase: Number(e.target.value),
              })
            }
            sx={{ width: 150 }}
          />
          <TextField
            type="number"
            label="現在スタミナ"
            value={character.stamina}
            onChange={(e) =>
              setCharacter({ ...character, stamina: Number(e.target.value) })
            }
            sx={{ width: 150 }}
          />
          <TextField
            type="number"
            label="意志力基本値"
            value={character.willPowerBase}
            onChange={(e) =>
              setCharacter({
                ...character,
                willPowerBase: Number(e.target.value),
              })
            }
            sx={{ width: 150 }}
          />
          <TextField
            type="number"
            label="現在意志力"
            value={character.willPower}
            onChange={(e) =>
              setCharacter({
                ...character,
                willPower: Number(e.target.value),
              })
            }
            sx={{ width: 150 }}
          />
        </Box>
      </Box>

      {/* 運搬能力とアイテム */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          アイテム
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            type="number"
            label="運搬能力"
            value={character.carryingCapacity}
            onChange={(e) =>
              setCharacter({
                ...character,
                carryingCapacity: Number(e.target.value),
              })
            }
            sx={{ width: 150 }}
          />
          <TextField
            type="number"
            label="合計重量"
            value={totalWeight.toFixed(1)}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{ width: 150 }}
          />
          <TextField
            type="number"
            label="合計価格(J)"
            value={totalValue}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{ width: 150 }}
          />
        </Box>

        <Select
          value={itemSelect}
          label="アイテム追加"
          onChange={(e: SelectChangeEvent) => {
            const { value } = e.target;
            setItemSelect(value);
            if (value) {
              handleItemAdd(value);
            }
          }}
          sx={{ minWidth: 200, mb: 2 }}
        >
          <MenuItem value="">未選択</MenuItem>
          {items.map((item) => (
            <MenuItem value={item.name} key={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>

        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={character.items}
            columns={itemColumns}
            processRowUpdate={handleItemUpdate}
            hideFooter
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: 'アイテムがありません',
            }}
          />
        </Box>
      </Box>

      {/* 装備 */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          装備
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="部位"
            value={equipmentArea}
            onChange={(e) => setEquipmentArea(e.target.value)}
            sx={{ width: 200 }}
          />
          <Button variant="outlined" onClick={handleEquipmentAdd}>
            追加
          </Button>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={character.equipment}
            columns={equipmentColumns}
            processRowUpdate={handleEquipmentUpdate}
            hideFooter
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: '装備がありません',
            }}
          />
        </Box>
      </Box>

      {/* バッグ */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          バッグ
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="バッグ名"
            value={bagName}
            onChange={(e) => setBagName(e.target.value)}
            sx={{ width: 200 }}
          />
          <Button variant="outlined" onClick={handleBagAdd}>
            追加
          </Button>
        </Box>
        {character.bags.map((bag) => (
          <Box
            key={bag.id}
            my={2}
            p={2}
            border={1}
            borderColor="grey.300"
            borderRadius={1}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="subtitle1">{bag.name}</Typography>
              <Button
                size="small"
                color="error"
                onClick={() => handleBagDelete(bag.id)}
              >
                削除
              </Button>
            </Box>
            <TextField
              type="number"
              label="容量"
              value={bag.capacity}
              onChange={(e) =>
                handleBagUpdate({ ...bag, capacity: Number(e.target.value) })
              }
              sx={{ width: 150, mb: 2 }}
            />
          </Box>
        ))}
      </Box>

      {/* 状態異常 */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          状態異常
        </Typography>
        <Box>
          {character.statusAilments.map((ailment) => (
            <FormControlLabel
              key={ailment.id}
              control={
                <Checkbox
                  checked={ailment.isChecked}
                  onChange={() => handleStatusAilmentToggle(ailment.id)}
                />
              }
              label={`${ailment.name} - ${ailment.effect}`}
            />
          ))}
        </Box>
      </Box>

      {/* バックボーン */}
      {character.useStrangeField && (
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            バックボーン
          </Typography>
          <Button variant="outlined" onClick={handleBackboneAdd} sx={{ mb: 2 }}>
            追加
          </Button>
          <Box sx={{ height: 300, width: '100%' }}>
            <DataGrid
              rows={character.backbones}
              columns={backboneColumns}
              processRowUpdate={handleBackboneUpdate}
              hideFooter
              disableRowSelectionOnClick
              localeText={{
                noRowsLabel: 'バックボーンがありません',
              }}
            />
          </Box>
        </Box>
      )}

      {/* 経験値 */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          経験値
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            type="number"
            label="未使用経験値"
            value={character.unusedExperience}
            onChange={(e) =>
              setCharacter({
                ...character,
                unusedExperience: Number(e.target.value),
              })
            }
            sx={{ width: 200 }}
          />
          <TextField
            type="number"
            label="合計経験値"
            value={character.totalExperience}
            onChange={(e) =>
              setCharacter({
                ...character,
                totalExperience: Number(e.target.value),
              })
            }
            sx={{ width: 200 }}
          />
        </Box>
      </Box>

      {/* 概要 */}
      <Box my={2}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="概要"
          value={character.summary}
          onChange={(e) =>
            setCharacter({ ...character, summary: e.target.value })
          }
        />
      </Box>

      {/* 外見 */}
      <Box my={2}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="外見"
          value={character.appearance}
          onChange={(e) =>
            setCharacter({ ...character, appearance: e.target.value })
          }
        />
      </Box>

      {/* 詳細メモ */}
      <Box my={2}>
        <TextField
          fullWidth
          multiline
          rows={5}
          label="メモ"
          value={character.freeWriting}
          onChange={(e) =>
            setCharacter({ ...character, freeWriting: e.target.value })
          }
        />
      </Box>

      {/* 名言 */}
      <Box my={2}>
        <TextField
          fullWidth
          label="名言"
          value={character.quote}
          onChange={(e) =>
            setCharacter({ ...character, quote: e.target.value })
          }
        />
      </Box>

      {/* サプリメント使用 */}
      <Box my={3}>
        <Typography variant="h6" gutterBottom>
          使用サプリメント
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={character.useStrangeField}
                onChange={(e) =>
                  setCharacter({
                    ...character,
                    useStrangeField: e.target.checked,
                  })
                }
              />
            }
            label="ストレンジフィールド"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={character.useDragonPlain}
                onChange={(e) =>
                  setCharacter({
                    ...character,
                    useDragonPlain: e.target.checked,
                  })
                }
              />
            }
            label="竜の平原"
          />
        </Box>
      </Box>

      {/* パスワード */}
      <Box my={2}>
        <TextField
          fullWidth
          type="password"
          label="パスワード（任意）"
          value={character.password || ''}
          onChange={(e) =>
            setCharacter({ ...character, password: e.target.value })
          }
          helperText="パスワードを設定すると、キャラクターの編集にパスワードが必要になります"
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
};
/* eslint-enable complexity */

export default EditForm;
