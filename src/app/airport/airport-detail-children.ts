import {Component, Input, OnInit} from "@angular/core";
import {RunwayService} from "../runway/runway.service";
import {ActivatedRoute} from "@angular/router";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {Runway} from "../runway/runway";

@Component({
  selector: 'airport-children',
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.runways.title">
            Runways
          </h3>
          <div class="col-md-6 btn-group">
            <a
              routerLink="/airports/{{airportId}}/runways/new"
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
          <loading-indicator></loading-indicator>
        </div>

        <ul *ngSwitchCase="indicator.ACTIVE">
          <li *ngFor="let runway of runways">
            <a routerLink="/airports/{{airportId}}/runways/{{runway.id}}/detail">{{runway.name}}</a>
          </li>
        </ul>

        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <empty-indicator type="relation" entity="runways"></empty-indicator>
        </div>
        
      </div>
    </div>
  `
})

export class AirportDetailChildren implements OnInit{

  runways : Runway[];
  status : number;
  indicator = STATUS_INDICATOR;
  airportId : number;

  constructor(
    private route : ActivatedRoute,
    private runwayService : RunwayService
  ){
    this.runways = [];
  }

  ngOnInit(): void {
    this.airportId = +this.route.snapshot.params['airportId'];

    this.runwayService
      .list(this.airportId)
      .then( data => {

        this.runways = data;

        (data.length == 0 )? this.status = this.indicator.EMPTY : this.status = this.indicator.ACTIVE;
      })
  }
}
