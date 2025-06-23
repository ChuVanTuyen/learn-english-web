import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { NoteService } from '../../shares/services/note.service';
import { Notebook } from '../../common/interfaces/note';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrl: './note.component.css',
    imports: [NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {

    sDefaultNotes: WritableSignal<Notebook[]> = signal([]);

    constructor(
        private noteService: NoteService
    ) {}

    ngOnInit() {
        this.noteService.getDefaultNotebook().subscribe(res => {
            this.sDefaultNotes.set(res);
        });
    }
}
