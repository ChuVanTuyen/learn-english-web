import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PracticeService } from '../../../shares/services/practice.service';
import { ChildQues, Question } from '../../../common/interfaces/exam';
import { SafePipe } from "../../../common/pipes/safe.pipe";
import { BASE_URL } from '../../../shares/data/config';
import { DOCUMENT, JsonPipe } from '@angular/common';
import { HistoryPractice, SummaryPractice } from '../../../common/interfaces/practice';

@Component({
    selector: 'app-doing-practice',
    imports: [SafePipe],
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
        private practiceService: PracticeService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            this.part = Number(param.get('part'));
            this.practiceService.getQuestions(this.part, 10).subscribe({
                next: res => {
                    console.log(res);
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

        let summaryPractice: SummaryPractice = {
            done_question_ids: [],
            false_question_ids: {}
        }
        this.listQuestion.forEach(ques => {
            ques.child_ques.forEach(child => {
                dataSend.content[child.id] = child.selected;
                dataSend.total ++;
                if(child.isCorrect) {
                    dataSend.correct ++;
                }
                if(!summaryPractice.done_question_ids.includes(ques.id)) {
                    summaryPractice.done_question_ids.push(ques.id);
                }
                if(!ques.child_ques.every(c => c.isCorrect)) {
                    if(!summaryPractice.false_question_ids[this.part]) {
                        summaryPractice.false_question_ids[this.part] = [ques.id];
                    } else {
                        if(!summaryPractice.false_question_ids[this.part].includes(ques.id)) {
                            summaryPractice.false_question_ids[this.part].push(ques.id);
                        }
                    }
                }
            })
        });
        console.log(dataSend, summaryPractice);
    }
}
