import { Component, effect } from '@angular/core';
import { ModalComponent } from "../modal/modal.component";
import { CommonService } from '../../services/common.service';
import { NoteService } from '../../services/note.service';
import { DataAddWord, Notebook } from '../../../common/interfaces/note';
import { BroadcasterService } from '../../services/broadcaster.service';
import { Word } from '../../../common/interfaces/dictionary';
import { InforUser } from '../../../common/interfaces/user';
@Component({
    selector: 'app-add-word-note',
    imports: [ModalComponent],
    templateUrl: './add-word-note.component.html',
    styleUrl: './add-word-note.component.css'
})
export class AddWordNoteComponent {

    loading: boolean = false;
    listNoteb: Notebook[] = [];
    word: Word | undefined;

    user: InforUser | undefined;

    constructor(
        protected readonly commonService: CommonService,
        private noteService: NoteService,
        private broadcaster: BroadcasterService
    ) {
        effect(() => {
            this.user = this.commonService.sUser();
            this.getListNote();
        });
    }

    ngOnInit() {
        this.getListNote();
        this.broadcaster.on<Word>('add-to-note').subscribe(word => {
            if(this.commonService.sUser()) {
                this.commonService.openModal('modal-add-to-note');
                this.word = word;
            } else {
                this.commonService.showNotify('Bạn cần đăng nhập để sử dụng tính năng này', 'warning');
            }
            
        });

        this.broadcaster.on<Notebook[]>('update-list-note').subscribe(list => {
            this.listNoteb = list;
        })
    }

    getListNote() {
        if(this.commonService.getEnvironment() === 'client') {
            if(this.user) {
                this.noteService.getUserNote().subscribe({
                    next: res => {
                        this.listNoteb = res;
                    }
                });
            } else {
                this.listNoteb = [];
            }
        }
    }
    confirmAdd(note: Notebook) {
        if(this.word) {
            const data: DataAddWord = {
                word: this.word.word,
                pronounce: this.word.pronounce,
                mean: this.word.content[0].kind_content[0].means,
                note: ''
            }
            this.loading = true;
            this.noteService.addWordToNote(data, note.id).subscribe({
                next: res => {
                    this.loading = false;
                    this.commonService.showNotify('Thêm từ vào ' + note.name + 'thành công', 'success');
                },
                error: err => {
                    this.loading = false;
                    this.commonService.showNotify('Đã có lỗi xảy ra', 'danger');
                }
            })
        }
    }
}
