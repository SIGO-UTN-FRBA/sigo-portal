import {Component} from "@angular/core";

@Component({
  template:`    
    <router-outlet (activate)="onActivate($event, outlet)" #outlet></router-outlet>
  `
})

export class RegulationComponent {
  onActivate(e, outlet){
    window.scrollTo(0, outlet.scrollTop);
  }
}
