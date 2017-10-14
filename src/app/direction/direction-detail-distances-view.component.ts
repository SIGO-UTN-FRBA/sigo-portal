import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {DirectionService} from "./direction.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayDistance} from "./runwayDistance";
import {DirectionDistancesService} from "./direction-distances.service";
import {Subscription} from "rxjs/Subscription";
import {ApiError} from "../main/apiError";

@Component({
  selector: 'app-direction-distances-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.distances.title">
            Declared distances
          </h3>
        </div>
      </div>
      <div class="panel-body" [ngSwitch]="status">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <img src="../../assets/images/declared_distances.png" class="img-responsive center-block">
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <div class="row" *ngFor="let distance of distances">
                <div class="col-md-12 col-sm-12 form-group">
                  <label class="control-label">
                    {{distance.shortName}}
                  </label>
                  <p class="form-control-static">{{distance.length}} [m]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class DirectionDetailDistancesViewComponent implements OnInit, OnDestroy {

  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  indicator;
  status: number;
  distances : RunwayDistance[];
  subscription: Subscription;
  onInitError : ApiError;

  constructor(
    private directionService : DirectionService,
    private distancesService : DirectionDistancesService
  ){
    this.indicator = STATUS_INDICATOR;

    this.subscription = this.distancesService.lengthUpdated$.subscribe(
      value => this.loadDistances()
    );
  }

  ngOnInit(): void {
    this.loadDistances();
  }

  loadDistances(){

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.directionService
      .listDistances(this.airportId, this.runwayId, this.directionId)
      .then(data => {
        this.distances = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
