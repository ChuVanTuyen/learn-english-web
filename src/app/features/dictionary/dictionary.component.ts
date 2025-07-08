import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { DictionaryService } from '../../shares/services/dictionary.service';
import { TIPS } from '../../shares/data/dictionary';
import { SuggestWord, Tip } from '../../common/interfaces/dictionary';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, of, Subject, switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CommonService } from '../../shares/services/common.service';

@Component({
    selector: 'app-dictionary',
    imports: [
        FormsModule,
        RouterModule
    ],
    templateUrl: './dictionary.component.html',
    styleUrl: './dictionary.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictionaryComponent {

    limit: number = 20;
    tips: Tip[] = TIPS;

    isNotGetSuggest: boolean = false;
    active: WritableSignal<number> = signal(-1);
    query: WritableSignal<string> = signal('');
    inputSubject = new Subject<string>();
    resultSuggest: WritableSignal<SuggestWord[]> = signal([]);

    private readonly destroyRef = inject(DestroyRef);
    constructor(
        private dictionaryService: DictionaryService,
        private router: Router,
        private commonService: CommonService
    ) {
        toObservable(this.query).pipe(
            debounceTime(300),
            distinctUntilChanged(),
            map(q => q.trim()),
            filter(Boolean),
            switchMap((term) => {
                if(this.isNotGetSuggest) {
                    this.isNotGetSuggest = false;
                    return of([]);
                } else {
                    return this.dictionaryService.getSuggestWord(term, this.limit)
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(res => this.resultSuggest.set(res));
    }

    ngOnInit() {}

    ngAfterViewInit() {
        this.commonService.scrollToTop();
    }

    onInputChange(value: string) {
        this.query.set(value);
        this.inputSubject.next(value.trim());
    }

    openSearch(text: string) {
        if(text !== this.query()) {
            this.query.set(text);
        }
        this.isNotGetSuggest = this.active() > -1;
        this.active.set(-1);
        this.router.navigate(['/dictionary/word/' + encodeURIComponent(text)]);
        this.resultSuggest.set([]);
    }

    incActive(): void {
        const max = this.resultSuggest().length;
        this.active.update(v => v < max - 1 ? v + 1 : v);
    }
    decActive(): void {
        this.active.update(v => v > -1 ? v - 1 : v);
    }
}
