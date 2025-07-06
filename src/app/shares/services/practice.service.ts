import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { Question } from '../../common/interfaces/exam';
import { HistoryPractice, PracticeSummary, PracticeSummaryResponse } from '../../common/interfaces/practice';

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
        private http: HttpClient
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
        return this.http.post(url, data, { responseType: 'text'  });
    }
}
