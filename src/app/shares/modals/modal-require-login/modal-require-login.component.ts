import { Component } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-modal-require-login',
    imports: [
        ModalComponent
    ],
    templateUrl: './modal-require-login.component.html',
    styleUrl: './modal-require-login.component.css'
})
export class ModalRequireLoginComponent {
    constructor(
        protected commonService: CommonService,
        private router: Router
    ) { }

    close() {
        this.commonService.closeModal('modal-require-login');
    }

    login() {
        this.close();
        this.router.navigate(['/auth/login']);
    }
}
