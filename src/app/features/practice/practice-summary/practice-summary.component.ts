import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { PracticeService } from '../../../shares/services/practice.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-practice-summary',
    imports: [
        CanvasJSAngularChartsModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './practice-summary.component.html',
    styleUrls: ['../../../shares/styles/button.css', './practice-summary.component.css']
})
export class PracticeSummaryComponent {

    chartOptions: any = {
        axisX: {
            interval: 1,
        },
        axisY: {
            gridThickness: 0,
            suffix: "%",
            title: "tỷ lệ đúng"
        },
        axisY2: {
            title: "Thời gian làm",
            suffix: "phút",
            opposite: true
        },
        height: 280,
        credit: false,
        data: [
            {
                type: "spline",
                lineColor: "#0F8C66",
                markerColor: "#0F8C66",
                lineThickness: 2,
                markerSize: 10,
                dataPoints: [
                    { y: 15, x: 1 },
                    { y: 10, x: 2 },
                    { y: 12, x: 3 },
                    { y: 20, x: 4 },
                    { y: 13, x: 5 },
                    { y: 10, x: 6 },
                    { y: 19, x: 7 },
                    { y: 18, x: 8 },
                    { y: 25, x: 9 },
                    { y: 30, x: 10 }
                ]
            },
            {
                type: "spline",
                axisYType: "secondary",
                lineColor: "#CD3535",
                markerColor: "#CD3535",
                lineThickness: 2,
                markerSize: 10,
                dataPoints: [
                    { y: 10, x: 1 },
                    { y: 12, x: 2 },
                    { y: 12, x: 3 },
                    { y: 30, x: 4 },
                    { y: 16, x: 5 },
                    { y: 18, x: 6 },
                    { y: 19, x: 7 },
                    { y: 28, x: 8 },
                    { y: 15, x: 9 },
                    { y: 20, x: 10 }
                ]
            }
        ]
    };

    averageTime = [ 30, 20, 81, 102, 20, 90, 185 ];

    part: number = 1;
    arrNum1 = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    arrNum2 = [1, 2, 3, 4, 5];
    arrNumQues: number[][] = [
        this.arrNum1,
        this.arrNum1,
        this.arrNum2,
        this.arrNum2,
        this.arrNum1,
        this.arrNum2,
        this.arrNum2,
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        protected readonly practiceService: PracticeService
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            this.part = Number(param.get('part'));
        })
    }

    toggleCheck() {
        this.practiceService.testMode = !this.practiceService.testMode;
    }
    
    toggleAutoNext() {
        this.practiceService.autoNext = !this.practiceService.autoNext;
    }
}
