import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Injectable({
  providedIn: 'root'
})
export class LazyloadService {
    private loadedLibraries: { [url: string]: ReplaySubject<boolean> } = {};

    constructor(
        @Inject(DOCUMENT) private readonly document: Document
    ) { }

    loadScript(url: string, opt: any = null): Observable<boolean> {
        if (this.loadedLibraries[url]) {
            return this.loadedLibraries[url].asObservable();
        }
        this.loadedLibraries[url] = new ReplaySubject();

        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
            this.loadedLibraries[url].next(true);
            this.loadedLibraries[url].complete();
        };

        this.document.body.appendChild(script);

        return this.loadedLibraries[url].asObservable();
    }
}
