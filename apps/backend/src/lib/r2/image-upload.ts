import { HTTPException } from 'hono/http-exception';
import type { R2Bucket } from '@cloudflare/workers-types';

// 画像ファイルのバリデーション
export function validateImageFile(imageFile: File | null): File {
  if (!imageFile) {
    throw new HTTPException(400, { message: 'No image file provided' });
  }

  // ファイルサイズチェック (5MB制限)
  const maxSize = 5 * 1024 * 1024;
  if (imageFile.size > maxSize) {
    throw new HTTPException(400, { message: 'File size exceeds 5MB limit' });
  }

  // ファイルタイプチェック
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(imageFile.type)) {
    throw new HTTPException(400, {
      message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed',
    });
  }

  return imageFile;
}

// R2へ画像をアップロード
export async function uploadImageToR2(
  bucket: R2Bucket,
  resourceType: 'camps' | 'characters' | 'bosses' | 'scenarios',
  id: string,
  imageFile: File,
): Promise<string> {
  const ext = imageFile.type.split('/')[1];
  const fileName = `${resourceType}/${id}.${ext}`;

  const buffer = await imageFile.arrayBuffer();
  await bucket.put(fileName, buffer, {
    httpMetadata: {
      contentType: imageFile.type,
    },
  });

  return `${process.env.BUCKET_PUBLIC_URL}/${fileName}`;
}
