import { Component, Input } from '@angular/core';
import { ModalComponent } from "../../components/modal/modal.component";
import { HistoryTest } from '../../../common/interfaces/exam';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-modal-histories',
  imports: [
    ModalComponent,
    DatePipe,
    RouterLink
  ],
  templateUrl: './modal-histories.component.html',
  styleUrl: './modal-histories.component.css'
})
export class ModalHistoriesComponent {
  @Input() histories: HistoryTest[] = [];
  @Input() examId: number = 1;

  constructor(protected readonly commonService: CommonService) {}
}
