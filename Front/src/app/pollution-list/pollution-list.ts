import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollutionService } from '../services/pollution.service';
import { Pollution } from '../models/pollution';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  LoadPollutions,
  DeletePollution,
  SearchPollutions,
  FilterByType,
} from '../store/pollution.state';
import { PollutionState } from '../store/pollution.state';
import { LoadFavorites, ToggleFavorite, FavoritesState } from '../store/favorites.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pollution-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './pollution-list.html',
  styleUrls: ['./pollution-list.css'],
})
export class PollutionList implements OnInit {
  pollutions$: Observable<Pollution[]>;
  loading$: Observable<boolean>;
  favoritesCount$: Observable<number>;
  searchTerm = '';
  filterType = 'all';
  error: string | null = null;

  pollutionTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'plastique', label: 'Plastique' },
    { value: 'chimique', label: 'Chimique' },
    { value: 'sonore', label: 'Sonore' },
    { value: 'visuelle', label: 'Visuelle' },
    { value: 'autre', label: 'Autre' },
  ];

  constructor(
    private svc: PollutionService,
    private router: Router,
    private store: Store,
  ) {
    this.pollutions$ = this.store.select(PollutionState.pollutions);
    this.loading$ = this.store.select(PollutionState.loading);
    this.favoritesCount$ = this.store.select(FavoritesState.count);
  }

  ngOnInit() {
    this.store.dispatch(new LoadPollutions());
    this.store.dispatch(new LoadFavorites());
  }

  onSearch() {
    this.store.dispatch(new SearchPollutions(this.searchTerm));
  }

  onFilterChange() {
    this.store.dispatch(new FilterByType(this.filterType));
  }

  delete(id?: string | number) {
    if (!id) return;
    if (!confirm('Supprimer ?')) return;
    this.store.dispatch(new DeletePollution(id));
  }

  goToDetail(id: string | number | undefined) {
    if (id) {
      this.router.navigate(['/pollutions', id]);
    }
  }

  newForm() {
    this.router.navigate(['/pollutions/new']);
  }

  toggleFavorite(id?: string | number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (id) {
      this.store.dispatch(new ToggleFavorite(id));
    }
  }

  isFavorite(id?: string | number): boolean {
    return this.store.selectSnapshot(FavoritesState.isFavorite)(id);
  }
}
