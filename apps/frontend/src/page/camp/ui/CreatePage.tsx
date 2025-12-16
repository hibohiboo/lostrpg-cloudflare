import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Container,
  FormControl,
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
import {
  AddFacilityForm,
  Facility,
  FacilityTable,
} from '@lostrpg/frontend/entities/facility';

interface Item {
  id: string;
  name: string;
  number: number;
  weight: number;
}

interface CampFormData {
  playerName: string;
  name: string;
  imageUrl: string;
  facilities: Facility[];
  items: Item[];
  unusedCampPoint: number;
  totalCampPoint: number;
  summary: string;
  freeWriting: string;
}

// ダミーデータ - 人材リスト
const PERSONALITY_LIST = [
  { name: '料理人', type: '人材', specialty: '料理', effect: '食事効果+2' },
  { name: '鍛冶屋', type: '人材', specialty: '製作', effect: '武器強化+1' },
  { name: '医者', type: '人材', specialty: '治療', effect: '回復効果+2' },
  { name: '商人', type: '人材', specialty: '交易', effect: '売却価格+10%' },
];

// ダミーデータ - アイテムリスト
const ITEM_LIST = [
  { name: '回復薬', weight: 0.1 },
  { name: '魔法の石', weight: 0.5 },
  { name: '古文書', weight: 1.0 },
  { name: '保存食', weight: 0.3 },
  { name: '宝の地図', weight: 0.1 },
];

const CreatePage: React.FC = () => {
  const [camp, setCamp] = useState<CampFormData>({
    playerName: '',
    name: '',
    imageUrl: '',
    facilities: [],
    items: [],
    unusedCampPoint: 0,
    totalCampPoint: 0,
    summary: '',
    freeWriting: '',
  });

  const [isValidError, setIsValidError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [equipmentSelect, setEquipmentSelect] = useState('');
  const [personalitySelect, setPersonalitySelect] = useState('');
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

  // 設備追加ハンドラー
  const handleEquipmentAdd = (item: Facility) => {
    setEquipmentSelect(item.name);
    setCamp({ ...camp, facilities: [...camp.facilities, item] });
    setEquipmentSelect('');
  };

  // 人材追加ハンドラー
  const handlePersonalityAdd = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setPersonalitySelect(value);
    const item = PERSONALITY_LIST.find((i) => i.name === value);
    if (item) {
      const newFacility: Facility = {
        id: `personality-${Date.now()}`,
        name: item.name,
        type: item.type,
        specialty: item.specialty,
        level: 1,
        effect: item.effect,
      };
      setCamp({ ...camp, facilities: [...camp.facilities, newFacility] });
      setPersonalitySelect('');
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
      };
      setCamp({ ...camp, items: [...camp.items, newItem] });
      setItemSelect('');
    }
  };

  // 施設削除ハンドラー
  const handleFacilityDelete = (id: string) => {
    setCamp({
      ...camp,
      facilities: camp.facilities.filter((f) => f.id !== id),
    });
  };

  // アイテム削除ハンドラー
  const handleItemDelete = (id: string) => {
    setCamp({
      ...camp,
      items: camp.items.filter((i) => i.id !== id),
    });
  };

  // 施設更新ハンドラー
  const handleFacilityUpdate = (updatedRow: Facility) => {
    setCamp({
      ...camp,
      facilities: camp.facilities.map((f) =>
        f.id === updatedRow.id ? updatedRow : f,
      ),
    });
    return updatedRow;
  };

  // アイテム更新ハンドラー
  const handleItemUpdate = (updatedRow: Item) => {
    setCamp({
      ...camp,
      items: camp.items.map((i) => (i.id === updatedRow.id ? updatedRow : i)),
    });
    return updatedRow;
  };

  // 保存ハンドラー
  const handleSave = () => {
    if (!camp.name) {
      setIsValidError(true);
      window.scrollTo(0, 0);
      return;
    }
    // 実際にはAPI呼び出しを行う
    console.log('Saving camp:', camp);
    alert('キャンプを保存しました（ダミー動作）');
  };

  // 削除ハンドラー
  const handleDelete = () => {
    if (window.confirm('本当に削除しますか？')) {
      // 実際にはAPI呼び出しを行う
      console.log('Deleting camp');
      alert('キャンプを削除しました（ダミー動作）');
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

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          キャンプ作成
        </Typography>

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
            helperText={
              !camp.name && isValidError ? 'キャンプ名は必須です' : ''
            }
            value={camp.name}
            onChange={(e) => setCamp({ ...camp, name: e.target.value })}
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
            sx={{ maxWidth: 480, height: 320, overflow: 'hidden' }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="プレビュー"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>人材追加</InputLabel>
              <Select
                value={personalitySelect}
                label="人材追加"
                onChange={handlePersonalityAdd}
              >
                <MenuItem value="">未選択</MenuItem>
                {PERSONALITY_LIST.map((item) => (
                  <MenuItem value={item.name} key={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ height: 400, width: '100%' }}>
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
            保管庫
          </Typography>

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
              rows={camp.items}
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
          <MuiLink href="/camp/list" underline="hover">
            戻る
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default CreatePage;
