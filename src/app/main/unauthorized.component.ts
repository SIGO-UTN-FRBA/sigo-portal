import {Component} from '@angular/core';

@Component({
  template: `
    <br>
    <br>
    <div class="container-fluid">
      <div class="alert alert-warning" role="alert">
        <strong i18n="@@commons.text.unauthorized">Unauthorized</strong>
        <ng-container i18n="@@unauthorized.description"> to perform that action. Check your assigned role. Please, contact to the system administrator to grant access.</ng-container>
      </div>
    </div>
  `
})

export class UnauthorizedComponent {

}
