import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../services/pollution.service';
import { FavoritesService } from '../services/favorites.service';
import { Pollution } from '../models/pollution';
import { RouterModule, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './favorites.html',
    styleUrls: ['./favorites.css']
})
export class Favorites implements OnInit {
    favoritePollutions: Pollution[] = [];
    loading = false;
    error: string | null = null;

    constructor(
        private pollutionService: PollutionService,
        private favoritesService: FavoritesService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadFavorites();
    }

    loadFavorites() {
        this.loading = true;
        const favoriteIds = this.favoritesService.getFavorites();

        if (favoriteIds.length === 0) {
            this.favoritePollutions = [];
            this.loading = false;
            return;
        }

        const requests = favoriteIds.map(id =>
            this.pollutionService.getById(id).pipe(
                catchError(() => of(null))
            )
        );

        forkJoin(requests).subscribe({
            next: (pollutions) => {
                this.favoritePollutions = pollutions.filter(p => p !== null) as Pollution[];
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement des favoris';
                this.loading = false;
            }
        });
    }

    removeFavorite(id?: string | number, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.favoritesService.removeFavorite(id);
        this.loadFavorites();
    }

    goToDetail(id?: string | number) {
        if (id) {
            this.router.navigate(['/pollutions', id]);
        }
    }

    backToList() {
        this.router.navigate(['/pollutions']);
    }
}
