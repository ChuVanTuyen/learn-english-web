import { Component, signal, WritableSignal, computed, effect, Signal, inject, DestroyRef } from '@angular/core';
import { AutoTrans, Word } from '../../../common/interfaces/dictionary';
import { HighlightQueryComponent } from '../../../shares/components/highlight-query/highlight-query.component';
import { AudioService } from '../../../shares/services/audio.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DictionaryService } from '../../../shares/services/dictionary.service';
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from '../../../shares/services/common.service';
import { BroadcasterService } from '../../../shares/services/broadcaster.service';

@Component({
    selector: 'app-detail-word',
    standalone: true,
    imports: [HighlightQueryComponent, NgTemplateOutlet, RouterLink],
    templateUrl: './detail-word.component.html',
    styleUrl: './detail-word.component.css',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailWordComponent {
    active: WritableSignal<number> = signal(-1);
    query: WritableSignal<string> = signal('');
    results: WritableSignal<Word[]> = signal([]);
    detail: Signal<Word | undefined> = computed(() => this.results().find(w => w.word === this.query()));
    autoTrans: WritableSignal<AutoTrans | undefined> = signal(undefined);
    loading1: boolean = false;
    loading2: boolean = false;

    private readonly destroyRef = inject(DestroyRef); 
    constructor(
        protected readonly audioService: AudioService,
        private route: ActivatedRoute,
        private dictionaryService: DictionaryService,
        private commonService: CommonService,
        private broadcaster: BroadcasterService
    ) {
        effect(() => {
            this.loading1 = true;
            this.dictionaryService.search(this.query())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(res => {
                    this.loading1 = false;
                    this.results.set(res);
                });
        });

        effect(() => {
            if (!this.detail()) {
                this.loading2 = true;
                this.dictionaryService.autoTranslate(this.query())
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe(res => {
                        this.loading2 = false;
                        this.autoTrans.set(res)
                    });
            }
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const slug = params.get('slug');
            this.query.set(slug ? decodeURIComponent(slug).trim() : '');
        });
    }

    openAddToNote(word: Word | undefined) {
        if(word) {
            this.broadcaster.broadcast('add-to-note', word);
        }
    }
}