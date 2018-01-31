import {Component} from '@angular/core';

@Component({
  template: `
    <br>
    <br>
    <div class="container-fluid">
      <div class="alert alert-warning" role="alert">
        You are <strong>unauthenticated</strong>. Please, try to sign in again.
      </div>
    </div>
  `
})

export class UnauthenticatedComponent {

}
