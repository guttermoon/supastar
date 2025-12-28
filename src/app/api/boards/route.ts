import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/API/Services/supabase/user';
import {
  getUserVisionBoards,
  getVisionBoard,
} from '@/lib/API/Database/visionboards/queries';
import {
  createVisionBoard,
  updateVisionBoard,
  deleteVisionBoard,
} from '@/lib/API/Database/visionboards/mutations';
import { InsertVisionBoard, UpdateVisionBoard } from '@/lib/types/visionboards';

/**
 * GET /api/boards
 * Get all vision boards for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const boards = await getUserVisionBoards(user.id);

    return NextResponse.json({ boards });
  } catch (error: any) {
    console.error('Error fetching vision boards:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch vision boards' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/boards
 * Create a new vision board
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const boardData: InsertVisionBoard = {
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      cover_image_url: null,
      montage_video_url: null,
      montage_video_key: null,
      montage_generated_at: null,
    };

    const board = await createVisionBoard(boardData);

    return NextResponse.json({ board }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vision board:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create vision board' },
      { status: 500 }
    );
  }
}
