import {Component, OnInit, Output} from "@angular/core";
import {Airport} from "./airport";


@Component({
  template: `
    <h1 i18n="@@airport.detail.title">
      Airport detail
    </h1>
    <p i18n="@@airport.detail.main_description">
      This section allows users to inspect an airport.
    </p>
    <hr/>

    <div class="container-fluid">
      <router-outlet></router-outlet>
      <br>
      <airport-geometry></airport-geometry>
      <br>
      <airport-children [airport]="airport"></airport-children>
    </div>
  `
})


export class AirportDetailComponent implements OnInit{

  @Output() airport : Airport;

  constructor(){
    this.airport = new Airport();
  }

  ngOnInit() : void {

  }
}
