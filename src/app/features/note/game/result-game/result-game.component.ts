import { Component, Input } from '@angular/core';
import { ResultGame, WordNotebook } from '../../../../common/interfaces/note';
import { CommonService } from '../../../../shares/services/common.service';
import { CommonModule } from '@angular/common';
import { DatatimePipe } from "../../../../common/pipes/datatime.pipe";

@Component({
    selector: 'app-result-game',
    imports: [CommonModule, DatatimePipe],
    templateUrl: './result-game.component.html',
    styleUrl: './result-game.component.css'
})
export class ResultGameComponent {

    @Input() words: WordNotebook[] = [];
    @Input() result!: ResultGame;
    constructor(
        private commonService: CommonService
    ) {}

    ngOnInit() {

    }
}
