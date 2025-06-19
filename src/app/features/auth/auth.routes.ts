import { Routes, UrlSegment } from '@angular/router';

export const AuthRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
            }
        ]
    },
    {
        path: 'fogot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    }
]