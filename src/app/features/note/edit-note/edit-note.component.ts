import { Component, Input } from '@angular/core';
import { ModalComponent } from '../../../shares/modals/modal/modal.component';
import { CommonService } from '../../../shares/services/common.service';
import { NoteService } from '../../../shares/services/note.service';
import { FormsModule } from '@angular/forms';
import { Notebook } from '../../../common/interfaces/note';

@Component({
    selector: 'app-edit-note',
    imports: [
        ModalComponent,
        FormsModule
    ],
    templateUrl: './edit-note.component.html',
    styleUrl: './edit-note.component.css'
})
export class EditNoteComponent {
    
    submitted: boolean = false;
    loading: boolean = false;
    nameNote: string = '';
    notiErr: string = '';

    idNote: number = 0;

    @Input() set notebook(data: Notebook) {
        this.idNote = data.id;
        this.nameNote = data.name;
    };

    constructor(
        private commonService: CommonService,
        private noteService: NoteService
    ) {}

    changeInput() {
        this.notiErr = !this.nameNote.trim() ? 'Vui lòng nhập tên sổ tay' : '';
    }

    update() {
        if(this.loading) return;
        this.submitted = true;
        if(!this.nameNote.trim()) {
            this.notiErr = 'Vui lòng nhập tên sổ tay';
            return;
        }
        this.loading = true;
        this.noteService.updateNotebook(this.nameNote.trim(), this.idNote).subscribe({
            next: res => {
                this.loading = false;
                this.close();
                this.commonService.showNotify('Sửa tên sổ tay thành công', 'success');
            },
            error: err => {
                this.loading = false;
                this.commonService.showNotify('Đã có lỗi xảy ra', 'danger');
            }
        })
    }

    close() {
        this.clear();
        this.commonService.closeModal('modal-edit-notebook');
    }

    clear() {
        this.nameNote = '';
        this.submitted = false;
        this.notiErr = '';
    }
}
