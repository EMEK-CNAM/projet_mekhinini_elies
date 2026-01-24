import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string | number;
    nom: string;
    prenom: string;
    email: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://devilmans.debirumans.fr:40014/api/utilisateur';

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/refresh`, { refreshToken });
  }

  /**
   * Décode le payload d'un JWT
   */
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  /**
   * Vérifie si un token est expiré
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }

  /**
   * Vérifie si le token expire bientôt (dans moins de 5 minutes)
   */
  shouldRefreshToken(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationDate = new Date(decoded.exp * 1000);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expirationDate < fiveMinutesFromNow;
  }
}
