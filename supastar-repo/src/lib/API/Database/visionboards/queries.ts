import { createClient } from "@/lib/API/Services/init/supabase";
import { VisionBoard, VisionBoardWithPhotos, VisionBoardWithDetails } from "@/lib/types/visionboards";

/**
 * Get all vision boards for the current user
 */
export async function getUserVisionBoards(userId: string): Promise<VisionBoard[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('vision_boards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as VisionBoard[];
}

/**
 * Get a single vision board by ID
 */
export async function getVisionBoard(boardId: string, userId: string): Promise<VisionBoard | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('vision_boards')
    .select('*')
    .eq('id', boardId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  
  return data as VisionBoard;
}

/**
 * Get vision board with all photos
 */
export async function getVisionBoardWithPhotos(
  boardId: string, 
  userId: string
): Promise<VisionBoardWithPhotos | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('vision_boards')
    .select(`
      *,
      photos (
        *
      )
    `)
    .eq('id', boardId)
    .eq('user_id', userId)
    .order('display_order', { foreignTable: 'photos', ascending: true })
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return data as VisionBoardWithPhotos;
}

/**
 * Get vision board with full details (photos, settings, crystals)
 */
export async function getVisionBoardWithDetails(
  boardId: string,
  userId: string
): Promise<VisionBoardWithDetails | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('vision_boards')
    .select(`
      *,
      photos (*),
      montage_settings (*),
      vision_board_crystals (
        crystal_id,
        crystals (*)
      )
    `)
    .eq('id', boardId)
    .eq('user_id', userId)
    .order('display_order', { foreignTable: 'photos', ascending: true })
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  // Flatten crystals from junction table
  const crystals = data.vision_board_crystals?.map((vbc: any) => vbc.crystals) || [];
  
  return {
    ...data,
    crystals,
  } as VisionBoardWithDetails;
}

/**
 * Count user's vision boards
 */
export async function countUserVisionBoards(userId: string): Promise<number> {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('vision_boards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count || 0;
}
