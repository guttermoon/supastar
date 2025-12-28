import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/API/Services/supabase/user';
import { getUserPhotos, getUnassignedPhotos } from '@/lib/API/Database/photos/queries';

/**
 * GET /api/photos
 * Get all photos for the current user
 * Query params:
 *   - unassigned: true/false (filter for photos not in any board)
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

    const { searchParams } = new URL(request.url);
    const unassignedOnly = searchParams.get('unassigned') === 'true';

    const photos = unassignedOnly
      ? await getUnassignedPhotos(user.id)
      : await getUserPhotos(user.id);

    return NextResponse.json({ photos });
  } catch (error: any) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
