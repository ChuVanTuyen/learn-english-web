import { Component, signal, WritableSignal } from '@angular/core';
import { Test } from '../../common/interfaces/exam';
import { Router, RouterLink } from '@angular/router';
import { TestService } from '../../shares/services/test.service';
import { ModalHistoriesComponent } from "../../shares/modals/modal-histories/modal-histories.component";
import { CommonService } from '../../shares/services/common.service';

@Component({
    selector: 'app-exam',
    imports: [RouterLink, ModalHistoriesComponent],
    templateUrl: './exam.component.html',
    styleUrls: [
        './exam.component.css',
        '../../shares/styles/progress.css',
        '../../shares/styles/button.css'
    ]
})
export class ExamComponent {

    listTest: Test[] = [];
    idxHistory:  number = 0;

    constructor(
        private testService: TestService,
        private commonService: CommonService,
        private router: Router
    ) {}

    ngOnInit() {
        this.testService.getListExamAndHistory().subscribe(res => {
            this.listTest = res;
        })
    }

    openModalHistory(idx: number) {
        this.idxHistory = idx;
        setTimeout(() => {
            this.commonService.openModal('modal-histories');
        }, 100)
    }

    ngAfterViewInit() {
        this.commonService.scrollToTop();
    }

    openExam(id: number) {
        if(this.commonService.sUser()) {
            this.router.navigate(['/exam/detail/' + id]);
        } else {
            this.commonService.openModal('modal-require-login');
        }
    }
}
