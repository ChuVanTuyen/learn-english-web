import { Routes } from '@angular/router';
import { ExamRoutes } from './features/exam/exam.routes';
import { AuthRoutes } from './features/auth/auth.routes';
import { PracticeRoutes } from './features/practice/practice.routes';
import { DictionaryRoutes } from './features/dictionary/dictionary.routes';

export const routes: Routes = [
    { 
        path: 'dictionary', 
        children: DictionaryRoutes
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
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent), 
    },
];
