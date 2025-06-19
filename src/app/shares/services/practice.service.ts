import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { Question } from '../../common/interfaces/exam';

@Injectable({
    providedIn: 'root'
})
export class PracticeService {

    constructor(
        private http: HttpClient
    ) { }

    getQuestions(partId: number, limit: number) {
        const url = CONFIG.BASE_URL + 'practice/list-question/' + partId + '/' + limit;
        return this.http.get<Question[]>(url, CONFIG.HTTP_OPTION);
    }
}
