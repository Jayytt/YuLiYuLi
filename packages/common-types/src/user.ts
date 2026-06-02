export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  gender: number;
  birthday: string | null;
  level: number;
  coin: number;
  following: number;
  follower: number;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  nickname?: string;
  avatar?: string;
  bio?: string;
  gender?: number;
  birthday?: string;
}
