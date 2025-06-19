import { Routes, UrlSegment } from '@angular/router';

export const PracticeRoutes: Routes = [
    {
        matcher: (url) => {
            const urlArr = ['1', '2', '3', '4', '5', '6', '7'];
            if (url.length === 2 && urlArr.includes(url[0].path) && url[1].path === 'doing') {
                return { 
                    consumed: url, 
                    posParams: { 
                        part: new UrlSegment(url[0].path, {})
                    } 
                };
            }
            return null;
        },
        loadComponent: () => import('./doing-practice/doing-practice.component').then(m => m.DoingPracticeComponent)
    },
    {
        matcher: (url) => {
            const urlArr = ['1', '2', '3', '4', '5', '6', '7'];
            if (url.length === 1 && urlArr.includes(url[0].path)) {
                return {
                    consumed: url,
                    posParams: { part: new UrlSegment(url[0].path, {}) }
                };
            }
            return null;
        },
        loadComponent: () => import('./practice-summary/practice-summary.component').then(m => m.PracticeSummaryComponent)
    },
    {
        path: '',
        loadComponent: () => import('./practice.component').then(m => m.PracticeComponent)
    }
]