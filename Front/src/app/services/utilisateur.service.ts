import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UtilisateurService {
    private apiUrl = `https://templateweb-latest-nzzn.onrender.com`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(`${this.apiUrl}/api/utilisateur`);
    }

    getById(id: string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(`${this.apiUrl}/api/utilisateur/${id}`);
    }

    create(utilisateur: Utilisateur): Observable<Utilisateur> {
        return this.http.post<Utilisateur>(`${this.apiUrl}/api/utilisateur`, utilisateur);
    }

    update(id: string, utilisateur: Utilisateur): Observable<Utilisateur> {
        return this.http.put<Utilisateur>(`${this.apiUrl}/api/utilisateur/${id}`, utilisateur);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/api/utilisateur/${id}`);
    }
}
