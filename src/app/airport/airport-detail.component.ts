import {Component, OnInit, Output} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";
import {RunwayService} from "../runway/runway.service";

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
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@airport.detail.section.runways.title">
            Runways
          </h3>
        </div>
        <div class="panel-body">
          <div *ngIf="!runwayContentLoaded" class="container-fluid">
            <img src="../../assets/images/loading.gif" class="center-block">
          </div>
          
          <ul *ngIf="runwayContentLoaded">
            <li *ngFor="let runway of airport.runways">
              <a routerLink="/airports/{{airport.id}}/runways/{{runway.id}}">{{runway.name}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})


export class AirportDetailComponent implements OnInit{

  @Output() airport : Airport;
  runwayContentLoaded : boolean;

  constructor(
    private route : ActivatedRoute,
    private runwayService : RunwayService
  ){
    this.airport = new Airport();
    this.runwayContentLoaded = false;
  }

  ngOnInit() : void {

    let airportId : number = +this.route.snapshot.params['airportId'];

    this.runwayService
      .list(airportId)
      .then( data => {
        this.airport.runways = data;
        this.runwayContentLoaded = true;
      })
  }
}
