import {Component, OnInit} from "@angular/core";
import {Runway} from "./runway";
import {RunwayService} from "./runway.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  template:`
    <h1>Runway detail
      <small></small>
    </h1>
    <p>This section allows users to create a runway.</p>
    <hr/>
    
    <p>{{runway.name}}</p>
  `
})

export class RunwayDetailComponent implements OnInit{

  runway : Runway;

  constructor(
    private route : ActivatedRoute,
    private runwayService : RunwayService
  ){
    this.runway = new Runway();
  }

  ngOnInit(): void {

    let airportId = this.route.snapshot.params['airportId'];
    let runwayId = this.route.snapshot.params['runwayId'];

    this.runwayService
      .get(airportId, runwayId)
      .then(data => this.runway = data);
  }
}
