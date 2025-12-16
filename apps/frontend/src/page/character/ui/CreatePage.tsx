import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
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
import React, { useState } from 'react';

// 型定義
interface CharacterClass {
  id: string;
  name: string;
}

interface Ability {
  id: string;
  name: string;
  timing: string;
  judge: string;
  target: string;
  range: string;
  cost: string;
  limit: string;
  effect: string;
}

interface Item {
  id: string;
  name: string;
  number: number;
  weight: number;
  cost: number;
}

interface CharacterFormData {
  playerName: string;
  name: string;
  campId: string;
  imageUrl: string;
  classes: CharacterClass[];
  specialties: string[];
  abilities: Ability[];
  staminaBase: number;
  stamina: number;
  willPowerBase: number;
  willPower: number;
  carryingCapacity: number;
  items: Item[];
  unusedExperience: number;
  totalExperience: number;
  summary: string;
  appearance: string;
  freeWriting: string;
  quote: string;
}

// ダミーデータ
const CLASS_LIST = [
  { name: '戦士' },
  { name: '魔法使い' },
  { name: '僧侶' },
  { name: '盗賊' },
  { name: '騎士' },
  { name: '弓使い' },
];

const SPECIALTY_LIST = [
  '武器攻撃',
  '魔法攻撃',
  '回避',
  '防御',
  '知覚',
  '隠密',
  '交渉',
  '知識',
];

const ITEM_LIST = [
  { name: '回復薬', weight: 0.1, cost: 50 },
  { name: '魔法の石', weight: 0.5, cost: 200 },
  { name: '保存食', weight: 0.3, cost: 10 },
  { name: '武器強化石', weight: 0.2, cost: 500 },
];

const CreatePage: React.FC = () => {
  const [character, setCharacter] = useState<CharacterFormData>({
    playerName: '',
    name: '',
    campId: '',
    imageUrl: '',
    classes: [],
    specialties: [],
    abilities: [],
    staminaBase: 6,
    stamina: 6,
    willPowerBase: 3,
    willPower: 3,
    carryingCapacity: 10,
    items: [],
    unusedExperience: 0,
    totalExperience: 0,
    summary: '',
    appearance: '',
    freeWriting: '',
    quote: '',
  });

  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [classSelect, setClassSelect] = useState('');
  const [itemSelect, setItemSelect] = useState('');

  // 画像変更ハンドラー
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // クラス追加ハンドラー
  const handleClassAdd = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setClassSelect(value);
    if (value) {
      const newClass: CharacterClass = {
        id: `class-${Date.now()}`,
        name: value,
      };
      setCharacter({
        ...character,
        classes: [...character.classes, newClass],
      });
      setClassSelect('');
    }
  };

  // クラス削除ハンドラー
  const handleClassDelete = (id: string) => {
    setCharacter({
      ...character,
      classes: character.classes.filter((c) => c.id !== id),
    });
  };

  // 専門特技追加ハンドラー
  const handleSpecialtyToggle = (specialty: string) => {
    if (character.specialties.includes(specialty)) {
      setCharacter({
        ...character,
        specialties: character.specialties.filter((s) => s !== specialty),
      });
    } else {
      setCharacter({
        ...character,
        specialties: [...character.specialties, specialty],
      });
    }
  };

  // アイテム追加ハンドラー
  const handleItemAdd = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setItemSelect(value);
    const item = ITEM_LIST.find((i) => i.name === value);
    if (item) {
      const newItem: Item = {
        id: `item-${Date.now()}`,
        name: item.name,
        number: 1,
        weight: item.weight,
        cost: item.cost,
      };
      setCharacter({ ...character, items: [...character.items, newItem] });
      setItemSelect('');
    }
  };

  // アイテム更新ハンドラー
  const handleItemUpdate = (updatedRow: Item) => {
    setCharacter({
      ...character,
      items: character.items.map((i) =>
        i.id === updatedRow.id ? updatedRow : i,
      ),
    });
    return updatedRow;
  };

  // アイテム削除ハンドラー
  const handleItemDelete = (id: string) => {
    setCharacter({
      ...character,
      items: character.items.filter((i) => i.id !== id),
    });
  };

  // 保存ハンドラー
  const handleSave = () => {
    if (!character.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    console.log('Saving character:', character);
    alert('キャラクターを保存しました（ダミー動作）');
  };

  // 削除ハンドラー
  const handleDelete = () => {
    if (window.confirm('本当に削除しますか？')) {
      console.log('Deleting character');
      alert('キャラクターを削除しました（ダミー動作）');
    }
  };

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
      field: 'cost',
      headerName: '価格',
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

  const totalWeight = character.items.reduce(
    (sum, item) => sum + item.weight * item.number,
    0,
  );

  const totalValue = character.items.reduce(
    (sum, item) => sum + item.cost * item.number,
    0,
  );

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          キャラクター作成
        </Typography>

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
            onChange={(e) =>
              setCharacter({ ...character, name: e.target.value })
            }
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
          <FormControl sx={{ minWidth: 200, mb: 2 }}>
            <InputLabel>クラス追加</InputLabel>
            <Select
              value={classSelect}
              label="クラス追加"
              onChange={handleClassAdd}
            >
              <MenuItem value="">未選択</MenuItem>
              {CLASS_LIST.map((cls) => (
                <MenuItem value={cls.name} key={cls.name}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

        {/* 専門特技 */}
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            専門特技
          </Typography>
          <Box>
            {SPECIALTY_LIST.map((specialty) => (
              <FormControlLabel
                key={specialty}
                control={
                  <Checkbox
                    checked={character.specialties.includes(specialty)}
                    onChange={() => handleSpecialtyToggle(specialty)}
                  />
                }
                label={specialty}
              />
            ))}
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
              label="合計価格"
              value={totalValue}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ width: 150 }}
            />
          </Box>

          <FormControl sx={{ minWidth: 200, mb: 2 }}>
            <InputLabel>アイテム追加</InputLabel>
            <Select
              value={itemSelect}
              label="アイテム追加"
              onChange={handleItemAdd}
            >
              <MenuItem value="">未選択</MenuItem>
              {ITEM_LIST.map((item) => (
                <MenuItem value={item.name} key={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
        <Box my={2} sx={{ display: 'none' }}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            削除
          </Button>
        </Box>

        {/* 戻るリンク */}
        <Box mt={4}>
          <MuiLink href="/character/list" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default CreatePage;
