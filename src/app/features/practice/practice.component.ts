import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-practice',
  imports: [RouterLink],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.css'
})
export class PracticeComponent {
  
  listPart = [
    {
      url: 'part-1',
      name: 'Phần 1: Mô tả tranh',
      image: '/images/web/1.png'
    },
    {
      url: 'part-2',
      name: 'Phần 2: Hỏi & Đáp',
      image: '/images/web/2.png'
    },
    {
      url: 'part-3',
      name: 'Phần 3: Đoạn hội thoại',
      image: '/images/web/3.png'
    },
    {
      url: 'part-4',
      name: 'Phần 4: Đoạn thông tin ngắn',
      image: '/images/web/4.png'
    },
    {
      url: 'part-5',
      name: 'Phần 5: Hoàn thành câu',
      image: '/images/web/5.png'
    },
    {
      url: 'part-6',
      name: 'Phần 6: Hoàn thành đoạn văn',
      image: '/images/web/6.png'
    },
    {
      url: 'part-7',
      name: 'Phần 7: Đọc hiểu đoạn văn',
      image: '/images/web/7.png'
    }
  ]
  
  constructor() {}

  ngOnInit() {
    
  }
}
