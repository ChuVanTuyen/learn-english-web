import { Component } from '@angular/core';
import { CommonService } from '../../../shares/services/common.service';
import { NoteService } from '../../../shares/services/note.service';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { DetailNotebook, WordNotebook } from '../../../common/interfaces/note';
import { DatePipe } from '@angular/common';
import { AddWordComponent } from "../add-word/add-word.component";
import { BroadcasterService } from '../../../shares/services/broadcaster.service';

@Component({
    selector: 'app-detail-note',
    imports: [DatePipe, RouterLink, AddWordComponent],
    templateUrl: './detail-note.component.html',
    styleUrl: './detail-note.component.css'
})
export class DetailNoteComponent {

    idNote: number = 0;
    isAutoNote: boolean = false;
    detailNote: DetailNotebook | undefined;

    constructor(
        protected readonly commonService: CommonService,
        private noteService: NoteService,
        private route: ActivatedRoute,
        private router: Router,
        private broadcaster: BroadcasterService,
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            this.isAutoNote = this.router.url.includes('auto');
            if(id) {
                this.idNote = id;
                if(this.commonService.getEnvironment() === 'client') {
                    this.noteService.getDetailNote(this.idNote).subscribe({
                        next: res => {
                            this.detailNote = res;
                            this.noteService.detailNote = res;
                        }
                    })
                }
            }
        })
    }

    ngAfterViewInit() {
        // this.commonService.openModal('modal-add-word');
    }

    handleActionWord(action: string, word: WordNotebook, e: Event) {
        e.stopPropagation();
        if(action === 'delete') {
            this.confirmDeleteWord(word.id);
        } else if(action === 'edit') {
            this.broadcaster.broadcast('add-word-to-note', {noteId: this.detailNote!.id, word, type: 'edit'})
        }
    }

    confirmDeleteWord(id: number) {
        this.noteService.deleteWord(id).subscribe({
            next: res => {
                this.commonService.showNotify('Xóa từ thành công', 'success');
            },
            error: err => {
                this.commonService.showNotify('Đã có lỗi xảy ra', 'danger');
            }
        })
    }

    openAddWord() {
        console.log('run');
        this.broadcaster.broadcast('add-word-to-note', {noteId: this.detailNote!.id, type: 'add'});
    }
}
