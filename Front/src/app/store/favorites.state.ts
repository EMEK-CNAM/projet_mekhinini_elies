import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

// Actions
export class LoadFavorites {
  static readonly type = '[Favorites] Load Favorites';
}

export class AddFavorite {
  static readonly type = '[Favorites] Add Favorite';
  constructor(public pollutionId: string | number) {}
}

export class RemoveFavorite {
  static readonly type = '[Favorites] Remove Favorite';
  constructor(public pollutionId: string | number) {}
}

export class ToggleFavorite {
  static readonly type = '[Favorites] Toggle Favorite';
  constructor(public pollutionId: string | number) {}
}

export class ClearFavorites {
  static readonly type = '[Favorites] Clear Favorites';
}

// State Model
export interface FavoritesStateModel {
  favoriteIds: string[];
  currentUser: string | null;
}

@State<FavoritesStateModel>({
  name: 'favorites',
  defaults: {
    favoriteIds: [],
    currentUser: null,
  },
})
@Injectable()
export class FavoritesState {
  private readonly STORAGE_KEY_PREFIX = 'app:favorites:';

  @Selector()
  static favoriteIds(state: FavoritesStateModel): string[] {
    return state.favoriteIds;
  }

  @Selector()
  static count(state: FavoritesStateModel): number {
    return state.favoriteIds.length;
  }

  @Selector()
  static isFavorite(state: FavoritesStateModel) {
    return (id?: string | number): boolean => {
      if (!id) return false;
      return state.favoriteIds.includes(String(id));
    };
  }

  @Action(LoadFavorites)
  loadFavorites(ctx: StateContext<FavoritesStateModel>) {
    const state = ctx.getState();
    const username = state.currentUser || localStorage.getItem('app:username') || 'guest';
    const storageKey = this.STORAGE_KEY_PREFIX + username;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const favoriteIds = JSON.parse(stored);
        ctx.patchState({
          favoriteIds: Array.isArray(favoriteIds) ? favoriteIds : [],
          currentUser: username,
        });
      } catch {
        ctx.patchState({ favoriteIds: [] });
      }
    }
  }

  @Action(AddFavorite)
  addFavorite(ctx: StateContext<FavoritesStateModel>, action: AddFavorite) {
    const state = ctx.getState();
    const idStr = String(action.pollutionId);

    if (!state.favoriteIds.includes(idStr)) {
      const newFavorites = [...state.favoriteIds, idStr];
      ctx.patchState({ favoriteIds: newFavorites });
      this.saveToStorage(state.currentUser, newFavorites);
    }
  }

  @Action(RemoveFavorite)
  removeFavorite(ctx: StateContext<FavoritesStateModel>, action: RemoveFavorite) {
    const state = ctx.getState();
    const idStr = String(action.pollutionId);
    const newFavorites = state.favoriteIds.filter((id) => id !== idStr);

    ctx.patchState({ favoriteIds: newFavorites });
    this.saveToStorage(state.currentUser, newFavorites);
  }

  @Action(ToggleFavorite)
  toggleFavorite(ctx: StateContext<FavoritesStateModel>, action: ToggleFavorite) {
    const state = ctx.getState();
    const idStr = String(action.pollutionId);

    if (state.favoriteIds.includes(idStr)) {
      ctx.dispatch(new RemoveFavorite(action.pollutionId));
    } else {
      ctx.dispatch(new AddFavorite(action.pollutionId));
    }
  }

  @Action(ClearFavorites)
  clearFavorites(ctx: StateContext<FavoritesStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ favoriteIds: [] });
    this.saveToStorage(state.currentUser, []);
  }

  private saveToStorage(username: string | null, favorites: string[]): void {
    const user = username || localStorage.getItem('app:username') || 'guest';
    const storageKey = this.STORAGE_KEY_PREFIX + user;
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }
}
