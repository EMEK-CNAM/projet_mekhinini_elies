import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';

import { routes } from './app.routes';
import { AuthState } from './store/auth.state';
import { PollutionState } from './store/pollution.state';
import { FavoritesState } from './store/favorites.state';
import { authInterceptor } from './services/auth.interceptor';
import { tokenRefreshInterceptor } from './services/token-refresh.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, tokenRefreshInterceptor])),
    provideStore(
      [AuthState, PollutionState, FavoritesState],
      withNgxsLoggerPlugin(),
      withNgxsReduxDevtoolsPlugin(),
    ),
  ],
};
