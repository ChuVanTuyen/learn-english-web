import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { DetailTest, HistoryTest, SaveHistoryTest } from '../../common/interfaces/exam';
import { of, tap } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class TestService {

    // cache: ObjectKey<any> = {};

    constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }

    getDetailTest(id: number) {
        const url = CONFIG.BASE_URL + 'exam/detail/' + id;
        if (this.commonService.getDataCache(url)) return of<DetailTest>(this.commonService.getDataCache(url));
        return this.http.get<DetailTest>(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                if (res.id) {
                    this.commonService.setDataCache(url, res);
                }
                return res;
            })
        );
    }

    getDetailHistory(id: number) {
        const url = CONFIG.BASE_URL + 'exam/history/' + id;
        return this.http.get<HistoryTest>(url, CONFIG.HTTP_OPTION);
    }

    getListExamAndHistory() {
        const url = CONFIG.BASE_URL + 'exam';
        if (this.commonService.getDataCache(url)) return of(this.commonService.getDataCache(url));
        return this.http.get(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => this.commonService.setDataCache(url, res))
        );
    }

    saveHistoryExam(historyTest: SaveHistoryTest, id: number) {
        const url = CONFIG.BASE_URL + 'exam/detail/' + id;
        return this.http.post(url, historyTest, CONFIG.HTTP_OPTION);
    }
}
