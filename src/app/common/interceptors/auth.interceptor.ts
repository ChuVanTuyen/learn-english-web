import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { InforUser } from '../interfaces/user';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platform = inject(PLATFORM_ID);
    let user: InforUser | undefined;
    if (isPlatformBrowser(platform)) {
        const data = localStorage.getItem('userInfor');
        if(data) {
            user = JSON.parse(data);
        }
    }
    // check request in my server api or another api (google, ....) 
    const checkAPI = req.url.includes('/api');
    if (checkAPI && user && user.accessToken) {
        const authReq = req.clone({
            headers: req.headers.set('Authorization', user.accessToken)
        });
        return next(authReq);
    } else {
        return next(req);
    }
};
