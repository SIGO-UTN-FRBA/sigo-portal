import {Component} from "@angular/core";

@Component({
  template:`
    <router-outlet (activate)="onActivate($event, outlet)" #outlet></router-outlet>
  `
})

export class ExceptionComponent {
  onActivate(e, outlet){
    window.scrollTo(0, outlet.scrollTop);
  }
}
