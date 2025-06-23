import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LIST_PART } from '../../shares/data/practice';

@Component({
    selector: 'app-practice',
    imports: [RouterLink],
    templateUrl: './practice.component.html',
    styleUrl: './practice.component.css'
})
export class PracticeComponent {
    listPart = LIST_PART;
}
