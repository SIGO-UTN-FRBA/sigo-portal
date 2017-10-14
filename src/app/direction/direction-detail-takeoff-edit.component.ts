import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DirectionService} from "./direction.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayTakeoffSection} from "./runwayTakeoffSection";
import {DirectionDistancesService} from "./direction-distances.service";
import {ApiError} from "../main/apiError";

@Component({
  selector: 'app-direction-takeoff-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.takeoff.title">
            Take-off Section
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
        <form #takeoffSectionForm="ngForm" 
              *ngSwitchCase="indicator.ACTIVE" 
              role="form" 
              class="form container-fluid" 
              (ngSubmit)="onSubmit()">

          <app-error-indicator [error]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>

          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label"
                     for="inputEnabled"
                     i18n="@@direction.detail.section.takeoff.enabled">
                Enabled
              </label>
              <input type="checkbox"
                     name="inputEnabled"
                     [(ngModel)]="section.enabled"
              >
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" 
                     for="inputClearwayLength"
                     i18n="@@direction.detail.section.takeoff.clearwayLength">
                Clearway length
              </label>
              <div class="input-group">
                <input
                  type="number"
                  min="0"
                  max="999"
                  step="1"
                  name="inputClearwayLength"
                  [(ngModel)]="section.clearwayLength"
                  class="form-control"
                  placeholder="000.0"
                  required>
                <div class="input-group-addon">[m]</div>
              </div>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" 
                     for="inputClearwayWidth"
                     i18n="@@direction.detail.section.takeoff.clearwayWidth">
                Clearway width
              </label>
              <div class="input-group">
                <input type="number"
                       min="0"
                       max="99"
                       step="1"
                       name="inputClearwayWidth"
                       [(ngModel)]="section.clearwayWidth"
                       class="form-control"
                       placeholder="00.0"
                       required>
                <div class="input-group-addon">[m]</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label class="control-label" 
                     for="inputStopwayLength"
                     i18n="@@direction.detail.section.takeoff.stopwayLength">
                Stopway length
              </label>
              <div class="input-group">
                <input type="number"
                       min="0"
                       max="999"
                       step="1"
                       name="inputStopwayLength"
                       [(ngModel)]="section.stopwayLength"
                       class="form-control"
                       placeholder="000.0"
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
                [disabled]="takeoffSectionForm.invalid"
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

export class DirectionDetailTakeoffEditComponent implements OnInit {

  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  indicator;
  status: number;
  section: RunwayTakeoffSection;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  private updates : number = 0;
  onInitError: ApiError;
  onSubmitError: ApiError;

  constructor(
    private directionService: DirectionService,
    private distancesService: DirectionDistancesService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.directionService
      .getTakeoffSection(this.airportId, this.runwayId, this.directionId)
      .then(data => {
        this.section = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error =>{
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  onSubmit() : void {

    this.onSubmitError = null;

    this.directionService
      .updateTakeoffSection(this.airportId, this.runwayId, this.directionId, this.section)
      .then(()=> {
        this.disallowEdition();
        this.distancesService.updateLength(this.updates++);
      })
      .catch(error => this.onSubmitError = error)
  }

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
