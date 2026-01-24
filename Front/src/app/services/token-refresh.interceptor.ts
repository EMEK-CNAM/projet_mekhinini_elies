import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState, RefreshToken, Logout } from '../store/auth.state';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authService = inject(AuthService);
  const token = store.selectSnapshot(AuthState.token);

  // Vérifier si le token doit être rafraîchi avant la requête
  if (token && authService.shouldRefreshToken(token)) {
    return store.dispatch(new RefreshToken()).pipe(
      switchMap(() => {
        const newToken = store.selectSnapshot(AuthState.token);
        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        });
        return next(clonedReq);
      }),
      catchError((error) => {
        store.dispatch(new Logout());
        return throwError(() => error);
      }),
    );
  }

  // Gérer les erreurs 401 (token expiré)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = store.selectSnapshot(AuthState.refreshToken);
        if (refreshToken) {
          return store.dispatch(new RefreshToken()).pipe(
            switchMap(() => {
              const newToken = store.selectSnapshot(AuthState.token);
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(clonedReq);
            }),
            catchError((refreshError) => {
              store.dispatch(new Logout());
              return throwError(() => refreshError);
            }),
          );
        } else {
          store.dispatch(new Logout());
        }
      }
      return throwError(() => error);
    }),
  );
};
