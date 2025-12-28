'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, Trash2, Moon, Bell, Layout, Play, Edit } from 'lucide-react';
import useSWR, { mutate } from 'swr';

type VisionBoard = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  montage_video_url: string | null;
  created_at: string;
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function VisionBoardsPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR<{ boards: VisionBoard[] }>('/api/boards', fetcher);
  const boards = data?.boards || [];

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create vision board');
      }

      const result = await response.json();
      
      mutate('/api/boards');
      setDialogOpen(false);
      setTitle('');
      setDescription('');
      
      router.push(`/dashboard/boards/${result.board.id}`);
    } catch (error: any) {
      alert(error.message || 'Failed to create vision board');
    }
  };

  const handleDelete = async (boardId: string) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete vision board');
      }

      mutate('/api/boards');
      setDeleteConfirmId(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete vision board');
    }
  };

  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    setVideoPlayerOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <div>
          <h1>My Vision Boards</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <div>
            <span>✨</span>
          </div>
          <div>
            <span>✨</span>
          </div>
          <div>
            <span>✦ MANIFEST YOUR DREAMS ✦</span>
            <span>✦ ALIGN WITH LUNAR ENERGY ✦</span>
            <span>✦ CREATE YOUR REALITY ✦</span>
            <span>✦ MANIFEST YOUR DREAMS ✦</span>
            <span>✦ ALIGN WITH LUNAR ENERGY ✦</span>
            <span>✦ CREATE YOUR REALITY ✦</span>
          </div>
        </div>
      </div>

      <div>
        <div>
          <Card onClick={() => router.push('/dashboard/photos')}>
            <CardContent>
              <Plus />
              <p>Upload Photos</p>
              <p>Add images to your library</p>
            </CardContent>
          </Card>
          
          <Card onClick={() => router.push('/dashboard/intentions')}>
            <CardContent>
              <Moon />
              <p>Set Intentions</p>
              <p>Track your manifestations</p>
            </CardContent>
          </Card>
          
          <Card onClick={() => router.push('/dashboard/notifications')}>
            <CardContent>
              <Bell />
              <p>Schedule Reminders</p>
              <p>Daily practice notifications</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <div>
            <h1>My Vision Boards</h1>
            <p>Create and manage your manifestation boards</p>
          </div>
          
          <div>
            <Button onClick={() => router.push('/dashboard/templates')} variant="outline">
              <Layout />
              Browse Templates
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  New Board
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Vision Board</DialogTitle>
                  <DialogDescription>
                    Give your vision board a meaningful name and description
                  </DialogDescription>
                </DialogHeader>
                
                <div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="My 2024 Goals"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what you want to manifest..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>
                    Create Board
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {boards.length === 0 ? (
          <Card>
            <CardContent>
              <div>
                <div>
                  <Layout />
                </div>
                <h3>No vision boards yet</h3>
                <p>Create your first vision board to start manifesting your dreams</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus />
                  Create Your First Board
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            {boards.map((board) => (
              <Card key={board.id}>
                <div>
                  {board.cover_image_url ? (
                    <img
                      src={board.cover_image_url}
                      alt={board.title}
                    />
                  ) : (
                    <div>
                      <Layout />
                    </div>
                  )}
                  
                  {board.montage_video_url && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVideo(board.montage_video_url!);
                      }}
                    >
                      <Play />
                      Watch Video
                    </Button>
                  )}
                </div>

                <CardHeader>
                  <CardTitle>{board.title}</CardTitle>
                  {board.description && (
                    <CardDescription>{board.description}</CardDescription>
                  )}
                </CardHeader>

                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/boards/${board.id}`)}
                  >
                    <Edit />
                    Edit Board
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirmId(board.id)}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {deleteConfirmId && (
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Vision Board</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this vision board? This action cannot be undone.
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

      {videoPlayerOpen && selectedVideoUrl && (
        <Dialog open={videoPlayerOpen} onOpenChange={setVideoPlayerOpen}>
          <DialogContent>
            <video controls autoPlay>
              <source src={selectedVideoUrl} type="video/mp4" />
            </video>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
