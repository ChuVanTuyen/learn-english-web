import { Routes } from '@angular/router';

export const PracticeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./note.component').then(m => m.NoteComponent)
    }
]