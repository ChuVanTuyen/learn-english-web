import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@Component({
    selector: 'app-practice-summary',
    imports: [
        CanvasJSAngularChartsModule
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

    part: number = 1;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            const part = Number(param.get('part'));
        })
    }
}
