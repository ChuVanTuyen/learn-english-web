import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { AutoTrans, Word } from '../../../common/interfaces/dictionary';
import { BroadcasterService } from '../../services/broadcaster.service';
import { DictionaryService } from '../../services/dictionary.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HighlightQueryComponent } from "../../components/highlight-query/highlight-query.component";
import { AudioService } from '../../services/audio.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-modal-search',
    imports: [NgTemplateOutlet, HighlightQueryComponent, RouterLink],
    templateUrl: './modal-search.component.html',
    styleUrl: './modal-search.component.css'
})
export class ModalSearchComponent {

    loading: boolean = false;
    isClose: boolean = true;
    query: string = '';
    results: Word[] = [];
    detail: Word | undefined;
    autoTrans: AutoTrans | undefined;

    private readonly destroyRef = inject(DestroyRef); 
    constructor(
        private broadcaster: BroadcasterService,
        private dictionaryService: DictionaryService,
        protected readonly audioService: AudioService
    ) {}

    ngOnInit() {
        this.broadcaster.on<string>('open-modal-search').subscribe(query => {
            this.query = query;
            if(this.query.trim()) {
                this.loading = true;
                this.isClose = false;
                this.dictionaryService.search(this.query).subscribe({
                    next: (res) => {
                        this.detail = res.find((w: any) => w.word === this.query);
                        if(!this.detail) {
                            this.dictionaryService.autoTranslate(this.query)
                                .pipe(takeUntilDestroyed(this.destroyRef))
                                .subscribe(res => {
                                    this.loading = false;
                                    this.autoTrans = res;
                                });
                        } else {
                            this.loading = false;
                        }
                    }
                })
            }
        })
    }

    openAddToNote(word: Word | undefined) {
        if(word) {
            this.broadcaster.broadcast('add-to-note', word);
        }
    }

    close() {
        this.loading = false;
        this.isClose = true;
        this.query = '';
        this.results = [];
        this.detail =  undefined;
        this.autoTrans = undefined;
    }
}
