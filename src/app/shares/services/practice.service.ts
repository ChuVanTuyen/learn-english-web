import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { Question } from '../../common/interfaces/exam';
import { DetailHistoryPractice, HistoryPractice, PracticeSummary, PracticeSummaryResponse } from '../../common/interfaces/practice';
import { CommonService } from './common.service';
import { Observable, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PracticeService {

    autoNext = false;
    testMode = false;
    numQues = 10;
    time: number = 0; // thời gian làm luyện tập

    summary: PracticeSummary | undefined;

    constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }

    getQuestions(partId: number, limit: number, isAgainFailed: boolean) {
        let url = CONFIG.BASE_URL + 'practice/' + (isAgainFailed ? 'list-question-failed/' : 'list-question/' ) + partId + '/' + limit;
        return this.http.get<Question[]>(url, CONFIG.HTTP_OPTION);
    }

    getPracticeSummary(partId: number) {
        const url = CONFIG.BASE_URL + 'practice/summary-history-practice/' + partId;
        return this.http.get<PracticeSummaryResponse>(url, CONFIG.HTTP_OPTION);
    }

    savePracticeSummary(summary: PracticeSummary, history: HistoryPractice) {
        const url = CONFIG.BASE_URL + 'practice/save-history';
        const data = {
            summary: summary,
            history: history
        }
        return this.http.post(url, data);
    }

    getDetailHistory(historyId: number): Observable<DetailHistoryPractice> {
        const url = CONFIG.BASE_URL + 'practice/detail-history/' + historyId;
        if(this.commonService.getDataCache(url)) return of(this.commonService.getDataCache(url));
        return this.http.get<DetailHistoryPractice>(url).pipe(
            tap(res => {
                if(res.historyPractice) {
                    this.commonService.setDataCache(url, res);
                }
            })
        );
    }
}
