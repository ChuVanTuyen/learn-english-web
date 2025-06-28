import { Component, EventEmitter, Output } from '@angular/core';
import { ModalComponent } from "../../../shares/modals/modal/modal.component";
import { NoteService } from '../../../shares/services/note.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BroadcasterService } from '../../../shares/services/broadcaster.service';
import { CommonService } from '../../../shares/services/common.service';

@Component({
    selector: 'app-add-word',
    imports: [ModalComponent, ReactiveFormsModule],
    templateUrl: './add-word.component.html',
    styleUrl: './add-word.component.css'
})
export class AddWordComponent {

    loading: boolean = false;
    submitted: boolean = false;
    noteId: number = 0;
    wordId: number = 0;
    dataAddWord!: FormGroup;
    type: string = 'add';

    constructor(
        private noteService: NoteService,
        private broadcaster: BroadcasterService,
        private commonService: CommonService
    ) {}

    ngOnInit() {
        this.dataAddWord = new FormGroup({
            word: new FormControl('', [Validators.required]),
            pronounce: new FormControl(''),
            kind: new FormControl(''),
            mean: new FormControl('', [Validators.required]),
            note: new FormControl(''),
        });

        this.broadcaster.on('add-word-to-note').subscribe((data: any) => {
            this.noteId = data.noteId;
            this.type = data.type;
            this.wordId = data.word ? data.word.id: 0;
            if(data.type === 'edit') {
                this.dataAddWord.setValue({
                    word: data.word.word,
                    pronounce: data.word.pronounce,
                    kind: data.word.pronounce,
                    mean: data.word.mean,
                    note: data.word.note,
                })
            }
            this.commonService.openModal('modal-add-word');
        })
    }


    submit() {
        this.submitted = true;
        if (this.loading || this.dataAddWord.invalid) return;
        if(this.type === 'add') {
            this.addWord();
        } else if(this.type === 'edit') {
            this.editWord();
        }
    }

    addWord() {
        this.loading = true;
        this.noteService.addWordToNote(this.dataAddWord.value, this.noteId).subscribe({
            next: res => {
                this.loading = false;
                this.commonService.showNotify('Thêm từ thành công', 'success');
            },
            error: res => {
                this.loading = false;
                this.commonService.showNotify('Đã có lỗi cảy ra', 'danger');
            }
        })
    }


    editWord() {
        this.loading = true;
        this.noteService.editWordNote(this.dataAddWord.value, this.wordId).subscribe({
            next: res => {
                this.loading = false;
                this.commonService.showNotify('Sửa từ thành công', 'success');
            },
            error: res => {
                this.loading = false;
                this.commonService.showNotify('Đã có lỗi cảy ra', 'danger');
            }
        })
    }
}
