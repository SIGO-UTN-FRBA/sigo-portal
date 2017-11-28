///<reference path="direction.service.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DirectionService} from './direction.service';
import {RunwayDirection} from './runwayDirection';
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayDirectionPosition} from "./runwayDirectionPosition";
import {DirectionCatalogService} from "./direction-catalog.service";
import {ApiError} from "../main/apiError";
import {DirectionDistancesService} from "./direction-distances.service";

@Component({
  selector: 'app-direction-general-edit',
  template: `    
    <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title" i18n="@@direction.detail.section.general.title">
        General
      </h3>
    </div>
    <div class="panel-body" [ngSwitch]="status">
      <div *ngSwitchCase="indicator.LOADING">
        <app-loading-indicator></app-loading-indicator>
      </div>
      <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
        <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
      </div>
      <form #directionForm="ngForm"
            *ngSwitchCase="indicator.ACTIVE"
            role="form" 
            class="form container-fluid" 
            (ngSubmit)="onSubmit()">

        <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>
        
        <div class="row">
          <div class="col-md-6 col-sm-12 form-group">
            <label
              for="inputNumber"
              class="control-label"
              i18n="@@direction.detail.section.general.number">
              Number
            </label>
            <input
              type="number"
              class="form-control"
              name="inputNumber"
              min="1"
              max="36"
              length="2"
              [(ngModel)]="direction.number"
              required>
          </div>
          <div class="col-md-6 col-sm-12 form-group">
            <label
              for="inputPosition"
              class="control-label"
              i18n="@@direction.detail.section.general.position">
              Position
            </label>
            <select
              name="inputPosition"
              [(ngModel)]="direction.position"
              class="form-control"
              required>
              <option *ngFor="let position of positions" [value]="position.id">
                {{position.description}}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-12 form-group">
            <label
              for="inputAzimuth"
              class="control-label"
              i18n="@@direction.detail.section.general.azimuth">
              Azimuth
            </label>
            <input
              type="number"
              class="form-control"
              name="inputAzimuth"
              min="0"
              max="360"
              [(ngModel)]="direction.azimuth"
              required>
          </div>
          <div class="col-md-6 col-sm-12 form-group">
            <label
              for="inputHeight"
              class="control-label"
              i18n="@@direction.detail.section.general.height">
              Height
            </label>
            <div class="input-group">
              <input
                type="number"
                class="form-control"
                name="inputHeight"
                min="0"
                [(ngModel)]="direction.height"
                required>
              <div class="input-group-addon">[m]</div>
            </div>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="pull-right">
            <button
              (click)="onCancel()"
              type="button"
              class="btn btn-default"
              i18n="@@commons.button.cancel">
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="directionForm.invalid"
              class="btn btn-success"
              i18n="@@commons.button.save">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
  `
})

export class DirectionDetailGeneralEditComponent implements OnInit {

  status: number;
  indicator;
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  direction: RunwayDirection;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  positions : RunwayDirectionPosition[];
  onInitError: ApiError;
  onSubmitError: ApiError;
  private updates : number = 0;

  constructor(
    private directionService : DirectionService,
    private catalogService : DirectionCatalogService,
    private distancesService: DirectionDistancesService
  ){
    this.direction = new RunwayDirection();
    this.positions = [];
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = this.indicator.LOADING;

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
      });

  }

  onSubmit(){

    this.onSubmitError = null;

    this.directionService
      .update(this.airportId, this.runwayId, this.direction)
      .then( () => {
        this.distancesService.updateLength(this.updates++);
        this.disallowEdition()
      } )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
