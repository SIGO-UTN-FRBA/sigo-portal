import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {AppError} from '../main/ierror';
import {AnalysisExceptionSurface} from './analysisExceptionSurface';
import {AnalysisExceptionSurfaceService} from './exception-surface.service';

@Component({
  selector: 'app-exception-surface-general-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@exception.rule.detail.section.general.title">
            General
          </h3>
          <div class="col-md-6">
            <div class="pull-right">
              <div class="btn-group">
                <button
                  (click)="onDelete();"
                  class="btn btn-default"
                  i18n="@@commons.button.delete">
                  Delete
                </button>
              </div>
              <div class="btn-group">
                <button
                  (click)="allowEdition();"
                  class="btn btn-default"
                  i18n="@@commons.button.edit">
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div [ngSwitch]="onInitStatus" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                class="control-label"
                i18n="@@exception.surface.detail.section.general.inputName">
                Name
              </label>
              <p class="form-control-static">{{exceptionSurface.name}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                class="control-label"
                i18n="@@exception.surface.detail.section.general.inputHeightAmls">
                Height AMLS
              </label>
              <p class="form-control-static">{{exceptionSurface.heightAmls}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                class="control-label"
                i18n="@@exception.surface.detail.section.general.inputPolygon">
                Polygon
              </label>
              <p class="form-control-static">{{coordinatesText}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class ExceptionDetailSurfaceViewComponent implements OnInit {

  onInitStatus:number;
  indicator;
  onInitError:AppError;
  @Input() edit:boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() exceptionId:number;
  @Input() analysisId:number;
  exceptionSurface:AnalysisExceptionSurface;
  coordinatesText: string;

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
      .then(data => this.coordinatesText = JSON.stringify(data.geom['coordinates']))
      .then(()=> this.onInitStatus = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError = error;
        this.onInitStatus = STATUS_INDICATOR.ERROR;
      })
  }
}
