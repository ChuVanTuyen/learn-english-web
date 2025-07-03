import { Routes } from '@angular/router';
import { ExamRoutes } from './features/exam/exam.routes';
import { AuthRoutes } from './features/auth/auth.routes';
import { PracticeRoutes } from './features/practice/practice.routes';
import { DictionaryRoutes } from './features/dictionary/dictionary.routes';
import { NotebookRoutes } from './features/note/note.routes';

export const routes: Routes = [
    { 
        path: 'ebook', 
        loadComponent: () => import('./features/ebook/ebook.component').then(m => m.EbookComponent)
    },
    { 
        path: 'dictionary', 
        children: DictionaryRoutes
    },
    { 
        path: 'notebook', 
        children: NotebookRoutes
    },
    { 
        path: 'practice', 
        children: PracticeRoutes
    },
    { 
        path: 'auth', 
        children: AuthRoutes
    },
    { 
        path: 'exam', 
        children: ExamRoutes
    },
    { 
        path: '',
        redirectTo: 'dictionary', 
        pathMatch: 'full'
    },
];
