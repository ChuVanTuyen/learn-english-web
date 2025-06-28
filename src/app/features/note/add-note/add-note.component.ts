import { Component } from '@angular/core';
import { ModalComponent } from '../../../shares/modals/modal/modal.component';
import { CommonService } from '../../../shares/services/common.service';
import { NoteService } from '../../../shares/services/note.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-add-note',
    imports: [
        ModalComponent,
        FormsModule
    ],
    templateUrl: './add-note.component.html',
    styleUrl: './add-note.component.css'
})
export class AddNoteComponent {

    submitted: boolean = false;
    loading: boolean = false;
    nameNote: string = '';
    notiErr: string = '';

    constructor(
        private commonService: CommonService,
        private noteService: NoteService
    ) {}

    changeInput() {
        this.notiErr = !this.nameNote.trim() ? 'Vui lòng nhập tên sổ tay' : '';
    }

    add() {
        console.log('333');
        if(this.loading) return;
        this.submitted = true;
        if(!this.nameNote.trim()) {
            this.notiErr = 'Vui lòng nhập tên sổ tay';
            return;
        }
        this.loading = true;
        this.noteService.createNotebook(this.nameNote.trim()).subscribe({
            next: res => {
                this.loading = false;
                this.close();
                this.commonService.showNotify('Tạo sổ tay mới thành công', 'success');
            },
            error: err => {
                this.loading = false;
                this.commonService.showNotify('Đã có lỗi xảy ra', 'danger');
            }
        })
    }

    close() {
        this.clear();
        this.commonService.closeModal('modal-create-notebook');
    }

    clear() {
        this.nameNote = '';
        this.submitted = false;
        this.notiErr = '';
    }
}
