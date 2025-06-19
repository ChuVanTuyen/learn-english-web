import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../../shares/services/test.service';
import { ChildQues, DetailTest, HistoryTest, IntroPart } from '../../../common/interfaces/exam';
import { CommonService } from '../../../shares/services/common.service';
import { DOCUMENT } from '@angular/common';
import { convertScore, partIntros } from '../../../shares/data/toeic';
import { ObjectKey } from '../../../common/interfaces/common';
import { SafePipe } from "../../../common/pipes/safe.pipe";
import { BASE_URL } from '../../../shares/data/config';

@Component({
    selector: 'app-detail-test',
    imports: [SafePipe],
    templateUrl: './detail-test.component.html',
    styleUrls: ['../../../shares/styles/button.css', './detail-test.component.css']
})
export class DetailTestComponent {

    loading: boolean = false;

    testId: number = 0;
    detailTest!: DetailTest;
    skillActive: number = 0;
    partActive: number = 0;
    quesActive: number = 0;

    partIntros: ObjectKey<IntroPart> = partIntros;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private testService: TestService,
        private commonService: CommonService,
        @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            const id = Number(param.get('id'));
            if (id) {
                this.testId = id;
                this.loading = true;
                this.testService.getDetailTest(id).subscribe({
                    next: res => {
                        this.detailTest = res;
                        this.loading = false;
                        this.handleTest();
                        console.log(this.detailTest);
                    }
                })
            } else {
                this.router.navigate(['test']);
                return;
            }
        })
    }

    handleTest() {
        let idx = 0;
        this.detailTest.skills.forEach(skill => {
            skill.parts.forEach(part => {
                part.questions.forEach(ques => {
                    if (ques.text_read.includes('src=')) {
                        ques.text_read = this.addDomain(ques.text_read, BASE_URL);
                    }
                    ques.child_ques.forEach(child => {
                        idx++;
                        child.selected = -1;
                        child.idx = idx;
                    })
                })
            })
        });
    }


    chooseAns(ques: ChildQues, answer: number) {
        ques.selected = answer;
        ques.isCorrect = answer === ques.correct_answer;
    }

    nextPart() {
        if (this.detailTest) {
            if (this.partActive < this.detailTest.skills[this.skillActive].parts.length - 1) {
                this.partActive++;
            } else {
                if (this.skillActive < this.detailTest.skills.length - 1) {
                    this.skillActive++;
                    this.partActive = 0;
                }
            }
            this.commonService.scrollToTop();
        }
    }

    chooseQuestion(quesIdx: number) {
        const element = this.document.getElementById('ques-' + quesIdx);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    submit() {
        let result: HistoryTest = {
            detail: {},
            correct_listen: 0,
            correct_read: 0,
            score: 0,
            total_time: 0
        }
        this.detailTest!.skills.forEach((skill, skillIdx) => {
            skill.parts.forEach(part => {
                part.questions.forEach(ques => {
                    ques.child_ques.forEach(child => {
                        result.detail[child.id] = child.selected;
                        if (child.isCorrect) {
                            if (skillIdx) {
                                result.correct_read++;
                            } else {
                                result.correct_listen++;
                            }
                        }
                    });
                })
            })
        })
        result.score = convertScore[result.correct_listen].listen + convertScore[result.correct_read].read;
        console.log(result);
    }

    addDomain(html: string, domain: string) {
        return html.replace(
            /src="(?!https?:\/\/|\/\/)([^"]+)"/g,
            (match, path) => `src="${domain}${path}"`
        );
    }
} 
