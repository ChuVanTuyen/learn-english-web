import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PracticeService } from '../../../shares/services/practice.service';
import { ChildQues, Question } from '../../../common/interfaces/exam';
import { SafePipe } from "../../../common/pipes/safe.pipe";
import { BASE_URL_PUBLIC } from '../../../shares/data/config';
import { HistoryPractice, PracticeSummary } from '../../../common/interfaces/practice';
import { DatatimePipe } from "../../../common/pipes/datatime.pipe";
import { CommonService } from '../../../shares/services/common.service';
import { AudioComponent } from "../../../shares/components/audio/audio.component";

@Component({
    selector: 'app-doing-practice',
    imports: [
        SafePipe,
        RouterLink,
        DatatimePipe,
        AudioComponent
    ],
    templateUrl: './doing-practice.component.html',
    styleUrls: [
        '../../../shares/styles/button.css',
        '../../exam/detail-test/detail-test.component.css',
        './doing-practice.component.css'
    ]
})
export class DoingPracticeComponent {

    part: number = 1;
    timeDown: number = 0;
    submitted: boolean = false;
    loading: boolean = false;
    isAgainFailed: boolean = false;
    timeInterval: NodeJS.Timeout | undefined;
    baseUrl: string = BASE_URL_PUBLIC;
    listQuestion: Question[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        protected readonly practiceService: PracticeService,
        private commonService: CommonService
    ) {}

    ngOnInit() {
        if(!this.practiceService.time) {
            this.router.navigate(['practice']);
        };
        this.route.paramMap.subscribe(param => {
            this.part = Number(param.get('part'));
            this.isAgainFailed = this.router.url.includes('failed');
            if (this.commonService.getEnvironment() === 'client') {
                this.getQuestions();
            }
        });
    }

    getQuestions() {
        this.timeDown = 0;
        this.practiceService.getQuestions(this.part, this.practiceService.numQues, this.isAgainFailed).subscribe({
            next: res => {
                this.listQuestion = JSON.parse(JSON.stringify(res));
                let idx = 0;
                this.listQuestion.forEach(ques => {
                    if (ques.text_read.includes('src=')) {
                        ques.text_read = this.addDomain(ques.text_read, BASE_URL_PUBLIC);
                    }
                    ques.child_ques.forEach(child => {
                        idx++;
                        child.selected = -1;
                        child.idx = idx;
                    })
                });
                

                this.timeInterval = setInterval(() => {
                    this.timeDown++;
                    if(this.practiceService.testMode && this.timeDown >= this.practiceService.time) {
                        this.commonService.showNotify('Hết giờ, vui lòng nộp bài!', 'warning');
                        clearInterval(this.timeInterval);
                    }
                }, 1000) 
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    addDomain(html: string, domain: string) {
        return html.replace(
            /src="(?!https?:\/\/|\/\/)([^"]+)"/g,
            (match, path) => `src="${domain}${path}"`
        );
    }

    chooseQuestion(quesIdx: number) {
        if(this.commonService.getEnvironment() === 'client') {
            const element = document.getElementById('ques-' + quesIdx);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }    
        }
    }

    chooseAns(child: ChildQues, answer: number) {
        if(this.practiceService.testMode && this.timeDown >= this.practiceService.time) {
            this.commonService.showNotify('Hết giờ, vui lòng nộp bài!', 'warning');
            return;
        } 
        if(!this.practiceService.testMode && child.selected > -1 ) return;
        child.selected = answer;
        child.isCorrect = answer === child.correct_answer;
    }

    submit() {
        clearInterval(this.timeInterval);
        if(this.loading || this.submitted) return;
        let dataSend: HistoryPractice = {
            content: {},
            total: 0,
            time: this.timeDown,
            correct: 0,
            part_id: this.part
        } as HistoryPractice;

        let summaryPractice: PracticeSummary = {
            done_questions: {},
            false_questions: {}
        }

        if(this.practiceService.summary) {
            summaryPractice = this.practiceService.summary;
        }

        this.listQuestion.forEach(ques => {
            ques.child_ques.forEach(child => {
                dataSend.content[child.id] = child.selected;
                dataSend.total ++;
                if(child.isCorrect) {
                    dataSend.correct ++;
                }
                if(!summaryPractice.done_questions[this.part]) {
                    summaryPractice.done_questions[this.part] = [ques.id];
                } else {
                    if(!summaryPractice.done_questions[this.part].includes(ques.id)) {
                        summaryPractice.done_questions[this.part].push(ques.id);
                    }
                }
                if(!ques.child_ques.every(c => c.isCorrect)) {
                    if(!summaryPractice.false_questions[this.part]) {
                        summaryPractice.false_questions[this.part] = [ques.id];
                    } else {
                        if(!summaryPractice.false_questions[this.part].includes(ques.id)) {
                            summaryPractice.false_questions[this.part].push(ques.id);
                        }
                    }
                } else {
                    if(summaryPractice.false_questions[this.part]) {
                        const idx = summaryPractice.false_questions[this.part].findIndex(id => ques.id === id);
                        if(idx > -1) {
                            summaryPractice.false_questions[this.part].splice(idx, 1);
                        }
                    }
                }
            })
        });
        this.submitted = true;
        this.loading = true;
        this.commonService.scrollToTop();
        this.practiceService.savePracticeSummary(summaryPractice, dataSend).subscribe({
            next: res => {
                this.practiceService.summary = summaryPractice;
                this.loading = false;
                this.commonService.showNotify('Nộp bài thành công', 'success');
            },
            error: err => {
                this.loading = false;
                this.commonService.showNotify('Đã có lỗi xảy ra', 'danger');
            }
        })
    }

    ngOnDestroy() {
        clearInterval(this.timeInterval);
    }
}
