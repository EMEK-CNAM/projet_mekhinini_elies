import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
    private readonly STORAGE_KEY_PREFIX = 'app:favorites:';
    private favoritesSubject = new BehaviorSubject<string[]>([]);
    public favorites$: Observable<string[]> = this.favoritesSubject.asObservable();
    private currentUser: string | null = null;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.initializeUser();
    }

    private initializeUser(): void {
        if (isPlatformBrowser(this.platformId)) {
            const username = localStorage.getItem('app:username');
            if (username) {
                this.setCurrentUser(username);
            }
        }
    }

    setCurrentUser(username: string): void {
        this.currentUser = username;
        this.loadFromStorage();
    }

    clearCurrentUser(): void {
        this.currentUser = null;
        this.favoritesSubject.next([]);
    }

    private getStorageKey(): string {
        return this.STORAGE_KEY_PREFIX + (this.currentUser || 'guest');
    }

    private loadFromStorage(): void {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem(this.getStorageKey());
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    this.favoritesSubject.next(Array.isArray(parsed) ? parsed : []);
                } catch {
                    this.favoritesSubject.next([]);
                }
            } else {
                this.favoritesSubject.next([]);
            }
        }
    }

    private saveToStorage(favorites: string[]): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(favorites));
        }
    }

    getFavorites(): string[] {
        return this.favoritesSubject.value;
    }

    isFavorite(id?: string | number): boolean {
        if (!id) return false;
        const idStr = String(id);
        return this.favoritesSubject.value.includes(idStr);
    }

    addFavorite(id?: string | number): void {
        if (!id) return;
        const idStr = String(id);
        const current = this.favoritesSubject.value;
        if (!current.includes(idStr)) {
            const updated = [...current, idStr];
            this.favoritesSubject.next(updated);
            this.saveToStorage(updated);
        }
    }

    removeFavorite(id?: string | number): void {
        if (!id) return;
        const idStr = String(id);
        const current = this.favoritesSubject.value;
        const updated = current.filter(fav => fav !== idStr);
        this.favoritesSubject.next(updated);
        this.saveToStorage(updated);
    }

    toggleFavorite(id?: string | number): void {
        if (!id) return;
        if (this.isFavorite(id)) {
            this.removeFavorite(id);
        } else {
            this.addFavorite(id);
        }
    }

    getCount(): number {
        return this.favoritesSubject.value.length;
    }
}
