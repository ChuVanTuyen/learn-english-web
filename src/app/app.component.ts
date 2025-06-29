import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shares/components/header/header.component';
import { FooterComponent } from "./shares/components/footer/footer.component";
import { CommonService } from './shares/services/common.service';
import { NotifyComponent } from "./shares/components/notify/notify.component";
import { ModalRequireLoginComponent } from "./shares/modals/modal-require-login/modal-require-login.component";
import { AddWordNoteComponent } from "./shares/modals/add-word-note/add-word-note.component";
import { BroadcasterService } from './shares/services/broadcaster.service';
import { ModalSearchComponent } from "./shares/modals/modal-search/modal-search.component";

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        NotifyComponent,
        ModalRequireLoginComponent,
        AddWordNoteComponent,
        ModalSearchComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

    url: string = '';
    timeTest: boolean = false;
    selectedText = '';
    showButton = false;
    buttonTop = 0;
    buttonLeft = 0;

    @HostListener('document:mouseup', [])
    onMouseUp() {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text) {
            this.selectedText = text;
            const range = selection?.getRangeAt(0);
            const rect = range?.getBoundingClientRect();

            if (rect) {
                this.buttonTop = rect.top + window.scrollY - 40;
                this.buttonLeft = rect.left + window.scrollX;
                this.showButton = true;
            }
        } else {
            this.showButton = false;
        }
    }

    constructor(
        private commonService: CommonService,
        private router: Router,
        private broadcaster: BroadcasterService
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

    searchSelectedText() {
        this.broadcaster.broadcast('open-modal-search', this.selectedText);
        this.showButton = false;
    }
}
