import {Component, OnInit} from "@angular/core";
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

    <div *ngIf="!mainContentLoaded" class="container-fluid">
      <img class="center-block" src="../../assets/images/loading.gif">
    </div>

    <div *ngIf="mainContentLoaded" class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@airport.detail.section.general.title">
            General
          </h3>
        </div>
        <div class="panel-body">
          <form #airportForm="ngForm" role="form" class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputNameFir" class="control-label" i18n="@@airport.detail.section.general.inputNameFir">
                  Name ICAO
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputNameFir"
                  [(ngModel)]="airport.name_fir"
                  required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label for="inputCodeFir" class="control-label" i18n="@@airport.detail.section.general.inputCodeFir">
                  Code ICAO
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputCodeFir"
                  [ngModel]="airport.code_fir"
                  disabled
                  required>
              </div>
              <div class="col-md-6 col-sm-12">
                <label for="inputCodeIATA" class="control-label" i18n="@@airport.detail.section.general.inputCodeIATA">
                  Code IATA
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputCodeIATA"
                  [(ngModel)]="airport.code_IATA"
                  required>
              </div>
            </div>
          </form>
        </div>
      </div>
      <br>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@airport.detail.section.runways.title">
            Runways
          </h3>
        </div>
        <div class="panel-body">
          <div *ngIf="!childContentLoaded" class="container-fluid">
            <img src="../../assets/images/loading.gif" class="center-block">
          </div>
          
          <ul *ngIf="childContentLoaded">
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

  airport : Airport;
  mainContentLoaded : boolean;
  childContentLoaded : boolean;

  constructor(
    private route : ActivatedRoute,
    private airportServive : AirportService,
    private runwayServive : RunwayService
  ){
    this.airport = new Airport();
    this.mainContentLoaded = false;
    this.childContentLoaded = false;
  }

  ngOnInit() : void {

    let airportId : number = +this.route.snapshot.params['airportId'];

    this.airportServive
      .get(airportId)
      .then(data => {
        this.airport = data;
        this.mainContentLoaded = true;

        this.runwayServive
          .list(airportId)
          .then( data => {
            this.airport.runways = data;
            this.childContentLoaded = true;
          })
      })

  }
}
