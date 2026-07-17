/**
 * ARES AI Platform — Authentication DTOs
 */

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role?: string;
  phoneNumber?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface GoogleLoginDTO {
  idToken: string;
}

export interface OTPLoginDTO {
  phoneNumber: string;
  otp: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface TokenResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
