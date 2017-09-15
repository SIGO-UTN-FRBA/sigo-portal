import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";

@Component({
  template: `
    <h1>Airport detail <small></small></h1>
    <p>This section allows users to edit the airport <i>{{airport.code_fir}}</i>.</p>
    <hr/>

    <span>{{airport.id}}</span>
  `
})


export class AirportDetailComponent implements OnInit{

  airport : Airport;

  constructor(
    private route : ActivatedRoute,
    private airportServive : AirportService
  ){}

  ngOnInit() : void {
    this.airportServive
      .get(+this.route.snapshot.params['id'])
      .then(data => this.airport = data)
  }
}
