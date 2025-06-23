import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-audio',
    standalone: true,
    imports: [
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule
    ],
    templateUrl: './audio.component.html',
    styleUrl: './audio.component.css'
})
export class AudioComponent {

    isClient: boolean = false;
    loadSuccess: boolean = false;
    url: string = '';
    speed: number = 1;

    @Input() set audioUrl(url: string) {
        this.url = url;

        if(this.ngMyAudio) { // ebook dùng
            this.ngMyAudio.nativeElement.src = this.url;
            this.ngMyAudio.nativeElement.load();

            if (this.autoPlay) {
                this.ngMyAudio.nativeElement?.play();
            }

        }

    };
    @Input() autoPlay: boolean = false;
    @Input() set autoSpeed(speed: number) {
        this.speed = speed;
    };
    @Input() set stopAudio(stop: boolean) {
        if(stop) {
            this.ngMyAudio?.nativeElement.pause();
        }
    }
    @ViewChild('ngMyAudio') ngMyAudio: ElementRef | undefined;

    constructor(
        private commonService: CommonService
    ) {}

    ngOnInit() {
        this.isClient = this.commonService.getEnvironment() === 'client';
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.handlePlay();
        }, 500);
    }

    playAudio() {
        if(this.ngMyAudio) {
            this.ngMyAudio.nativeElement.url = this.url;
            this.ngMyAudio.nativeElement.load();
            this.ngMyAudio.nativeElement.play();
        }
    }

    handlePlay() {
        if(!this.ngMyAudio?.nativeElement.readyState) {
            this.ngMyAudio?.nativeElement.load();
        }
    }
    ngOnDestroy() {
        this.ngMyAudio?.nativeElement.remove();
    }
}
