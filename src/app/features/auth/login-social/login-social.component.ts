import { Component, Inject } from '@angular/core';
import { LazyloadService } from '../../../shares/services/lazyload.service';
import { CommonService } from '../../../shares/services/common.service';
import { DOCUMENT } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-login-social',
  imports: [],
  templateUrl: './login-social.component.html',
  styleUrl: './login-social.component.css'
})
export class LoginSocialComponent {

  constructor(
    private commonService: CommonService,
    private lazyload: LazyloadService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngAfterViewInit() { // chưa có client_id
    if (this.commonService.getEnvironment() == 'client') {
      this.lazyload.loadScript('https://accounts.google.com/gsi/client').subscribe(res => {
        const that = this;
        if(typeof google !== 'undefined') {
          google.accounts.id.initialize({
            client_id: "331756901987-dv4jo029le24estmj9132c01uodlq315.apps.googleusercontent.com",
            callback: (response: any) => {
              that.loginWithSocial(response.credential);
            }
          });
          google.accounts.id.renderButton(
            this.document.getElementById("loginGG"),
            { theme: "outline", size: "large" }
          );
        }
      });
    } 
  }

  loginWithSocial(idToken: string) {

  }
}
