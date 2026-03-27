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
}

export interface User {
  id: string;
  name: string;
  char_name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  access_token: string;
  user: User;
}

