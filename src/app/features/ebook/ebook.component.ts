import { Component } from '@angular/core';
import { BASE_URL_PUBLIC } from '../../shares/data/config';
import { EbookService } from '../../shares/services/ebook.service';
import { Ebook } from '../../common/interfaces/ebook';

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
        private ebookService: EbookService
    ) {}

    ngOnInit() {
        this.ebookService.getListBook().subscribe({
            next: res => {
                this.list = res;
            }
        })
    }
}
