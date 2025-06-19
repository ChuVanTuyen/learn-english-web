import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { PronouncePhonetizer, SuggestWord, Word } from '../../common/interfaces/dictionary';
import { ObjectKey } from '../../common/interfaces/common';
import { catchError, filter, forkJoin, map, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DictionaryService {

    cache: ObjectKey<any> = {}

    constructor(
        private http: HttpClient,
    ) { }

    search(word: string, limit: number = 20) {
        const url = CONFIG.BASE_URL + 'dictionary/search?q=' + word + '&limit=' + limit;
        if(this.cache[url]) return of(this.cache[url]);
        return this.http.get<Word[]>(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => this.cache[url] = res)
        );
    }

    getSuggestWord(word: string, limit: number = 20) {
        const url = CONFIG.BASE_URL + 'dictionary/suggest?q=' + word + '&limit=' + limit;
        if(this.cache[url]) return of(this.cache[url]);
        return this.http.get<SuggestWord[]>(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => this.cache[url] = res)
        );
    }

    getRelatedWord(word: string, limit: number = 20) {
        const url = CONFIG.BASE_URL + 'dictionary/related?q=' + word + '&limit=' + limit;
        if(this.cache[url]) return of(this.cache[url]);
        return this.http.get<SuggestWord[]>(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => this.cache[url] = res)
        );
    }

    cloudTranslate(query: string, from: string = 'en', to: string = 'vi') {
        let url = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&dt=ex&dt=ld&dt=md&dt=qca&dt=rm&dt=ss&sl="+ from +"&tl="+ to +"&q=" + encodeURIComponent(query);
        if (this.cache[url]) {
            return of(this.cache[url]);
        } else {
            return this.http.get(url).pipe();
        }
    }

    getPhonetic(word: string) {
        const url = "https://www.phonetizer.com/phonetizer/default/call/jsonrpc";
        const dataSend = {
            "id": "",
            "method": "transcribe",
            "params": [
                word,
                "American"
            ]
        }

        const httpOptionsCust = {
            headers: new HttpHeaders({
                'Content-Type': 'text/plain;charset=UTF-8'
            })
        }

        const key = JSON.stringify(dataSend);

        if(this.cache[key]) return of(this.cache[key]);

        return this.http.post<PronouncePhonetizer>(url, dataSend, httpOptionsCust).pipe(
            map((res) => {
                if(!res?.result) return '';
                const regex = '<span class=\\"transcr\\">.*<\/span>';
                const strMatch = res.result.match(regex);
                let strHandled = ''
                if (strMatch) {
                    let strClean = strMatch[0];
                    strClean = strClean.replace(/(<([^>]+)>)/g, '');
                    strClean = strClean.replace(/\//g, '');
                    strHandled = strClean;
                }
                return strHandled;
            }),
            filter(res => res.trim() !== ''),
            tap(res => this.cache[key] = res),
            catchError(err => of(err))
        );

    }

    autoTranslate(query: string, from: string = 'en', to: string = 'vi') {
        return forkJoin([
            this.cloudTranslate(query, from, to),
            this.getPhonetic(query)
        ]).pipe(
            catchError(err => of([])),
            map(([trans, pronounce]) => {
                if(trans && pronounce) {
                    return {
                        origin: trans.sentences[0].orig,
                        mean: trans.sentences[0].trans,
                        pronounce
                    }
                } else {
                    return undefined;
                }
            })
        );
    }

}
