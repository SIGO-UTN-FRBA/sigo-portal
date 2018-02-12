import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppError} from '../main/ierror';
import {AnalysisExceptionSurface} from './analysisExceptionSurface';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {AnalysisExceptionSurfaceService} from './exception-surface.service';

@Component({
  selector: 'app-exception-surface-general-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title" 
            i18n="@@exception.rule.detail.section.general.title"
        >
          General
        </h3>
      </div>
      <div [ngSwitch]="onInitStatus" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <form #exceptionForm="ngForm"
              *ngSwitchCase="indicator.ACTIVE"
              role="form"
              class="form container-fluid"
              (ngSubmit)="onSubmit()"
        >

          <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>
          
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                class="control-label"
                for="inputName"
                i18n="@@exception.surface.detail.section.general.inputName">
                Name
              </label>
              <input type="text"
                     name="inputName"
                     [(ngModel)]="exceptionSurface.name"
                     class="form-control"
                     maxlength="100"
                     required
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                class="control-label"
                for="inputHeightAmls"
                i18n="@@exception.surface.detail.section.general.inputHeightAmls"
              >
                Height AMLS
              </label>
              <div class="input-group">
                <input type="number"
                       name="inputHeightAmls"
                       [(ngModel)]="exceptionSurface.heightAmls"
                       class="form-control"
                       required
                />
                <div class="input-group-addon">[m]</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                class="control-label"
                i18n="@@exception.surface.detail.section.general.inputPolygon">
                Polygon
              </label>
              <p class="form-control-static">{{exceptionSurface.geom['coordinates']}}</p>
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
                [disabled]="exceptionForm.invalid"
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

export class ExceptionDetailSurfaceEditComponent implements OnInit {

  onInitStatus:number;
  indicator;
  onInitError: AppError;
  onSubmitError: AppError;
  @Input() edit:boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() exceptionId:number;
  @Input() analysisId:number;
  exceptionSurface:AnalysisExceptionSurface;

  constructor(
    private exceptionService: AnalysisExceptionSurfaceService
  ){
    this.indicator=STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.onInitStatus=STATUS_INDICATOR.LOADING;
    this.onInitError =null;

    this.exceptionService
      .get(this.analysisId, this.exceptionId)
      .then(data => this.exceptionSurface = data as AnalysisExceptionSurface)
      .then(()=> this.onInitStatus = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError = error;
        this.onInitStatus = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){
    this.exceptionService
      .update(this.analysisId, this.exceptionSurface)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError = error);
  }

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
