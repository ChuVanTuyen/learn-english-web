import { Routes, UrlSegment } from '@angular/router';

export const DictionaryRoutes: Routes = [
    
    {
        path: '',
        loadComponent: () => import('./dictionary.component').then(m => m.DictionaryComponent),
        children: [
            {
                path: 'word/:slug',
                loadComponent: () => import('./detail-word/detail-word.component').then(m => m.DetailWordComponent)
            },
            {
                path: '',
                loadComponent: () => import('./dictionary-home/dictionary-home.component').then(m => m.DictionaryHomeComponent)
            }
        ]
    }
]