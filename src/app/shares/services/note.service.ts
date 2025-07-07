import { Injectable } from '@angular/core';
import * as CONFIG from "../data/config";
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CommonService } from './common.service';
import { DataAddWord, DetailNotebook, Notebook, WordNotebook } from '../../common/interfaces/note';
import { BroadcasterService } from './broadcaster.service';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    detailNote: DetailNotebook | undefined;
    urlCacheNote: string = CONFIG.BASE_URL + 'notebook/user';

    constructor(
        private http: HttpClient,
        private commonService: CommonService,
        private broadcaster: BroadcasterService
    ) { }

    getDefaultNotebook() {
        const url = CONFIG.BASE_URL + 'notebook/auto';
        if (this.commonService.getDataCache(url)) return of(this.commonService.getDataCache(url));
        return this.http.get(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                this.commonService.setDataCache(url, res);
            })
        );
    }

    getUserNote() {
        const url = CONFIG.BASE_URL + 'notebook/user';
        if (this.commonService.getDataCache(url)) return of(this.commonService.getDataCache(url));
        return this.http.get<Notebook[]>(url, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                if (res) {
                    this.commonService.setDataCache(url, res);
                }
            })
        );
    }

    createNotebook(name: string) {
        const url = CONFIG.BASE_URL + 'notebook/create';
        return this.http.post<Notebook>(url, { name }, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                if (res) {
                    let list = this.commonService.getDataCache(this.urlCacheNote);
                    list.unshift(res);
                    this.commonService.setDataCache(this.urlCacheNote, list);
                }
            })
        );
    }

    updateNotebook(name: string, id: number) {
        const url = CONFIG.BASE_URL + 'notebook/update';
        return this.http.put<Notebook>(url, { name, id }, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                if (res) {
                    let list: Notebook[] = this.commonService.getDataCache(this.urlCacheNote);
                    let idxNote = list.findIndex(item => item.id === res.id);
                    if (idxNote >= 0) {
                        list[idxNote] = res;
                    }
                    this.commonService.setDataCache(this.urlCacheNote, list);
                }
            })
        );
    }

    deleteNotebook(id: number) {
        const url = CONFIG.BASE_URL + 'notebook/' + id;
        return this.http.delete(url).pipe(
            tap(res => {
                let list: Notebook[] = this.commonService.getDataCache(this.urlCacheNote);
                let idxNote = list.findIndex(item => item.id === id);
                if (idxNote >= 0) {
                    list.splice(idxNote, 1);
                }
                this.commonService.setDataCache(this.urlCacheNote, list);
            })
        )
    }

    getDetailNote(id: number): Observable<DetailNotebook> {
        const url = CONFIG.BASE_URL + 'notebook/' + id;
        if (this.commonService.getDataCache(url)) return of(this.commonService.getDataCache(url));
        return this.http.get<DetailNotebook>(url).pipe(
            tap(res => {
                if (res) {
                    this.commonService.setDataCache(url, res);
                }
            })
        )
    }

    addWordToNote(data: DataAddWord, notebId: number) {
        const url = CONFIG.BASE_URL + 'notebook/' + notebId + '/add-word';
        return this.http.post<WordNotebook>(url, data, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                if (res.id) {
                    let detailNote = this.commonService.getDataCache(CONFIG.BASE_URL + 'notebook/' + notebId);
                    let list: Notebook[] | undefined = this.commonService.getDataCache(CONFIG.BASE_URL + 'notebook/user');
                    if (detailNote) {
                        detailNote.total++;
                        detailNote.words.unshift(res);
                    }
                    if(list && list.length) {
                        let idxNote = list.findIndex(item => item.id === notebId);
                        if (idxNote >= 0) {
                            list[idxNote].total++;
                        }
                    }
                    this.detailNote = detailNote;
                    this.commonService.setDataCache(CONFIG.BASE_URL + 'notebook/' + notebId, this.detailNote);
                    this.commonService.setDataCache(CONFIG.BASE_URL + 'notebook/user', list);
                    this.broadcaster.broadcast('update-list-note', list)
                }
            })
        );
    }

    deleteWord(id: number) {
        const url = CONFIG.BASE_URL + 'notebook/word/' + id;
        return this.http.delete(url).pipe(
            tap(res => {
                if (this.detailNote) {
                    let idx = this.detailNote.words.findIndex(item => item.id === id);
                    if (idx >= 0) {
                        this.detailNote.words.splice(idx, 1);
                        this.detailNote.total --;
                    }
                }
            })
        );
    }

    editWordNote(data: DataAddWord, wordId: number) {
        const url = CONFIG.BASE_URL + 'notebook/edit-word/' + wordId;
        return this.http.post<WordNotebook>(url, data, CONFIG.HTTP_OPTION).pipe(
            tap(res => {
                if (res.id) {
                    if (this.detailNote) {
                        let idx = this.detailNote.words.findIndex(item => item.id === res.id);
                        if (idx >= 0) {
                            this.detailNote.words[idx] = res;
                        }
                    }
                }
            })
        );
    }


}
