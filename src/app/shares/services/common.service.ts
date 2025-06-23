import { afterNextRender, effect, ElementRef, Inject, Injectable, LOCALE_ID, signal, WritableSignal } from '@angular/core';
import { BroadcasterService } from './broadcaster.service';
import { ModalService } from './modal.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ObjectKey } from '../../common/interfaces/common';
import { InforUser } from '../../common/interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

    sUser: WritableSignal<InforUser | undefined> = signal(undefined);

    environment: string = 'server';
    countryCode: string = '';

    dataCache: ObjectKey<any> = {};
    pdfWidth: number = 0;
    constructor(
        private broadcaster: BroadcasterService,
        private modalService: ModalService,
        private http: HttpClient,
        @Inject(LOCALE_ID) private locale: string,
    ) { 
        afterNextRender(() => {
            this.environment = 'client';
            this.sUser.set(this.getLocal('userInfor'));
        });
    }

    get lang() {
        return this.locale;
    }

    setLocal(key: string, value: any) {
        if (this.environment == 'client') {
            if (typeof value === 'string') {
                localStorage.setItem(key, value);
            } else {
                localStorage.setItem(key, JSON.stringify(value));
            }
        }
    }

    getLocal(key: string) {
        if (this.environment == 'client') {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    return JSON.parse(value);
                } catch (error) {
                    return value;
                }
            }
        }
        return '';
    }

    testHttp() {
        return this.http.get('/a', {responseType: 'json' });
    }

    removeLocal(key: string) {
        if (this.environment == 'client') {
            localStorage.removeItem(key);
        }
    }

    getEnvironment() {
        return this.environment;
    }

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    closeAllModals() {
        this.modalService.closeAll();
    }

    scrollToTop() {
        if (this.getEnvironment() === 'client') {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    showNotify(content: string, type: string) {
        this.broadcaster.broadcast('notify', {
            'content': content,
            'type': type
        })
    }

    checkInsideView(elm: ElementRef) {
        const detailWord = elm.nativeElement?.getElementsByClassName('box-detail-wrap');
        if(!detailWord.length) return;

        const detailContent = detailWord[0];
        const key = detailContent.className.replace('box-detail-wrap', '').trim();

        const rect = detailContent.getBoundingClientRect();
        const state = rect.bottom <= window.innerHeight;
        if(!state) return;
        this.broadcaster.broadcast('load-report', { key, state });
    }

    getDataCache(key: string) {
        return this.dataCache[key];
    }

    setDataCache(key: string, value: any) {
        this.dataCache[key] = value;
    }

    clearDataCache() {
        this.dataCache = {};
    }

    clearInforUser() {
        this.removeLocal('userInfor');
        this.sUser.set(undefined);
    }
}
