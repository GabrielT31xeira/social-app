export interface LoginPayload {
  char_name: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  char_name: string;
  password: string;
  password_confirmation: string;
  avatar: File | null;
}

export interface User {
  id: string;
  name: string;
  char_name: string;
  email: string;
  avatar_url?: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeResponseData {
  id: string;
  name: string;
  email: string;
  char_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  access_token: string;
  user: User;
}
