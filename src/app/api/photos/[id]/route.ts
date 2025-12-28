import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/API/Services/supabase/user';
import { getPhoto } from '@/lib/API/Database/photos/queries';
import { updatePhoto, deletePhoto } from '@/lib/API/Database/photos/mutations';
import { UpdatePhoto } from '@/lib/types/visionboards';

/**
 * GET /api/photos/[id]
 * Get a specific photo
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

    const photo = await getPhoto(params.id, user.id);

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ photo });
  } catch (error: any) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/photos/[id]
 * Update a photo
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
    const updates: UpdatePhoto = {};

    if (body.vision_board_id !== undefined) {
      updates.vision_board_id = body.vision_board_id;
    }
    if (body.crop_data !== undefined) {
      updates.crop_data = body.crop_data;
    }
    if (body.text_overlay !== undefined) {
      updates.text_overlay = body.text_overlay;
    }
    if (body.display_order !== undefined) {
      updates.display_order = body.display_order;
    }
    if (body.cropped_url !== undefined) {
      updates.cropped_url = body.cropped_url;
    }
    if (body.cropped_file_key !== undefined) {
      updates.cropped_file_key = body.cropped_file_key;
    }

    const photo = await updatePhoto(params.id, user.id, updates);

    return NextResponse.json({ photo });
  } catch (error: any) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update photo' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/photos/[id]
 * Delete a photo
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

    await deletePhoto(params.id, user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
