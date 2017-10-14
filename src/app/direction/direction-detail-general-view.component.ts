import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DirectionService} from './direction.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {RunwayDirection} from './runwayDirection';
import {RunwayDirectionPosition} from "./runwayDirectionPosition";
import {DirectionCatalogService} from "./direction-catalog.service";
import {ApiError} from "../main/apiError";

@Component({
  selector: 'app-direction-general-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.general.title">
            General
          </h3>
          <div class="col-md-6 btn-group">
            <a
              (click)="allowEdition();"
              class="btn btn-default pull-right"
              i18n="@@commons.button.edit">
              Edit
            </a>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>

      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label for="number" class="control-label" i18n="@@direction.detail.section.general.number">
                Number
              </label>
              <p class="form-control-static">{{direction.number}}</p>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label for="position" class="control-label" i18n="@@direction.detail.section.general.position">
                Position
              </label>
              <p class="form-control-static">{{positions[direction.position].description}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>      
      
  `
})

export class DirectionDetailGeneralViewComponent implements OnInit {
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  indicator;
  status: number;
  direction: RunwayDirection;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  positions : RunwayDirectionPosition[];
  onInitError : ApiError;

  constructor(
    private directionService: DirectionService,
    private catalogService : DirectionCatalogService
  ){
    this.direction = new RunwayDirection();
    this.positions = [];
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    let p1 = this.catalogService
      .listPositions()
      .then(data => this.positions = data)
      .catch(error => Promise.reject(error));

    let p2 = this.directionService
      .get(this.airportId, this.runwayId, this.directionId)
      .then( data => this.direction = data)
      .catch(error => Promise.reject(error));

    Promise.all([p1, p2])
      .then(r => this.status = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })

  }

  allowEdition() {
    this.editChange.emit(true);
  }
}
