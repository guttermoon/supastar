import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/API/Services/supabase/user';
import { uploadPhoto } from '@/lib/API/Services/storage/index';
import { createPhoto } from '@/lib/API/Database/photos/mutations';
import { InsertPhoto } from '@/lib/types/visionboards';

/**
 * POST /api/photos/upload
 * Upload a photo to Supabase Storage and create database record
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const visionBoardId = formData.get('visionBoardId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const { url, key } = await uploadPhoto(user.id, file, 'original');

    // Create database record
    const photoData: InsertPhoto = {
      user_id: user.id,
      vision_board_id: visionBoardId || null,
      original_url: url,
      original_file_key: key,
      cropped_url: null,
      cropped_file_key: null,
      crop_data: null,
      text_overlay: null,
      display_order: 0,
    };

    const photo = await createPhoto(photoData);

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
