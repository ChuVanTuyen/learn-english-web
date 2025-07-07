import { Component } from '@angular/core';
import { CommonService } from '../../../shares/services/common.service';
import { NoteService } from '../../../shares/services/note.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DetailNotebook, WordNotebook } from '../../../common/interfaces/note';
import { DatePipe, SlicePipe } from '@angular/common';
import { AddWordComponent } from "../add-word/add-word.component";
import { BroadcasterService } from '../../../shares/services/broadcaster.service';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../../shares/services/audio.service';
import { PaginateTotalComponent } from "../../../shares/components/paginate-total/paginate-total.component";
import { combineLatest } from 'rxjs';
import { EditNoteWordComponent } from "../edit-note-word/edit-note-word.component";

@Component({
    selector: 'app-detail-note',
    imports: [DatePipe, RouterLink, AddWordComponent, FormsModule, PaginateTotalComponent, SlicePipe, EditNoteWordComponent],
    templateUrl: './detail-note.component.html',
    styleUrl: './detail-note.component.css'
})
export class DetailNoteComponent {

    loading: boolean = false;
    idNote: number = 0;
    page: number = 0;
    limit: number = 15;
    detailNote: DetailNotebook | undefined;
    query: string = '';
    listWords: WordNotebook[] = [];

    constructor(
        protected readonly commonService: CommonService,
        private noteService: NoteService,
        private route: ActivatedRoute,
        private router: Router,
        private broadcaster: BroadcasterService,
        protected readonly audioService: AudioService
    ) {}

    ngOnInit() {
        combineLatest([
            this.route.paramMap,
            this.route.queryParams
        ]).subscribe(([params, query]) => {
            this.page = Number(query['page']) ? Number(query['page']) : 1
            const id = Number(params.get('id'));
            if(id) {
                this.idNote = id;
                if(this.commonService.getEnvironment() === 'client') {
                    this.loading = true;
                    this.noteService.getDetailNote(this.idNote).subscribe({
                        next: res => {
                            this.loading = false;
                            this.detailNote = res;
                            this.noteService.detailNote = res;
                            this.listWords = this.detailNote.words;
                        }
                    })
                }
            }
        })
    }

    paginateEvent(page: number) {
        this.router.navigate(['/notebook/detail/' + this.idNote], {queryParams: { page }});
        this.commonService.scrollToTop();
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
        this.broadcaster.broadcast('add-word-to-note', {noteId: this.detailNote!.id, type: 'add'});
    }

    openModalSearch(query: string) {
        this.broadcaster.broadcast('open-modal-search', query);
    }
    
    filterSearch() {
        if(this.detailNote) {
            this.listWords = this.detailNote.words.filter(w => w.word.trim().includes(this.query.trim()));
        }
    }

    playAudio(word: string, e: Event) {
        e.stopPropagation();
        this.audioService.playAudio(word);
    }

    changeNoteWord(word: WordNotebook, e: Event) {
        e.stopPropagation();
        this.broadcaster.broadcast('change-note-word', word);
    }

    updateWord() {
        this.detailNote = this.noteService.detailNote;
        if(this.detailNote) {
            this.listWords = JSON.parse(JSON.stringify(this.detailNote.words));
        }
    }
}
