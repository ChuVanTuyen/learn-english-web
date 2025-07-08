import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {

    menuMbActive: boolean = false;
    currentUrl: string = '';

    constructor(
        private router: Router,
        protected readonly commonService: CommonService
    ) { }

    ngOnInit() {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.currentUrl = event.urlAfterRedirects;
            });
    }

    logout() {
        this.commonService.clearInforUser();
        this.commonService.showNotify('Đăng xuất thành công', 'success');
        this.commonService.clearDataCache();
        this.router.navigate(['/']);
    }
}
