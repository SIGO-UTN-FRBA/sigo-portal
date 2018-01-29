import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <h1 i18n="@@profile.detail.title">
      User Profile
    </h1>
    <p i18n="@@profile.detail.main_description">
      This section allows users to inspect its user profile.
    </p>
    <hr/>
    
    <div class="panel panel-default">
      <div class="panel-body">
        <img src="{{profile?.picture}}" class="avatar" alt="avatar">
        <div>
          <h3 class="nickname">{{ profile?.nickname }}</h3>
        </div>
        <pre class="full-profile">{{ profile | json }}</pre>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {

  profile: any;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
  }

}
