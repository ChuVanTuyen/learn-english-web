import { Routes } from '@angular/router';

export const NotebookRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./note.component').then(m => m.NoteComponent)
    }
]