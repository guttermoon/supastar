import { createClient } from "@/lib/API/Services/init/supabase";
import { InsertPhoto, UpdatePhoto, Photo } from "@/lib/types/visionboards";
import { deleteFile } from "@/lib/API/Services/storage/index";

/**
 * Create a new photo record
 */
export async function createPhoto(data: InsertPhoto): Promise<Photo> {
  const supabase = createClient();
  
  const { data: photo, error } = await supabase
    .from('photos')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return photo as Photo;
}

/**
 * Update an existing photo
 */
export async function updatePhoto(
  photoId: string,
  userId: string,
  updates: UpdatePhoto
): Promise<Photo> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('photos')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', photoId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Photo;
}

/**
 * Delete a photo and its files from storage
 */
export async function deletePhoto(photoId: string, userId: string): Promise<void> {
  const supabase = createClient();
  
  // First get the photo to find file keys
  const { data: photo, error: fetchError } = await supabase
    .from('photos')
    .select('original_file_key, cropped_file_key')
    .eq('id', photoId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;

  // Delete from storage
  const filesToDelete = [photo.original_file_key];
  if (photo.cropped_file_key) {
    filesToDelete.push(photo.cropped_file_key);
  }
  
  try {
    await deleteFile(photo.original_file_key);
    if (photo.cropped_file_key) {
      await deleteFile(photo.cropped_file_key);
    }
  } catch (storageError) {
    console.error('Error deleting files from storage:', storageError);
    // Continue with database deletion even if storage fails
  }

  // Delete from database
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Attach photo to a vision board
 */
export async function attachPhotoToBoard(
  photoId: string,
  userId: string,
  boardId: string,
  displayOrder?: number
): Promise<Photo> {
  const updates: UpdatePhoto = {
    vision_board_id: boardId,
  };

  if (displayOrder !== undefined) {
    updates.display_order = displayOrder;
  }

  return updatePhoto(photoId, userId, updates);
}

/**
 * Detach photo from vision board (make it unassigned)
 */
export async function detachPhotoFromBoard(
  photoId: string,
  userId: string
): Promise<Photo> {
  return updatePhoto(photoId, userId, {
    vision_board_id: null,
  });
}

/**
 * Update photo crop data
 */
export async function updatePhotoCrop(
  photoId: string,
  userId: string,
  croppedUrl: string,
  croppedFileKey: string,
  cropData: any
): Promise<Photo> {
  return updatePhoto(photoId, userId, {
    cropped_url: croppedUrl,
    cropped_file_key: croppedFileKey,
    crop_data: cropData,
  });
}

/**
 * Update photo text overlay
 */
export async function updatePhotoText(
  photoId: string,
  userId: string,
  textOverlay: any
): Promise<Photo> {
  return updatePhoto(photoId, userId, {
    text_overlay: textOverlay,
  });
}

/**
 * Reorder photos in a board
 */
export async function reorderPhotos(
  photoIds: string[],
  userId: string
): Promise<void> {
  const supabase = createClient();
  
  // Update each photo's display_order
  const updates = photoIds.map((photoId, index) => ({
    id: photoId,
    user_id: userId,
    display_order: index,
    updated_at: new Date().toISOString(),
  }));

  for (const update of updates) {
    const { error } = await supabase
      .from('photos')
      .update({ 
        display_order: update.display_order,
        updated_at: update.updated_at,
      })
      .eq('id', update.id)
      .eq('user_id', userId);

    if (error) throw error;
  }
}

/**
 * Bulk delete photos
 */
export async function bulkDeletePhotos(
  photoIds: string[],
  userId: string
): Promise<void> {
  for (const photoId of photoIds) {
    await deletePhoto(photoId, userId);
  }
}
