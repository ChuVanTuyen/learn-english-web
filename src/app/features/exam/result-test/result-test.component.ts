import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { zip } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { TestService } from '../../../shares/services/test.service';
import { DetailTest, HistoryTest, IntroPart } from '../../../common/interfaces/exam';
import { partIntros } from '../../../shares/data/toeic';
import { ObjectKey } from '../../../common/interfaces/common';

@Component({
    selector: 'app-result-test',
    imports: [],
    templateUrl: './result-test.component.html',
    styleUrls: ['../detail-test/detail-test.component.css', './result-test.component.css']
})
export class ResultTestComponent {

    loading: boolean = false;
    testId: number = 0;
    historyId: number = 0;
    detailTest!: DetailTest;
    history!: HistoryTest;
    partIntros: ObjectKey<IntroPart> = partIntros;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private testService: TestService,
        @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            const ids = param.get('ids');
            const arrId = ids?.split('-');
            if (arrId?.length === 2) {
                this.testId = Number(arrId[0]);
                this.historyId = Number(arrId[1]);
                this.loading = true;
                zip(
                    this.testService.getDetailTest(this.testId),
                    this.testService.getDetailHistory(this.historyId)
                ).subscribe({
                    next: ([resTest, resHistory]) => {
                        this.loading = false;
                        this.detailTest = resTest;
                        this.history = resHistory;
                        this.handleHistory();
                    }
                });
            } else {
                this.router.navigate(['test']);
                return;
            }
        })
    }

    handleHistory() { // hàm sử lý để hiển thị kết quả
        let idx = 0;
        this.detailTest.skills.forEach((skill, idxSkill) => {
            skill.parts.forEach(part => {
                part.questions.forEach(ques => {
                    if (ques.text_read.includes('src=')) {
                        ques.text_read = this.addDomain(ques.text_read, 'http://localhost:3000/public/exam/test' + this.testId + '/image/');
                    }
                    ques.child_ques.forEach(child => {
                        child.idx = ++idx;
                        child.selected = this.history.detail[child.id];
                        child.isCorrect = child.selected === child.correct_answer;
                    });
                })
            })
        })
    }

    chooseQuestion(quesIdx: number) {
        const element = this.document.getElementById('ques-' + quesIdx);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    addDomain(html: string, domain: string) {
        return html.replace(
            /src="(?!https?:\/\/|\/\/)([^"]+)"/g,
            (match, path) => `src="${domain}${path}"`
        );
    }
}
