import { createClient } from "@/lib/API/Services/init/supabase";

const VISION_BOARD_BUCKET = 'vision-boards';
const PHOTOS_FOLDER = 'photos';
const VIDEOS_FOLDER = 'videos';
const MUSIC_FOLDER = 'music';

/**
 * Upload a photo to Supabase Storage
 */
export async function uploadPhoto(
  userId: string,
  file: File,
  folder: 'original' | 'cropped' = 'original'
): Promise<{ url: string; key: string }> {
  const supabase = createClient();
  
  // Generate unique file key
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${PHOTOS_FOLDER}/${folder}/${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(VISION_BOARD_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(VISION_BOARD_BUCKET)
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    key: fileName,
  };
}

/**
 * Upload cropped photo blob
 */
export async function uploadCroppedPhoto(
  userId: string,
  blob: Blob,
  originalFileName: string
): Promise<{ url: string; key: string }> {
  const supabase = createClient();
  
  const timestamp = Date.now();
  const fileExt = originalFileName.split('.').pop() || 'jpg';
  const fileName = `${userId}/${PHOTOS_FOLDER}/cropped/${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(VISION_BOARD_BUCKET)
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(VISION_BOARD_BUCKET)
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    key: fileName,
  };
}

/**
 * Upload video montage
 */
export async function uploadVideo(
  userId: string,
  videoBlob: Blob,
  boardId: string
): Promise<{ url: string; key: string }> {
  const supabase = createClient();
  
  const timestamp = Date.now();
  const fileName = `${userId}/${VIDEOS_FOLDER}/${boardId}_${timestamp}.mp4`;

  const { data, error } = await supabase.storage
    .from(VISION_BOARD_BUCKET)
    .upload(fileName, videoBlob, {
      contentType: 'video/mp4',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(VISION_BOARD_BUCKET)
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    key: fileName,
  };
}

/**
 * Upload music file
 */
export async function uploadMusic(
  userId: string,
  file: File
): Promise<{ url: string; key: string }> {
  const supabase = createClient();
  
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${MUSIC_FOLDER}/${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(VISION_BOARD_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(VISION_BOARD_BUCKET)
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    key: fileName,
  };
}

/**
 * Delete a file from storage
 */
export async function deleteFile(fileKey: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from(VISION_BOARD_BUCKET)
    .remove([fileKey]);

  if (error) throw error;
}

/**
 * Delete multiple files from storage
 */
export async function deleteFiles(fileKeys: string[]): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from(VISION_BOARD_BUCKET)
    .remove(fileKeys);

  if (error) throw error;
}

/**
 * Get signed URL for temporary access (if using private buckets)
 */
export async function getSignedUrl(
  fileKey: string,
  expiresIn: number = 3600
): Promise<string> {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from(VISION_BOARD_BUCKET)
    .createSignedUrl(fileKey, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}
