import { Routes } from '@angular/router';

export const NotebookRoutes: Routes = [
    {
        path: 'detail/:id/flashcard',
        loadComponent: () => import('./game/flashcard/flashcard.component').then(m => m.FlashcardComponent)
    },
    {
        path: 'detail/:id/practice',
        loadComponent: () => import('./game/practice-word/practice-word.component').then(m => m.PracticeWordComponent)
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