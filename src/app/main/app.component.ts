import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-sigo',
  template: `
    <div id="wrap">

      <header>
        <nav role="navigation" class="navbar navbar-default">
          <div class="container-fluid">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="#">
                <img src="./assets/images/logo_sigo_small.png" class="img-responsive" width="20" height="20" alt="S.I.G.O.">
              </a>
            </div>

            <div class="collapse navbar-collapse" id="app-navbar">
              <ng-container *ngIf="auth.isAuthenticated()">
                <ul class="nav navbar-nav">
                  <li routerLinkActive="active">
                    <a routerLink="/home" i18n="@@navbar.home">
                      Home
                    </a>
                  </li>
                  <li routerLinkActive="active">
                    <a routerLink="/airports" i18n="@@navbar.airports">
                      Airports
                    </a>
                  </li>
                  <li routerLinkActive="active">
                    <a routerLink="/objects" i18n="@@navbar.objects">
                      Objects
                    </a>
                  </li>
                  <li routerLinkActive="active">
                    <a routerLink="/regulations" i18n="@@navbar.regulations">
                      Regulations
                    </a>
                  </li>
                  <li routerLinkActive="active">
                    <a routerLink="/analysis" i18n="@@navbar.analysis">
                      Analysis
                    </a>
                  </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                  <li>
                    <a routerLink="/profile">
                      <span class="glyphicon glyphicon-user"></span>
                      <ng-container *ngIf="profile">{{profile.nickname}}</ng-container>
                    </a>
                  </li>
                  <li>
                    <a (click)="auth.logout()" role="button" style="cursor: pointer">
                      Log Out
                    </a>
                  </li>
                </ul>
              </ng-container>
              <ng-container *ngIf="!auth.isAuthenticated()">
                <ul class="nav navbar-nav navbar-right">
                  <li>
                    <a (click)="auth.login()" role="button" style="cursor: pointer">
                      Log In
                    </a>
                  </li>
                </ul>
              </ng-container>
            </div>
          </div>
        </nav>
      </header>

      <main id="main_container">
        <router-outlet></router-outlet>
      </main>

    </div>

    <footer id="footer">
      <div class="container">
        <p class="text-muted">This site was developed by the team 503</p>
      </div>
    </footer>

  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'S.I.G.O.';
  profile;

  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

  ngOnInit(): void {

    if(this.auth.isAuthenticated()) {
      if (this.auth.userProfile)
        this.profile = this.auth.userProfile;
      else
        return this.auth.getProfile((err, profile) => this.profile = profile);
    }
  }
}
