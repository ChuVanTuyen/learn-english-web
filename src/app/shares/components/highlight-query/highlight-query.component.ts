import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    imports: [],
    selector: 'highlight-query',
    templateUrl: './highlight-query.component.html',
    styleUrls: ['./highlight-query.component.css']
})
export class HighlightQueryComponent {
    @Input() query: string = '';
    @Input() showDetail: boolean = false;
    @Input() quickSearch: boolean = false;
    htmlShow: string = '';

    @Input()
    set data(value: string) {
        if(!value) return;
        this.htmlShow = this.checkMatch(this.query, value);
    }

    constructor() { }

    checkMatch(query: string, str: string) {
        query = query.trim();
        str = str.trim();
        const pattern = new RegExp(query, "gi");
        const matches = str.match(pattern);
        const tag = `<span class="d-inline-block${this.showDetail ? ' highlight-active' : ''}${this.quickSearch ? ' quick-search' : ''}">`;
        const newMatch = matches?.map((item, i) => {
            str = str.replace(item, `_*${i}*_`);
            return item.split(' ').reduce((html, item) => {
                return html = html + `${tag}${item}</span>`;
            }, '');
        });
        let newStr = str.split(' ').reduce((html, item) =>{
            return html += `${tag}${item}</span> `;
        }, '');
        newMatch?.forEach((item, i) => {
            newStr = newStr.replace(`_*${i}*_`, `<span class="text-[#e13a33] font-medium">${item}</span>`);
        });
        return newStr;
    }

    ngOnDestroy() {
        this.query = '';
    }
}