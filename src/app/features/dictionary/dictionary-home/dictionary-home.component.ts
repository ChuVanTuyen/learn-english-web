import { Component } from '@angular/core';
import { TIPS } from '../../../shares/data/dictionary';
import { Tip } from '../../../common/interfaces/dictionary';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dictionary-home',
    imports: [RouterLink],
    templateUrl: './dictionary-home.component.html',
    styleUrl: './dictionary-home.component.css'
})
export class DictionaryHomeComponent {

    tips: Tip[] = TIPS;
    tipIdx: number = Math.floor(Math.random() * (TIPS.length - 1));
    constructor() {}
}
