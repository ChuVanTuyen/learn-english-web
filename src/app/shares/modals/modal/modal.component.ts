import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonService } from '../../services/common.service';
import { BroadcasterService } from '../../services/broadcaster.service';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css',
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent {
    private element: any;
    listPriority: string[] = [];
    listNotifyClose: string[] = []; 
    isPriority: boolean = false;
    evGetReport = Subscription.EMPTY;
    
    @Input() id: string = '';
    @Input() clickOutClose: boolean = true;
    @Input() isBlur: boolean = false;
    @ViewChild('modalElm') modalElm!: ElementRef;
  
    constructor(
        private modalService: ModalService, 
        private el: ElementRef,
        private commonService: CommonService,
        // private settingService: SettingService,
        private broadcasterService: BroadcasterService
        ) {
          this.element = el.nativeElement;
      }
  
      ngOnInit(): void {
          // ensure id attribute exists
          if (!this.id) {
              console.error('modal must have an id');
              return;
          }
          
          // move element to bottom of page (just before </body>) so it can be displayed above everything else
          // if (this.commonService.getEnvironment() == 'client') {
          //     document.body.appendChild(this.element);
          // }
  
          // close modal on background click
          this.element.addEventListener('click', (el: any) => {
              if (el.target.className.includes('app-modal') && this.clickOutClose) {
                  this.close();
              }
          });
  
          // add self (this modal instance) to the modal service so it's accessible from controllers
          this.modalService.add(this);
          
          // get data setting
        //   this.setting = this.settingService.dataSetting;
          // check priority modal
          const checkPriority = this.listPriority.filter(item => item === this.id);
          this.isPriority = checkPriority.length > 0 ? true : false;
      }
  
      // remove self from modal service when component is destroyed
      ngOnDestroy(): void {
          this.modalService.remove(this.id);
          this.element.remove();
      }
  
      // open modal
      open(): void {
          this.element.style.display = 'block';
          if (this.commonService.getEnvironment() == 'client') {
              //move element to bottom of page (just before </body>) so it can be displayed above everything else
              document.body.appendChild(this.element);
              // add style 
              document.body.classList.add('app-modal-open');
              // this.commonService.scrollModal();
  
              this.evGetReport = fromEvent(this.modalElm?.nativeElement, 'scroll').subscribe(res => {
                  this.commonService.checkInsideView(this.modalElm)
              })
          }
      }
  
      // close modal
      close(): void {
          this.element.style.display = 'none';
          this.evGetReport.unsubscribe();
  
          if (this.commonService.getEnvironment() == 'client') {
              document.body.classList.remove('app-modal-open');
              //remove elm from dom
              const elm = document.getElementById(this.id);
              elm?.remove()
          }
          if(this.listNotifyClose.includes(this.id)) {
              
              this.broadcasterService.broadcast('close-background-modal', {value: true})
          }
      }
}
