import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { of, tap } from 'rxjs';
import { ObjectKey } from '../../common/interfaces/common';
import { Ebook } from '../../common/interfaces/ebook';

@Injectable({
    providedIn: 'root'
})
export class EbookService {

    cache : ObjectKey<any> = {} 

    constructor(
        private http: HttpClient
    ) { }

    getListBook() {
        const url = CONFIG.BASE_URL + 'ebook';
        if(this.cache[url]) return of(this.cache[url]);
        return this.http.get<Ebook[]>(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                this.cache[url] = res;
            })
        )
    }
}
