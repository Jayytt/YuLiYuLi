export interface Video {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  duration: number;
  viewCount: number;
  danmakuCount: number;
  likeCount: number;
  coinCount: number;
  favoriteCount: number;
  shareCount: number;
  categoryId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  tags: string[];
  createdAt: string;
}

export interface VideoUploadRequest {
  title: string;
  description: string;
  categoryId: number;
  tags: string[];
  cover: File;
  video: File;
}

export interface Category {
  id: number;
  name: string;
  parentId: number;
  icon: string;
  order: number;
}
