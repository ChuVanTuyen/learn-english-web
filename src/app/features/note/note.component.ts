import { Component, signal, WritableSignal } from '@angular/core';
import { NoteService } from '../../shares/services/note.service';
import { Notebook } from '../../common/interfaces/note';
import { NgTemplateOutlet } from '@angular/common';
import { CommonService } from '../../shares/services/common.service';
import { AddNoteComponent } from "./add-note/add-note.component";
import { EditNoteComponent } from "./edit-note/edit-note.component";
import { ModalComponent } from "../../shares/modals/modal/modal.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: [
        '../../shares/styles/button.css',
        './note.component.css'
    ],
    imports: [NgTemplateOutlet, AddNoteComponent, EditNoteComponent, ModalComponent, RouterLink]
})
export class NoteComponent {

    loadDelete: boolean = false;
    sDefaultNotes: WritableSignal<Notebook[]> = signal([]);
    notes: Notebook[] = [];
    idxAction: number = 0;

    constructor(
        private noteService: NoteService,
        protected readonly commonService: CommonService
    ) {}

    ngOnInit() {
        this.noteService.getDefaultNotebook().subscribe(res => {
            this.sDefaultNotes.set(res);
        });

        if(this.commonService.getEnvironment() === 'client') {
            this.noteService.getUserNote().subscribe({
                next: res => {
                    this.notes = res;
                }
            })
        }
    }

    ngAfterViewInit() {
        // this.commonService.openModal('modal-create-notebook');
    }

    handlePreAddNote() {
        if(!this.commonService.sUser()) {
            this.commonService.openModal('modal-require-login');
        } else {
            this.commonService.openModal('modal-create-notebook');
        }
    }

    handleAction(action: string, idx: number, e: Event) {
        e.stopPropagation();
        this.idxAction = idx;
        if(action === 'edit') {
            this.commonService.openModal('modal-edit-notebook');
        } else if(action === 'delete') {
            this.commonService.openModal('modal-confirm-delete');
        }
    }

    confirmDelete(id: number) {
        this.loadDelete = true;
        this.noteService.deleteNotebook(id).subscribe({
            next: (res) => {
                this.loadDelete = false;
                this.commonService.showNotify('Xóa sổ tay thành công', 'success');
                this.commonService.closeModal('modal-confirm-delete');
            },
            error: (err) => {
                this.loadDelete = false;
                this.commonService.showNotify('Đã có lỗi xảy ra', 'danger');
            }
        })
    } 
}
