import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { PracticeService } from '../../../shares/services/practice.service';
import { FormsModule } from '@angular/forms';
import { ARR_NUM_QUES } from '../../../shares/data/practice';
import { HistoryPractice, PracticeSummary } from '../../../common/interfaces/practice';
import { CommonModule } from '@angular/common';
import { ModalPracticeHistoryComponent } from "../../../shares/modals/modal-practice-history/modal-practice-history.component";
import { CommonService } from '../../../shares/services/common.service';

@Component({
    selector: 'app-practice-summary',
    imports: [
    CommonModule,
    CanvasJSAngularChartsModule,
    FormsModule,
    RouterLink,
    ModalPracticeHistoryComponent
],
    templateUrl: './practice-summary.component.html',
    styleUrls: ['../../../shares/styles/button.css', './practice-summary.component.css']
})
export class PracticeSummaryComponent {

    loading: boolean = true;

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
                dataPoints: []
            },
            {
                type: "spline",
                axisYType: "secondary",
                lineColor: "#CD3535",
                markerColor: "#CD3535",
                lineThickness: 2,
                markerSize: 10,
                dataPoints: []
            }
        ]
    };

    averageTime = [ 30, 20, 81, 102, 20, 90, 185 ];
    totalQues = [72, 300, 468, 360, 360, 192, 648]

    part: number = 1;
    arrNumQues: number[][] = ARR_NUM_QUES;
    history: HistoryPractice[] = [];
    summary: PracticeSummary | undefined;

    constructor(
        private route: ActivatedRoute,
        protected readonly practiceService: PracticeService,
        protected readonly commonService: CommonService,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            this.part = Number(param.get('part'));
            this.practiceService.numQues = this.arrNumQues[this.part - 1][0];
            this.hanldeTime();
            this.loading = true;
            this.practiceService.getPracticeSummary(this.part).subscribe({
                next: res => {
                    this.history = res.history;
                    this.summary = res.summary;
                    this.practiceService.summary = res.summary;
                    let lineTime: any = [], lineCorrect: any[] = [];
                    res.history.forEach((his, idx) => {
                        lineCorrect.push({ y: Math.round(his.correct / his.total * 100), x: idx + 1 });
                        lineTime.push({ y: Math.round(his.time / 6) / 10, x: idx + 1 });
                    });
                    this.chartOptions.data[0].dataPoints = lineCorrect;
                    this.chartOptions.data[1].dataPoints = lineTime;
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            })
        });
    }

    ngAfterViewInit() {
        this.commonService.scrollToTop();
    }

    toggleCheck() {
        this.practiceService.testMode = !this.practiceService.testMode;
    }

    hanldeTime() {
        this.practiceService.time = this.practiceService.numQues * this.averageTime[this.part - 1];
    }

    openFailQues() {
        if(this.summary && this.summary.false_questions[this.part] && this.summary.false_questions[this.part].length > 0) {
            this.router.navigate(['/practice/' + this.part + '/failed']);
        } else {
            this.commonService.showNotify('Bạn chưa có câu hỏi nào làm sai', 'warning');
        }
    }
}
