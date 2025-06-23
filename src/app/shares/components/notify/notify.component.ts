import { Component } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster.service';

interface Notify {
    content: string;
    type: string;
}

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.css'
})
export class NotifyComponent {
    content: string = '';
    type: string = ''; // success | warning | danger
    timeOut: NodeJS.Timeout | undefined;

    constructor(
        private broadcaster: BroadcasterService,
    ) { }

    ngOnInit() {
        
        this.broadcaster.on<Notify>('notify').subscribe((res: Notify) => {
            if (res) {
                this.content = res.content;
                this.type = res.type;

                this.timeOut = setTimeout(() => {
                    this.close();
                }, 5000);
            }
        });
        
    }

    close() {
        this.content = '';
        this.type = '';
        if(this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = undefined;
        }
    }
}
