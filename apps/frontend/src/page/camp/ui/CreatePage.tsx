import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Container,
  InputLabel,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
  AddFacilityForm,
  AddPersonalityForm,
  Facility,
  FacilityTable,
} from '@lostrpg/frontend/entities/facility';
import {
  AddItemForm,
  Item,
  ItemTable,
} from '@lostrpg/frontend/entities/item';

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
    setCamp({ ...camp, facilities: [...camp.facilities, item] });
    setEquipmentSelect('');
  };

  // 人材追加ハンドラー
  const handlePersonalityAdd = (item: Facility) => {
    setCamp({ ...camp, facilities: [...camp.facilities, item] });
    setPersonalitySelect('');
  };

  // アイテム追加ハンドラー
  const handleItemAdd = (item: Item) => {
    setCamp({ ...camp, items: [...camp.items, item] });
    setItemSelect('');
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

            <AddPersonalityForm
              personalitySelect={personalitySelect}
              onPersonalityAdd={handlePersonalityAdd}
            />
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

          <Box mb={2}>
            <AddItemForm itemSelect={itemSelect} onItemAdd={handleItemAdd} />
          </Box>

          <Box sx={{ height: 400, width: '100%' }}>
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
