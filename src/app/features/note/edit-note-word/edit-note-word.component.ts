import { Component, EventEmitter, Output } from '@angular/core';
import { ModalComponent } from "../../../shares/modals/modal/modal.component";
import { CommonService } from '../../../shares/services/common.service';
import { NoteService } from '../../../shares/services/note.service';
import { FormsModule } from '@angular/forms';
import { BroadcasterService } from '../../../shares/services/broadcaster.service';
import { WordNotebook } from '../../../common/interfaces/note';

@Component({
    selector: 'app-edit-note-word',
    imports: [ModalComponent, FormsModule],
    templateUrl: './edit-note-word.component.html',
    styleUrl: './edit-note-word.component.css'
})
export class EditNoteWordComponent {

    submitted: boolean = false;
    loading: boolean = false;
    noteWord: string = '';

    idNote: number = 0;
    word: WordNotebook | undefined;

    @Output() changeWord = new EventEmitter();

    constructor(
        private commonService: CommonService,
        private noteService: NoteService,
        private broadcaster: BroadcasterService
    ) {}

    ngOnInit() {
        this.broadcaster.on<WordNotebook>('change-note-word').subscribe(word => {
            this.word = word;
            this.noteWord = word.note ? word.note : '';
            this.commonService.openModal('modal-edit-note-word');
        })
    }

    close() {
        this.clear();
        this.commonService.closeModal('modal-edit-note-word');
    }

    update() {
        if(this.loading) return;
        this.submitted = true;
        this.loading = true;
        if(this.word) {
            let dataUpdate = {
                word: this.word.word,
                pronounce: this.word.pronounce,
                mean: this.word.mean,
                note: this.noteWord.trim(),
            }
            this.noteService.editWordNote(dataUpdate, this.word.id).subscribe({
                next: res => {
                    this.loading = false;
                    this.close();
                    this.changeWord.emit();
                    this.commonService.showNotify('Thay đổi ghi chú thành công', 'success');
                },
                error: err => {
                    this.loading = false;
                    this.commonService.showNotify('Đã có lỗi xảy ra', 'danger');
                }
            })
        }
    }

    clear() {
        this.noteWord = '';
        this.submitted = false;
    }
}
