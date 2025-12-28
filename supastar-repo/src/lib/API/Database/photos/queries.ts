import { createClient } from "@/lib/API/Services/init/supabase";
import { Photo } from "@/lib/types/visionboards";

/**
 * Get all photos for the current user
 */
export async function getUserPhotos(userId: string): Promise<Photo[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Photo[];
}

/**
 * Get photos for a specific vision board
 */
export async function getBoardPhotos(boardId: string, userId: string): Promise<Photo[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('vision_board_id', boardId)
    .eq('user_id', userId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Photo[];
}

/**
 * Get unassigned photos (not attached to any board)
 */
export async function getUnassignedPhotos(userId: string): Promise<Photo[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('user_id', userId)
    .is('vision_board_id', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Photo[];
}

/**
 * Get a single photo by ID
 */
export async function getPhoto(photoId: string, userId: string): Promise<Photo | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('id', photoId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return data as Photo;
}

/**
 * Count user's total photos
 */
export async function countUserPhotos(userId: string): Promise<number> {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count || 0;
}

/**
 * Count photos in a specific board
 */
export async function countBoardPhotos(boardId: string, userId: string): Promise<number> {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('vision_board_id', boardId)
    .eq('user_id', userId);

  if (error) throw error;
  return count || 0;
}
