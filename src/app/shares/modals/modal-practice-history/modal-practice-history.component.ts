import { Component, Input } from '@angular/core';
import { HistoryPractice } from '../../../common/interfaces/practice';
import { CommonService } from '../../services/common.service';
import { ModalComponent } from "../modal/modal.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modal-practice-history',
  imports: [ModalComponent, CommonModule, RouterLink],
  templateUrl: './modal-practice-history.component.html',
  styleUrl: './modal-practice-history.component.css'
})
export class ModalPracticeHistoryComponent {
  @Input() histories: HistoryPractice[] = [];
  @Input() partId: number = 1;

  constructor(protected readonly commonService: CommonService) {}
}
