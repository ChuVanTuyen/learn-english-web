import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { CommonService } from '../../services/common.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, AsyncPipe],
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
}
