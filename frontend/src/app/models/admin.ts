export interface Admin {
  id?: string;
  username: string;
  email: string;
  role: 'admin' | 'super-admin';
}

export interface AdminAuthResponse {
  status: string;
  token: string;
  data: {
    admin: Admin;
  };
} 