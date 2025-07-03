import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'ebook/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'dictionary/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'practice/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'exam/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
