import { Component } from '@angular/core';
import { Test } from '../../common/interfaces/exam';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exam',
  imports: [RouterLink],
  templateUrl: './exam.component.html',
  styleUrls: [
    './exam.component.css',
    '../../shares/styles/progress.css',
    '../../shares/styles/button.css'
  ]
})
export class ExamComponent {
  listTest: Test[] = [
    {
      "id": 1,
      "name": "Đề số 1",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 2,
      "name": "Đề số 2",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 3,
      "name": "Đề số 3",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 4,
      "name": "Đề số 4",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 5,
      "name": "Đề số 5",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 6,
      "name": "Đề số 6",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 7,
      "name": "Đề số 7",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 8,
      "name": "Đề số 8",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 9,
      "name": "Đề số 9",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 10,
      "name": "Đề số 10",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 11,
      "name": "Đề số 11",
      "time": 120,
      "type": "toeic"
    },
    {
      "id": 12,
      "name": "Đề số 12",
      "time": 120,
      "type": "toeic"
    }
  ];
}
