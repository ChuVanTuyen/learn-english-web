import { Routes } from '@angular/router';

export const NotebookRoutes: Routes = [
    {
        path: 'auto/:id',
        loadComponent: () => import('./detail-note/detail-note.component').then(m => m.DetailNoteComponent)
    },
    {
        path: 'detail/:id',
        loadComponent: () => import('./detail-note/detail-note.component').then(m => m.DetailNoteComponent)
    },
    {
        path: '',
        loadComponent: () => import('./note.component').then(m => m.NoteComponent)
    }
]