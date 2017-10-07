import {Component, Input, OnInit} from "@angular/core";
import {DirectionService} from "../direction/direction.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayDirection} from "../direction/runwayDirection";


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

        <ul *ngSwitchCase="indicator.ACTIVE">
          <li *ngFor="let direction of directions">
            <a routerLink="/airports/{{airportId}}/runways/{{runwayId}}/directions/{{direction.id}}/detail">{{direction.name}}</a>
          </li>
        </ul>
        
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="relation" entity="directions"></app-empty-indicator>
        </div>
        
      </div>
    </div>
  `
})


export class RunwayDetailChildren implements OnInit{

  @Input() airportId : number;
  @Input() runwayId : number;
  directions : RunwayDirection[];
  status : number;
  indicator;


  constructor(
    private directionService : DirectionService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = this.indicator.LOADING;

    this.directionService
      .list(this.airportId, this.runwayId)
      .then(data => {

        this.directions = data;

        if(data.length != 0)
          this.status = this.indicator.ACTIVE;
        else
          this.status = this.indicator.EMPTY;
      })
  }

}
