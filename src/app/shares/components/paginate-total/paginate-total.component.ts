import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-paginate-total',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './paginate-total.component.html',
  styleUrl: './paginate-total.component.css'
})
export class PaginateTotalComponent {
    @Input() total: number = 0;
    @Input() limit: number = 20;
    @Input() page: number = 0;
    @Input() direction: string = 'horizontal';
    @Output() paginateEvent = new EventEmitter();
    indexPagination: number = 0;
    showBtnPaginationPreviousLast: boolean = false;
    showBtnPaginationNextLast: boolean = true;
    listIndex: any;
    maxSize = 10;
    quickMove: number | undefined;

    constructor(
        private paginateService: PaginationService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.page) {
            this.changePagination(this.page)
        } else {
            this.indexPagination = 0;
            this.listIndex = this.paginateService.createPageArray(this.indexPagination + 1, this.maxSize, this.total, this.limit);
        }
    }

    changePagination(index: number) {
        if (index === 0) {
            this.indexPagination = 0;
        } else {
            this.indexPagination = index - 1;
        }
        this.listIndex = this.paginateService.createPageArray(this.indexPagination + 1, this.maxSize, this.total, this.limit);
        if (this.indexPagination === 0) {
            this.showBtnPaginationPreviousLast = false;
            this.showBtnPaginationNextLast = true;
        }
        else if (this.indexPagination > 0 && (this.listIndex === undefined || this.indexPagination !== this.listIndex[this.listIndex.length -1].value - 1)) {
            this.showBtnPaginationPreviousLast = true;
        }
        else {
            this.showBtnPaginationPreviousLast = true;
            this.showBtnPaginationNextLast = false;
        }
        this.paginateEvent.emit(this.indexPagination + 1);
    }

    goToPage() {
        if(this.quickMove) {
            if(this.quickMove <= this.listIndex[this.listIndex.length-1].label) {
                this.indexPagination = this.quickMove - 1;
                this.paginateEvent.emit(this.quickMove);
            } else {
                this.quickMove = 1;
            }
        }
    }

    stepUp() {
        if(!this.quickMove) this.quickMove = 0;
        if(this.quickMove < this.listIndex[this.listIndex.length-1].label) this.quickMove +=1;
    }

    stepDown() {
        if(!this.quickMove) this.quickMove = 1;
        if(this.quickMove > 1) this.quickMove -=1;
    }
}
