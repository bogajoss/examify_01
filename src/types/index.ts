export interface User {
  uuid: string;
  name: string;
  roll: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}
