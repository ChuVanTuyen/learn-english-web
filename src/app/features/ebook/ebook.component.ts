import { Component } from '@angular/core';
import { BASE_URL_PUBLIC } from '../../shares/data/config';
import { EbookService } from '../../shares/services/ebook.service';
import { Ebook } from '../../common/interfaces/ebook';
import { CommonService } from '../../shares/services/common.service';

@Component({
    selector: 'app-ebook',
    imports: [],
    templateUrl: './ebook.component.html',
    styleUrl: './ebook.component.css'
})
export class EbookComponent {

    originUrl = BASE_URL_PUBLIC + 'public/exam/ebook/';
    list: Ebook[] = []

    constructor(
        private ebookService: EbookService,
        private commonService: CommonService
    ) {}

    ngOnInit() {
        this.ebookService.getListBook().subscribe({
            next: res => {
                this.list = res;
            }
        })
    }

    ngAfterViewInit() {
        this.commonService.scrollToTop();
    }
}
