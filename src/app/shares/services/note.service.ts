import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { ObjectKey } from '../../common/interfaces/common';
import { of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    cache: ObjectKey<any> = {}

    constructor(
        private http: HttpClient
    ) { }

    getDefaultNotebook() {
        const url = CONFIG.BASE_URL + 'notebook/auto';

        if(this.cache[url]) return of(this.cache[url]);
        return this.http.get(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                this.cache[url] = res;
            })
        );
    }
}
