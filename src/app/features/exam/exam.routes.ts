import { Routes, UrlSegment } from '@angular/router';

export const ExamRoutes: Routes = [

    {
        matcher: (url) => {
            if (url.length === 2 && url[0].path === 'history' && url[1].path.match(/^\d+-\d+$/)) {
                return {
                    consumed: url,
                    posParams: {
                        ids: new UrlSegment(url[1].path, {})
                    }
                };
            }
            return null;
        },
        loadComponent: () => import('./result-test/result-test.component').then(m => m.ResultTestComponent)
    },
    {
        path: 'detail/:id',
        loadComponent: () => import('./detail-test/detail-test.component').then(m => m.DetailTestComponent)
    },
    {
        path: '',
        loadComponent: () => import('./exam.component').then(m => m.ExamComponent)
    }
]