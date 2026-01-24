import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { UtilisateurService } from '../services/utilisateur.service';

// Actions
export class Login {
  static readonly type = '[Auth] Login';
  constructor(
    public email: string,
    public password: string,
  ) {}
}

export class Register {
  static readonly type = '[Auth] Register';
  constructor(public payload: { nom: string; prenom: string; email: string; password: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class CheckAuth {
  static readonly type = '[Auth] Check Auth';
}

// State Model
export interface AuthStateModel {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
    user: null,
    isAuthenticated: false,
  },
})
@Injectable()
export class AuthState {
  constructor(private utilisateurService: UtilisateurService) {}

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static user(state: AuthStateModel): any | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    const credentials = {
      email: action.email,
      password: action.password,
    };

    return this.utilisateurService.login(credentials).pipe(
      tap((user) => {
        ctx.patchState({
          token: 'mock-jwt-token',
          user: user,
          isAuthenticated: true,
        });

        // Sauvegarder dans localStorage
        const username = user.email ? user.email.split('@')[0] : user.nom;
        localStorage.setItem('app:token', 'mock-jwt-token');
        localStorage.setItem('app:user', JSON.stringify(user));
        localStorage.setItem('app:isLoggedIn', 'true');
        localStorage.setItem('app:username', username);
      }),
    );
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    return this.utilisateurService.create(action.payload as any).pipe(
      tap((user) => {
        // Après inscription, on connecte automatiquement l'utilisateur
        ctx.patchState({
          user: user,
          isAuthenticated: true,
          token: 'mock-jwt-token',
        });

        localStorage.setItem('app:token', 'mock-jwt-token');
        localStorage.setItem('app:user', JSON.stringify(user));
        localStorage.setItem('app:isLoggedIn', 'true');
        localStorage.setItem('app:username', user.nom);
      }),
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });

    localStorage.removeItem('app:token');
    localStorage.removeItem('app:user');
    localStorage.removeItem('app:isLoggedIn');
    localStorage.removeItem('app:username');
  }

  @Action(CheckAuth)
  checkAuth(ctx: StateContext<AuthStateModel>) {
    const token = localStorage.getItem('app:token');
    const userStr = localStorage.getItem('app:user');

    if (token && userStr) {
      ctx.patchState({
        token: token,
        user: JSON.parse(userStr),
        isAuthenticated: true,
      });
    }
  }
}
