import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Runway} from "./runway";
import {RunwayService} from "./runway.service";
import {RunwayCatalogService} from "./runway-catalog.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";
import {EnumItem} from "../commons/enumItem";


@Component({
  selector: 'app-runway-general-edit',
  template: `
    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@runway.detail.section.general.title">
            General
          </h3>
        </div>
        <div [ngSwitch]="status" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [error]="onInitError"></app-error-indicator>
          </div>
          <form #generalForm 
                *ngSwitchCase="indicator.ACTIVE" 
                role="form" 
                class="form container-fluid" 
                (ngSubmit)="onSubmit()">
            
            <app-error-indicator [error]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>
            
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputName"
                  class="control-label"
                  i18n="@@ruwnay.detail.section.general.inputName">
                  Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputName"
                  [ngModel]="runway.name"
                  readonly>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputWidth"
                  class="control-label"
                  i18n="@@runway.detail.section.general.inputWidth">
                  Width
                </label>
                <div class="input-group">
                  <input
                    type="number"
                    min="1"
                    step="0.5" 
                    name="inputWidth"
                    [(ngModel)]="runway.width"
                    class="form-control"
                    placeholder="0000.0"
                    required>
                  <div class="input-group-addon">[m]</div>
                </div>
              </div>
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputLength"
                  class="control-label"
                  i18n="@@runway.detail.section.general.inputLength">
                  Length
                </label>
                <div class="input-group">
                  <input 
                    type="number"
                    min="1" 
                    step="0.1" 
                    name="inputLength"
                    class="form-control" 
                    [(ngModel)]="runway.length" 
                    placeholder="0000.0" 
                    required>
                  <div class="input-group-addon">[m]</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputSurface"
                  class="control-label"
                  i18n="@@ruwnay.detail.section.general.inputSurface">
                Surface
                </label>
                <select 
                  name="inputSurface" 
                  [(ngModel)]="runway.surfaceId"
                  class="form-control"
                  required>
                  <option *ngFor="let surface of surfaces" [value]="surface.id">
                    {{surface.name}} - {{surface.description}}
                  </option>
                </select>
              </div>
            </div>

            <hr>

            <div class="row">
              <div class="pull-right">
                <button
                  type="button"
                  (click)="onCancel()"
                  class="btn btn-default"
                  i18n="@@commons.button.cancel">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="generalForm.invalid"
                  class="btn btn-success"
                  i18n="@@commons.button.save">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})

export class RunwayDetailGeneralEditComponent implements OnInit{
  status: number;
  indicator;
  @Input() airportId : number;
  @Input() runwayId: number;
  @Input() edit : boolean;
  @Output() editChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  runway : Runway;
  surfaces : EnumItem[];
  onInitError : ApiError;
  onSubmitError : ApiError;

  constructor(
    private runwayService : RunwayService,
    private catalogService : RunwayCatalogService
  ){
    this.runway = new Runway();
    this.surfaces = [];
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = this.indicator.LOADING;

    let p1 = this.catalogService
      .listSurfaces()
      .then(data => this.surfaces = data)
      .catch(error => Promise.reject(error));

    let p2 = this.runwayService
      .get(this.airportId, this.runwayId)
      .then(data => this.runway = data)
      .catch(error => Promise.reject(error));

    Promise.all([p1, p2])
      .then(r => this.status = this.indicator.ACTIVE)
      .catch(error => this.onInitError = error);
  }

  onSubmit(){

    this.onSubmitError = null;

    this.runwayService
      .update(this.airportId, this.runway)
      .then(data => this.editChange.emit(false))
      .catch(error => this.onSubmitError = error);
  }

  onCancel(){
    this.editChange.emit(false);
  }
}
