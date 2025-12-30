import {
  Box,
  Button,
  InputLabel,
  Typography,
} from '@mui/material';
import React from 'react';

type ImageUploadFieldProps = {
  /** 新規選択された画像のプレビューURL */
  previewUrl: string;
  /** 既存の画像URL */
  currentImageUrl?: string;
  /** 画像変更ハンドラ */
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** コンテナの高さ（デフォルト: 320） */
  containerHeight?: number | string;
  /** 画像のスタイル（オプション） */
  imageStyle?: React.CSSProperties;
  /** ラベルテキスト（デフォルト: "画像"） */
  label?: string;
};

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  previewUrl,
  currentImageUrl,
  onImageChange,
  containerHeight = 320,
  imageStyle,
  label = '画像',
}) => {
  const defaultImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  return (
    <Box my={2}>
      <InputLabel>{label}</InputLabel>
      <Box
        border={1}
        borderColor="grey.300"
        borderRadius={1}
        p={2}
        mt={1}
        sx={{
          maxWidth: 480,
          height: containerHeight,
          overflow: 'hidden',
        }}
      >
        {previewUrl || currentImageUrl ? (
          <img
            src={previewUrl || currentImageUrl}
            alt="プレビュー"
            style={imageStyle || defaultImageStyle}
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
          onChange={onImageChange}
        />
      </Button>
    </Box>
  );
};
