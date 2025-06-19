import { ChangeDetectionStrategy, Component, signal, WritableSignal, computed, effect, Signal, inject, DestroyRef } from '@angular/core';
import { AutoTrans, SuggestWord, Word } from '../../../common/interfaces/dictionary';
import { HighlightQueryComponent } from '../../../shares/components/highlight-query/highlight-query.component';
import { AudioService } from '../../../shares/services/audio.service';
import { ActivatedRoute } from '@angular/router';
import { DictionaryService } from '../../../shares/services/dictionary.service';
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-detail-word',
    standalone: true,
    imports: [HighlightQueryComponent, NgTemplateOutlet],
    templateUrl: './detail-word.component.html',
    styleUrl: './detail-word.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailWordComponent {
    active: WritableSignal<number> = signal(-1);
    query: WritableSignal<string> = signal('');
    results: WritableSignal<Word[]> = signal([]);
    detail: Signal<Word | undefined> = computed(() => this.results().find(w => w.word === this.query()));
    autoTrans: WritableSignal<AutoTrans | undefined> = signal(undefined);

    private readonly destroyRef = inject(DestroyRef); 
    constructor(
        protected readonly audioService: AudioService,
        private route: ActivatedRoute,
        private dictionaryService: DictionaryService
    ) {
        // Search when query changes
        effect(() => {
            this.dictionaryService.search(this.query())
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(res => this.results.set(res));
        });

        // Auto translate if no detail found
        effect(() => {
            if (!this.detail()) {
                this.dictionaryService.autoTranslate(this.query())
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe(res => this.autoTrans.set(res));
            }
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const slug = params.get('slug');
            this.query.set(slug ? decodeURIComponent(slug).trim() : '');
        });
    }
}