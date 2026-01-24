import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'pollutions',
    renderMode: RenderMode.Server
  },
  {
    path: 'pollutions/new',
    renderMode: RenderMode.Client
  },
  {
    path: 'pollutions/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'pollutions/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'users',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
