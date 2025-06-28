import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shares/components/header/header.component';
import { FooterComponent } from "./shares/components/footer/footer.component";
import { CommonService } from './shares/services/common.service';
import { NotifyComponent } from "./shares/components/notify/notify.component";
import { ModalRequireLoginComponent } from "./shares/modals/modal-require-login/modal-require-login.component";

@Component({
    selector: 'app-root',
    imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NotifyComponent,
    ModalRequireLoginComponent
],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

    url: string = '';
    timeTest: boolean = false;

    constructor(
        private commonService: CommonService,
        private router: Router
    ) { }

    ngOnInit() {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.url = val.url;
                this.handleUrls();
            }
        });
    }

    test() {
        this.commonService.openModal('modal-test');
    }

    handleUrls() {
        this.timeTest = this.url.includes('exam/detail') || this.url.includes('doing');
    }
}
