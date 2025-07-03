import { Component, Input } from '@angular/core';
import { ResultGame } from '../../../common/interfaces/note';
import { CommonModule } from '@angular/common';
import { DatatimePipe } from "../../../common/pipes/datatime.pipe";

@Component({
    selector: 'app-result-card',
    imports: [
        CommonModule,
        DatatimePipe
    ],
    templateUrl: './result-card.component.html',
    styleUrl: './result-card.component.css'
})
export class ResultCardComponent {
    
    @Input() result!: ResultGame;
    constructor() {}
}
