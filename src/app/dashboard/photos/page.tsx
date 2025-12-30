'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Upload, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import useSWR, { mutate } from 'swr';

type Photo = {
  id: string;
  original_url: string;
  cropped_url: string | null;
  vision_board_id: string | null;
  created_at: string;
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PhotoLibraryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [filterUnassigned, setFilterUnassigned] = useState(false);

  const { data, error, isLoading } = useSWR<{ photos: Photo[] }>(
    `/api/photos${filterUnassigned ? '?unassigned=true' : ''}`,
    fetcher
  );
  const photos = data?.photos || [];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }
      }

      mutate('/api/photos');
      mutate('/api/photos?unassigned=true');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      alert(error.message || 'Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      mutate('/api/photos');
      mutate('/api/photos?unassigned=true');
      setDeleteConfirmId(null);
      setSelectedPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(photoId);
        return newSet;
      });
    } catch (error: any) {
      alert(error.message || 'Failed to delete photo');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPhotos.size === 0) return;

    const confirmed = confirm(`Delete ${selectedPhotos.size} selected photos?`);
    if (!confirmed) return;

    try {
      const photoIds = Array.from(selectedPhotos);
      for (const photoId of photoIds) {
        await fetch(`/api/photos/${photoId}`, {
          method: 'DELETE',
        });
      }

      mutate('/api/photos');
      mutate('/api/photos?unassigned=true');
      setSelectedPhotos(new Set());
    } catch (error: any) {
      alert(error.message || 'Failed to delete photos');
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedPhotos(new Set(photos.map(p => p.id)));
  };

  const deselectAll = () => {
    setSelectedPhotos(new Set());
  };

  if (isLoading) {
    return (
      <div>
        <h1>Photo Library</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <h1>Photo Library</h1>
          <p>Upload and manage your photos</p>
        </div>

        <div>
          <Button onClick={() => setFilterUnassigned(!filterUnassigned)} variant="outline">
            {filterUnassigned ? 'Show All Photos' : 'Show Unassigned Only'}
          </Button>

          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload />
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {selectedPhotos.size > 0 && (
        <div>
          <p>{selectedPhotos.size} photos selected</p>
          <div>
            <Button onClick={selectAll} variant="outline" size="sm">
              Select All
            </Button>
            <Button onClick={deselectAll} variant="outline" size="sm">
              Deselect All
            </Button>
            <Button onClick={handleBulkDelete} variant="destructive" size="sm">
              <Trash2 />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <Card>
          <CardContent>
            <div>
              <ImageIcon />
              <h3>No photos yet</h3>
              <p>Upload your first photo to get started</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload />
                Upload Photos
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          {photos.map((photo) => (
            <Card
              key={photo.id}
              onClick={() => togglePhotoSelection(photo.id)}
            >
              <div>
                <img
                  src={photo.cropped_url || photo.original_url}
                  alt="Photo"
                />

                {selectedPhotos.has(photo.id) && (
                  <div>
                    <div>✓</div>
                  </div>
                )}

                {photo.vision_board_id && (
                  <div>
                    <span>In Board</span>
                  </div>
                )}
              </div>

              <CardFooter>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPhoto(photo);
                  }}
                >
                  Preview
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(photo.id);
                  }}
                >
                  <Trash2 />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {deleteConfirmId && (
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Photo</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this photo? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirmId)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {previewPhoto && (
        <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Photo Preview</DialogTitle>
            </DialogHeader>
            <div>
              <img
                src={previewPhoto.cropped_url || previewPhoto.original_url}
                alt="Preview"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setPreviewPhoto(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
