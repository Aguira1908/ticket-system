export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: AdminUser;
}
