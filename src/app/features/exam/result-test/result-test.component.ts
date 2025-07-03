import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { zip } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TestService } from '../../../shares/services/test.service';
import { DetailTest, HistoryTest, IntroPart } from '../../../common/interfaces/exam';
import { partIntros, TOTAL_QUES } from '../../../shares/data/toeic';
import { ObjectKey } from '../../../common/interfaces/common';
import { SafePipe } from "../../../common/pipes/safe.pipe";
import { BASE_URL_PUBLIC } from '../../../shares/data/config';
import { ResultGame } from '../../../common/interfaces/note';
import { DatatimePipe } from "../../../common/pipes/datatime.pipe";
import { CommonService } from '../../../shares/services/common.service';

@Component({
    selector: 'app-result-test',
    imports: [
    SafePipe,
    RouterLink,
    CommonModule,
    DatatimePipe
],
    templateUrl: './result-test.component.html',
    styleUrls: [
        '../../../shares/styles/progress.css',
        '../detail-test/detail-test.component.css', 
        './result-test.component.css'
    ]
})
export class ResultTestComponent {

    loading: boolean = false;
    testId: number = 0;
    historyId: number = 0;
    detailTest!: DetailTest;
    history!: HistoryTest;
    resultCard!: ResultGame;
    correctPart: number[] = [0,0,0,0,0,0,0];
    totalQues = TOTAL_QUES;
    partIntros: ObjectKey<IntroPart> = partIntros;
    baseUrl: string = BASE_URL_PUBLIC;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private testService: TestService,
        protected readonly commonService: CommonService,
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

    ngAfterViewInit() {
        this.commonService.scrollToTop();
    }

    handleHistory() { // hàm sử lý để hiển thị kết quả
        let idx = 0;
        this.detailTest.skills.forEach((skill, idxSkill) => {
            skill.parts.forEach((part, idxPart) => {
                part.questions.forEach(ques => {
                    if (ques.text_read.includes('src=')) {
                        ques.text_read = this.addDomain(ques.text_read, this.baseUrl);
                    }
                    ques.child_ques.forEach(child => {
                        child.idx = ++idx;
                        child.selected = this.history.content[child.id];
                        child.isCorrect = child.selected === child.correct_answer;
                        if(child.isCorrect) {
                            this.correctPart[4*idxSkill+idxPart] ++;
                        }
                    });
                })
            })
        });
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
