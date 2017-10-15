import {Component, OnInit} from "@angular/core";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";
import {ActivatedRoute} from "@angular/router";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";

@Component({
  template:`
    <div [ngSwitch]="status" class="container-fluid">

      <div *ngSwitchCase="indicator.LOADING">
        <app-loading-indicator></app-loading-indicator>  
      </div>
      <div *ngSwitchCase="indicator.EMPTY">
        <app-empty-indicator type="result" entity="airports"></app-empty-indicator>
      </div>
      <div *ngSwitchCase="indicator.ERROR">
        <app-error-indicator [error]="onInitError"></app-error-indicator>
      </div>
      
      <ul *ngSwitchCase="indicator.ACTIVE" class="media-list">
        <li *ngFor="let airport of results" class="media media-border">
          <div class="media-left">
            
          </div>
          <div class="media-body">
            <h4 class="media-heading">
              <a routerLink="/airports/{{airport.id}}/detail">{{airport.codeFIR}}</a>
            </h4>
            <p>{{airport.nameFIR}}</p>
          </div>
        </li>
      </ul>
    </div>
  `
})

export class AirportListComponent implements OnInit {

  results : Airport[];
  status : number;
  indicator;
  onInitError : ApiError;

  constructor(
    private airportService : AirportService,
    private route: ActivatedRoute
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit() : void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.airportService
      .search(this.route.snapshot.queryParamMap)
      .then( data => {
        this.results = data;

        (data.length == 0) ? this.status = STATUS_INDICATOR.EMPTY : this.status = STATUS_INDICATOR.ACTIVE;

      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

}
