// Vision Board Types
export type VisionBoard = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  montage_video_url: string | null;
  montage_video_key: string | null;
  montage_generated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type InsertVisionBoard = Omit<VisionBoard, 'id' | 'created_at' | 'updated_at'>;
export type UpdateVisionBoard = Partial<Omit<VisionBoard, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Photo Types
export type CropData = {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom?: number;
};

export type TextOverlay = {
  text: string;
  fontSize: number;
  color: string;
  position: {
    x: number;
    y: number;
  };
  fontFamily?: string;
  fontWeight?: string;
};

export type Photo = {
  id: string;
  user_id: string;
  vision_board_id: string | null;
  original_url: string;
  original_file_key: string;
  cropped_url: string | null;
  cropped_file_key: string | null;
  crop_data: CropData | null;
  text_overlay: TextOverlay | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type InsertPhoto = Omit<Photo, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePhoto = Partial<Omit<Photo, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Montage Settings Types
export type MontageSettings = {
  id: string;
  vision_board_id: string;
  photo_duration: number;
  music_url: string | null;
  music_file_key: string | null;
  music_source: 'public' | 'local' | 'spotify' | null;
  timing_mode: 'fixed' | 'matchMusic';
  music_behavior: 'fadeOut' | 'loop';
  created_at: string;
  updated_at: string;
};

export type InsertMontageSettings = Omit<MontageSettings, 'id' | 'created_at' | 'updated_at'>;
export type UpdateMontageSettings = Partial<Omit<MontageSettings, 'id' | 'vision_board_id' | 'created_at' | 'updated_at'>>;

// Notification Schedule Types
export type NotificationSchedule = {
  id: string;
  user_id: string;
  vision_board_id: string | null;
  title: string;
  message: string | null;
  schedule_time: string; // HH:MM format
  days_of_week: string; // JSON array: "[0,1,2,3,4,5,6]"
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type InsertNotificationSchedule = Omit<NotificationSchedule, 'id' | 'created_at' | 'updated_at'>;
export type UpdateNotificationSchedule = Partial<Omit<NotificationSchedule, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Intention Types
export type Intention = {
  id: string;
  user_id: string;
  vision_board_id: string | null;
  intention: string;
  moon_phase: string | null;
  created_at: string;
  manifested_at: string | null;
};

export type InsertIntention = Omit<Intention, 'id' | 'created_at'>;
export type UpdateIntention = Partial<Omit<Intention, 'id' | 'user_id' | 'created_at'>>;

// Board Template Types
export type BoardTemplate = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  suggested_colors: string | null;
  suggested_crystals: string | null;
  affirmations: string | null;
  created_at: string;
};

// Healing Frequency Types
export type HealingFrequency = {
  id: string;
  title: string;
  frequency: string;
  url: string;
  file_key: string;
  duration: number | null;
  category: string | null;
  created_at: string;
};

// Moon Phase Types
export type MoonPhaseType = 
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export type MoonPhase = {
  id: string;
  phase: string;
  date: string;
  manifestation_type: string | null;
  ritual_suggestion: string | null;
};

// Crystal Types
export type Crystal = {
  id: string;
  name: string;
  color: string | null;
  energy: string | null;
  description: string | null;
  image_url: string | null;
};

export type VisionBoardCrystal = {
  id: string;
  vision_board_id: string;
  crystal_id: string;
  created_at: string;
};

// Vision Board with Relations
export type VisionBoardWithPhotos = VisionBoard & {
  photos: Photo[];
};

export type VisionBoardWithDetails = VisionBoard & {
  photos: Photo[];
  montage_settings?: MontageSettings;
  crystals?: Crystal[];
};
