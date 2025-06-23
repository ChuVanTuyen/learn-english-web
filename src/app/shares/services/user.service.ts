import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { DataLogin, InforUser } from '../../common/interfaces/user';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }

    login(data: DataLogin) {
        const url = CONFIG.BASE_URL + 'auth/login';
        return this.http.post<InforUser>(url, data, CONFIG.HTTP_OPTION);
    }

    saveUser(user: InforUser) {
        this.commonService.setLocal('userInfor', user);
        this.commonService.sUser.set(user);
    }
}
