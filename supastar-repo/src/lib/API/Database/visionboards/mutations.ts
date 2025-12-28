import { createClient } from "@/lib/API/Services/init/supabase";
import { InsertVisionBoard, UpdateVisionBoard, VisionBoard } from "@/lib/types/visionboards";

/**
 * Create a new vision board
 */
export async function createVisionBoard(
  data: InsertVisionBoard
): Promise<VisionBoard> {
  const supabase = createClient();
  
  const { data: board, error } = await supabase
    .from('vision_boards')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return board as VisionBoard;
}

/**
 * Update an existing vision board
 */
export async function updateVisionBoard(
  boardId: string,
  userId: string,
  updates: UpdateVisionBoard
): Promise<VisionBoard> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('vision_boards')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', boardId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as VisionBoard;
}

/**
 * Delete a vision board
 */
export async function deleteVisionBoard(
  boardId: string,
  userId: string
): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('vision_boards')
    .delete()
    .eq('id', boardId)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Update vision board cover image
 */
export async function updateVisionBoardCover(
  boardId: string,
  userId: string,
  coverImageUrl: string
): Promise<VisionBoard> {
  return updateVisionBoard(boardId, userId, { cover_image_url: coverImageUrl });
}

/**
 * Update vision board montage video
 */
export async function updateVisionBoardMontage(
  boardId: string,
  userId: string,
  videoUrl: string,
  videoKey: string
): Promise<VisionBoard> {
  return updateVisionBoard(boardId, userId, {
    montage_video_url: videoUrl,
    montage_video_key: videoKey,
    montage_generated_at: new Date().toISOString(),
  });
}

/**
 * Attach crystals to vision board
 */
export async function attachCrystalsToBoard(
  boardId: string,
  crystalIds: string[]
): Promise<void> {
  const supabase = createClient();
  
  // First, remove existing crystals
  await supabase
    .from('vision_board_crystals')
    .delete()
    .eq('vision_board_id', boardId);

  // Then add new crystals
  if (crystalIds.length > 0) {
    const records = crystalIds.map(crystalId => ({
      vision_board_id: boardId,
      crystal_id: crystalId,
    }));

    const { error } = await supabase
      .from('vision_board_crystals')
      .insert(records);

    if (error) throw error;
  }
}
