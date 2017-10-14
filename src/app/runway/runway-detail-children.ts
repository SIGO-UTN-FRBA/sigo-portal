import {Component, Input, OnInit} from "@angular/core";
import {DirectionService} from "../direction/direction.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayDirection} from "../direction/runwayDirection";
import {ApiError} from "../main/apiError";


@Component({
  selector: 'app-runway-children',
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@runway.detail.section.directions.title">
            Directions
          </h3>
          <div class="col-md-6 btn-group">
            <a
              routerLink="/airports/{{airportId}}/runways/{{runwayId}}/directions/new"
              class="btn btn-default pull-right"
              i18n="@@commons.button.new">
              New
            </a>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING" class="container-fluid">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="relation" entity="directions"></app-empty-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <ul *ngSwitchCase="indicator.ACTIVE">
          <li *ngFor="let direction of directions">
            <a routerLink="/airports/{{airportId}}/runways/{{runwayId}}/directions/{{direction.id}}/detail">{{direction.name}}</a>
          </li>
        </ul>
      </div>
    </div>
  `
})


export class RunwayDetailChildren implements OnInit {

  @Input() airportId : number;
  @Input() runwayId : number;
  directions : RunwayDirection[];
  status : number;
  indicator;
  onInitError : ApiError;


  constructor(
    private directionService : DirectionService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.directionService
      .list(this.airportId, this.runwayId)
      .then(data => {

        this.directions = data;

        if(data.length != 0)
          this.status = STATUS_INDICATOR.ACTIVE;
        else
          this.status = STATUS_INDICATOR.EMPTY;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

}
