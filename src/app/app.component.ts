import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shares/components/header/header.component';
import { FooterComponent } from "./shares/components/footer/footer.component";
import { CommonService } from './shares/services/common.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  url: string = '';
  timeTest: boolean = false;

  constructor(
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.commonService.user);
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.url = val.url;
        this.handleUrls();
      }
    });
  }

  test() {
    this.commonService.openModal('modal-test');
  }

  handleUrls() {
		this.timeTest = this.url.includes('exam/detail') || this.url.includes('doing');
	}
}
