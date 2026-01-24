import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = `http://devilmans.debirumans.fr:40014`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/utilisateur/login`, credentials);
  }

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/api/utilisateur`);
  }

  getById(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/api/utilisateur/profile/${id}`);
  }

  create(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/api/utilisateur/register`, utilisateur);
  }

  update(id: string, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/api/utilisateur/${id}`, utilisateur);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/utilisateur/${id}`);
  }
}
