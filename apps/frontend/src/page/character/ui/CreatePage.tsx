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

interface Equipment {
  id: string;
  equipedArea: string;
  name: string;
  weight: number;
  cost: number;
}

interface Bag {
  id: string;
  name: string;
  capacity: number;
  items: Item[];
}

interface StatusAilment {
  id: string;
  name: string;
  effect: string;
  isChecked: boolean;
}

interface Backbone {
  id: string;
  title: string;
  content: string;
}

interface SpecialtyRow {
  id: string;
  specialty: string;
  gap: number;
  damage: number;
}

interface CharacterFormData {
  playerName: string;
  name: string;
  campId: string;
  imageUrl: string;
  classes: CharacterClass[];
  specialties: string[];
  specialtyRows: SpecialtyRow[];
  abilities: Ability[];
  staminaBase: number;
  stamina: number;
  willPowerBase: number;
  willPower: number;
  carryingCapacity: number;
  items: Item[];
  equipment: Equipment[];
  bags: Bag[];
  statusAilments: StatusAilment[];
  backbones: Backbone[];
  unusedExperience: number;
  totalExperience: number;
  summary: string;
  appearance: string;
  freeWriting: string;
  quote: string;
  useStrangeField: boolean;
  useDragonPlain: boolean;
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
    specialtyRows: [],
    abilities: [],
    staminaBase: 6,
    stamina: 6,
    willPowerBase: 3,
    willPower: 3,
    carryingCapacity: 10,
    items: [],
    equipment: [],
    bags: [],
    statusAilments: [
      { id: '1', name: '毒', effect: 'ラウンド終了時に2D6ダメージ', isChecked: false },
      { id: '2', name: '呪い', effect: '判定-1D6', isChecked: false },
      { id: '3', name: '気絶', effect: '行動不能', isChecked: false },
    ],
    backbones: [],
    unusedExperience: 0,
    totalExperience: 0,
    summary: '',
    appearance: '',
    freeWriting: '',
    quote: '',
    useStrangeField: false,
    useDragonPlain: false,
  });

  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [classSelect, setClassSelect] = useState('');
  const [itemSelect, setItemSelect] = useState('');
  const [equipmentArea, setEquipmentArea] = useState('');
  const [bagName, setBagName] = useState('');

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

  // 装備追加ハンドラー
  const handleEquipmentAdd = () => {
    if (!equipmentArea) return;
    const newEquipment: Equipment = {
      id: `eq-${Date.now()}`,
      equipedArea: equipmentArea,
      name: '',
      weight: 0,
      cost: 0,
    };
    setCharacter({ ...character, equipment: [...character.equipment, newEquipment] });
    setEquipmentArea('');
  };

  // 装備更新ハンドラー
  const handleEquipmentUpdate = (updatedRow: Equipment) => {
    setCharacter({
      ...character,
      equipment: character.equipment.map((e) =>
        e.id === updatedRow.id ? updatedRow : e
      ),
    });
    return updatedRow;
  };

  // 装備削除ハンドラー
  const handleEquipmentDelete = (id: string) => {
    setCharacter({
      ...character,
      equipment: character.equipment.filter((e) => e.id !== id),
    });
  };

  // バッグ追加ハンドラー
  const handleBagAdd = () => {
    if (!bagName) return;
    const newBag: Bag = {
      id: `bag-${Date.now()}`,
      name: bagName,
      capacity: 10,
      items: [],
    };
    setCharacter({ ...character, bags: [...character.bags, newBag] });
    setBagName('');
  };

  // バッグ削除ハンドラー
  const handleBagDelete = (bagId: string) => {
    setCharacter({
      ...character,
      bags: character.bags.filter((b) => b.id !== bagId),
    });
  };

  // バッグ容量変更ハンドラー
  const handleBagCapacityChange = (bagId: string, capacity: number) => {
    setCharacter({
      ...character,
      bags: character.bags.map((b) =>
        b.id === bagId ? { ...b, capacity } : b
      ),
    });
  };

  // 状態異常トグルハンドラー
  const handleStatusAilmentToggle = (id: string) => {
    setCharacter({
      ...character,
      statusAilments: character.statusAilments.map((s) =>
        s.id === id ? { ...s, isChecked: !s.isChecked } : s
      ),
    });
  };

  // バックボーン追加ハンドラー
  const handleBackboneAdd = () => {
    const newBackbone: Backbone = {
      id: `bb-${Date.now()}`,
      title: '',
      content: '',
    };
    setCharacter({ ...character, backbones: [...character.backbones, newBackbone] });
  };

  // バックボーン更新ハンドラー
  const handleBackboneUpdate = (updatedRow: Backbone) => {
    setCharacter({
      ...character,
      backbones: character.backbones.map((b) =>
        b.id === updatedRow.id ? updatedRow : b
      ),
    });
    return updatedRow;
  };

  // バックボーン削除ハンドラー
  const handleBackboneDelete = (id: string) => {
    setCharacter({
      ...character,
      backbones: character.backbones.filter((b) => b.id !== id),
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
          onClick={() => handleEquipmentDelete(params.row.id)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  // バックボーンテーブルの列定義
  const backboneColumns: GridColDef[] = [
    { field: 'title', headerName: 'タイトル', width: 200, editable: true },
    { field: 'content', headerName: '内容', width: 400, editable: true },
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
                onChange={(e) => handleBagCapacityChange(bag.id, Number(e.target.value))}
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
                    setCharacter({ ...character, useStrangeField: e.target.checked })
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
                    setCharacter({ ...character, useDragonPlain: e.target.checked })
                  }
                />
              }
              label="竜の平原"
            />
          </Box>
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
