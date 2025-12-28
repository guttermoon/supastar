import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/API/Services/supabase/user';
import {
  getVisionBoard,
  getVisionBoardWithPhotos,
} from '@/lib/API/Database/visionboards/queries';
import {
  updateVisionBoard,
  deleteVisionBoard,
} from '@/lib/API/Database/visionboards/mutations';
import { UpdateVisionBoard } from '@/lib/types/visionboards';

/**
 * GET /api/boards/[id]
 * Get a specific vision board with photos
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const board = await getVisionBoardWithPhotos(params.id, user.id);

    if (!board) {
      return NextResponse.json(
        { error: 'Vision board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ board });
  } catch (error: any) {
    console.error('Error fetching vision board:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch vision board' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/boards/[id]
 * Update a vision board
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updates: UpdateVisionBoard = {};

    if (body.title !== undefined) {
      updates.title = body.title.trim();
    }
    if (body.description !== undefined) {
      updates.description = body.description?.trim() || null;
    }
    if (body.cover_image_url !== undefined) {
      updates.cover_image_url = body.cover_image_url;
    }

    const board = await updateVisionBoard(params.id, user.id, updates);

    return NextResponse.json({ board });
  } catch (error: any) {
    console.error('Error updating vision board:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update vision board' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/boards/[id]
 * Delete a vision board
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await deleteVisionBoard(params.id, user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting vision board:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete vision board' },
      { status: 500 }
    );
  }
}
