import { Component, Inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PracticeService } from '../../../shares/services/practice.service';
import { ChildQues, Question } from '../../../common/interfaces/exam';
import { SafePipe } from "../../../common/pipes/safe.pipe";
import { BASE_URL } from '../../../shares/data/config';
import { DOCUMENT } from '@angular/common';
import { HistoryPractice, PracticeSummary } from '../../../common/interfaces/practice';
import { DatatimePipe } from "../../../common/pipes/datatime.pipe";

@Component({
    selector: 'app-doing-practice',
    imports: [
    SafePipe,
    RouterLink,
    DatatimePipe
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
    listQuestion: Question[] = [];
    constructor(
        private route: ActivatedRoute,
        protected readonly practiceService: PracticeService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            this.part = Number(param.get('part'));
            this.practiceService.getQuestions(this.part, this.practiceService.numQues).subscribe({
                next: res => {
                    this.listQuestion = JSON.parse(JSON.stringify(res));
                    let idx = 0;
                    this.listQuestion.forEach(ques => {
                        if (ques.text_read.includes('src=')) {
                            ques.text_read = this.addDomain(ques.text_read, BASE_URL);
                        }
                        ques.child_ques.forEach(child => {
                            idx++;
                            child.selected = -1;
                            child.idx = idx;
                        })
                    })
                }
            })
            
        });
    }
    addDomain(html: string, domain: string) {
        return html.replace(
            /src="(?!https?:\/\/|\/\/)([^"]+)"/g,
            (match, path) => `src="${domain}${path}"`
        );
    }

    chooseQuestion(quesIdx: number) {
        const element = this.document.getElementById('ques-' + quesIdx);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    chooseAns(child: ChildQues, answer: number) {
        child.selected = answer;
        child.isCorrect = answer === child.correct_answer;
    }

    submit() {
        let dataSend: HistoryPractice = {
            content: {},
            total: 0,
            time: 0,
            correct: 0,
            part_id: this.part
        } as HistoryPractice;

        let summaryPractice: PracticeSummary = {
            done_questions: {},
            false_questions: {}
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
                }
            })
        });
        this.practiceService.savePracticeSummary(summaryPractice, dataSend).subscribe({
            next: res => {}
        })
    }
}
