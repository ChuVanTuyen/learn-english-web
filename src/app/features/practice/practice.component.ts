import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LIST_PART } from '../../shares/data/practice';
import { CommonService } from '../../shares/services/common.service';

@Component({
    selector: 'app-practice',
    imports: [],
    templateUrl: './practice.component.html',
    styleUrl: './practice.component.css'
})
export class PracticeComponent {
    listPart = LIST_PART;

    constructor(
        private commonService: CommonService,
        private router: Router
    ) {}

    ngAfterViewInit() {
        this.commonService.scrollToTop();
    }

    openPart(url: string) {
        if(this.commonService.sUser()) {
            this.router.navigate(['/practice/' + url]);
        } else {
            this.commonService.openModal('modal-require-login');
        }
    }
}
