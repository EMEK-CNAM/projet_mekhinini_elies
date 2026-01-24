import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

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

export class RefreshToken {
  static readonly type = '[Auth] Refresh Token';
}

// State Model
export interface AuthStateModel {
  token: string | null;
  refreshToken: string | null;
  user: any | null;
  isAuthenticated: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  },
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService) {}

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static refreshToken(state: AuthStateModel): string | null {
    return state.refreshToken;
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
    return this.authService
      .login({
        email: action.email,
        password: action.password,
      })
      .pipe(
        tap((response) => {
          ctx.patchState({
            token: response.token,
            refreshToken: response.refreshToken,
            user: response.user,
            isAuthenticated: true,
          });
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        }),
      );
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    return this.authService.register(action.payload).pipe(
      tap((response) => {
        ctx.patchState({
          token: response.token,
          refreshToken: response.refreshToken,
          user: response.user,
          isAuthenticated: true,
        });
      }),
      catchError((error) => {
        console.error('Register error:', error);
        return throwError(() => error);
      }),
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  }

  @Action(RefreshToken)
  refreshToken(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState();
    if (!state.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.authService.refreshToken(state.refreshToken).pipe(
      tap((response) => {
        ctx.patchState({
          token: response.token,
          refreshToken: response.refreshToken,
        });
      }),
      catchError((error) => {
        ctx.dispatch(new Logout());
        return throwError(() => error);
      }),
    );
  }
}
