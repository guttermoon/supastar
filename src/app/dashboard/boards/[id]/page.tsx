'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Upload, Trash2, Plus, Save, Play, Image as ImageIcon } from 'lucide-react';
import useSWR, { mutate } from 'swr';

type Photo = {
  id: string;
  original_url: string;
  cropped_url: string | null;
  text_overlay: any;
  display_order: number;
};

type VisionBoard = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  montage_video_url: string | null;
  photos: Photo[];
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function BoardEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [addPhotosDialogOpen, setAddPhotosDialogOpen] = useState(false);

  const { data: boardData, error, isLoading } = useSWR<{ board: VisionBoard }>(
    `/api/boards/${params.id}`,
    fetcher
  );
  const board = boardData?.board;

  const { data: unassignedData } = useSWR<{ photos: Photo[] }>(
    addPhotosDialogOpen ? '/api/photos?unassigned=true' : null,
    fetcher
  );
  const unassignedPhotos = unassignedData?.photos || [];

  // Initialize form when board loads
  if (board && !editing && !title) {
    setTitle(board.title);
    setDescription(board.description || '');
  }

  const handleUpdateBoard = async () => {
    try {
      const response = await fetch(`/api/boards/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update board');
      }

      mutate(`/api/boards/${params.id}`);
      setEditing(false);
    } catch (error: any) {
      alert(error.message || 'Failed to update board');
    }
  };

  const handleUploadPhotos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('visionBoardId', params.id);

        const response = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }
      }

      mutate(`/api/boards/${params.id}`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      alert(error.message || 'Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleAddExistingPhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vision_board_id: params.id,
          display_order: board?.photos.length || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add photo');
      }

      mutate(`/api/boards/${params.id}`);
      mutate('/api/photos?unassigned=true');
    } catch (error: any) {
      alert(error.message || 'Failed to add photo');
    }
  };

  const handleRemovePhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vision_board_id: null }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove photo');
      }

      mutate(`/api/boards/${params.id}`);
      mutate('/api/photos?unassigned=true');
    } catch (error: any) {
      alert(error.message || 'Failed to remove photo');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const confirmed = confirm('Delete this photo permanently?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      mutate(`/api/boards/${params.id}`);
    } catch (error: any) {
      alert(error.message || 'Failed to delete photo');
    }
  };

  const handleDragStart = (photoId: string) => {
    setDraggedPhotoId(photoId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetPhotoId: string) => {
    if (!draggedPhotoId || !board) return;
    
    const photos = [...board.photos];
    const draggedIndex = photos.findIndex(p => p.id === draggedPhotoId);
    const targetIndex = photos.findIndex(p => p.id === targetPhotoId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder array
    const [draggedPhoto] = photos.splice(draggedIndex, 1);
    photos.splice(targetIndex, 0, draggedPhoto);

    // Update display_order for all photos
    try {
      for (let i = 0; i < photos.length; i++) {
        await fetch(`/api/photos/${photos[i].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: i }),
        });
      }

      mutate(`/api/boards/${params.id}`);
    } catch (error: any) {
      alert(error.message || 'Failed to reorder photos');
    }

    setDraggedPhotoId(null);
  };

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!board) {
    return (
      <div>
        <h1>Board not found</h1>
        <Button onClick={() => router.push('/dashboard/boards')}>
          Back to Boards
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Button onClick={() => router.push('/dashboard/boards')} variant="outline">
          <ArrowLeft />
          Back to Boards
        </Button>
      </div>

      <Card>
        <CardHeader>
          {editing ? (
            <div>
              <div>
                <Label htmlFor="title">Board Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Button onClick={() => setEditing(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleUpdateBoard}>
                  <Save />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <CardTitle>{board.title}</CardTitle>
              {board.description && <p>{board.description}</p>}
              <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                Edit Details
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>

      <div>
        <div>
          <h2>Photos ({board.photos.length})</h2>
          <p>Drag photos to reorder them</p>
        </div>

        <div>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload />
            {uploading ? 'Uploading...' : 'Upload New'}
          </Button>

          <Dialog open={addPhotosDialogOpen} onOpenChange={setAddPhotosDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus />
                Add Existing Photos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Existing Photos</DialogTitle>
                <DialogDescription>
                  Select photos from your library to add to this board
                </DialogDescription>
              </DialogHeader>
              
              {unassignedPhotos.length === 0 ? (
                <p>No unassigned photos available</p>
              ) : (
                <div>
                  {unassignedPhotos.map((photo) => (
                    <div key={photo.id}>
                      <img src={photo.original_url} alt="Photo" />
                      <Button
                        size="sm"
                        onClick={() => {
                          handleAddExistingPhoto(photo.id);
                          setAddPhotosDialogOpen(false);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {board.montage_video_url && (
            <Button variant="outline">
              <Play />
              Play Montage
            </Button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleUploadPhotos}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {board.photos.length === 0 ? (
        <Card>
          <CardContent>
            <div>
              <ImageIcon />
              <h3>No photos yet</h3>
              <p>Add photos to start building your vision board</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload />
                Upload Photos
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          {board.photos.map((photo) => (
            <Card
              key={photo.id}
              draggable
              onDragStart={() => handleDragStart(photo.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(photo.id)}
            >
              <div>
                <img
                  src={photo.cropped_url || photo.original_url}
                  alt="Board photo"
                />
                
                {photo.text_overlay && (
                  <div>
                    <p>{photo.text_overlay.text}</p>
                  </div>
                )}
              </div>

              <div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemovePhoto(photo.id)}
                >
                  Remove from Board
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePhoto(photo.id)}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
