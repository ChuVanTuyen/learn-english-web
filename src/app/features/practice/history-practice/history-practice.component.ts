import { Component } from '@angular/core';
import { BASE_URL_PUBLIC } from '../../../shares/data/config';
import { Question } from '../../../common/interfaces/exam';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PracticeService } from '../../../shares/services/practice.service';
import { CommonService } from '../../../shares/services/common.service';
import { SafePipe } from '../../../common/pipes/safe.pipe';
import { DatatimePipe } from '../../../common/pipes/datatime.pipe';
import { AudioComponent } from '../../../shares/components/audio/audio.component';
import { HistoryPractice } from '../../../common/interfaces/practice';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-history-practice',
    imports: [
        SafePipe,
        RouterLink,
        DatatimePipe,
        AudioComponent,
        CommonModule
    ],
    templateUrl: './history-practice.component.html',
    styleUrls: [
        '../../../shares/styles/button.css',
        '../../exam/detail-test/detail-test.component.css',
        './history-practice.component.css'
    ]
})
export class HistoryPracticeComponent {

    part: number = 1;
    historyId: number = 0;
    timeDown: number = 0;
    submitted: boolean = false;
    loading: boolean = false;
    isAgainFailed: boolean = false;
    isShowMobile: boolean = false;
    timeInterval: NodeJS.Timeout | undefined;
    baseUrl: string = BASE_URL_PUBLIC;
    listQuestion: Question[] = [];
    history: HistoryPractice | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        protected readonly practiceService: PracticeService,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.part = Number(params.get('part'));
            this.historyId = Number(params.get('historyId'));
            if(!this.part || !this.historyId) {
                this.router.navigate(['practice']);
            } else {
                if(this.commonService.getEnvironment() === 'client') {
                    this.getDetailHistory(this.historyId);
                }
            }
        })
    }

    ngAfterViewInit() {
        this.commonService.scrollToTop();
    }

    getDetailHistory(historyId: number) {
        this.practiceService.getDetailHistory(historyId).subscribe({
            next: res => {
                this.listQuestion = res.questions;
                this.history = res.historyPractice;
                this.handleHistory();
            }
        })
    }

    handleHistory() {
        let idx = 0;
        this.listQuestion.forEach(ques => {
            ques.child_ques.forEach(child => {
                child.idx = ++idx;
                if(this.history) {
                    child.selected = this.history.content[child.id];
                }
                child.isCorrect = child.selected === child.correct_answer;
            })
        });
    }

    toggleMobile(show: boolean) {
        this.isShowMobile = show;
    }
}
