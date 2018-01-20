import {Component, OnInit} from '@angular/core';
import {AppError} from '../main/ierror';
import {ActivatedRoute, Router} from '@angular/router';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {AnalysisExceptionService} from './analysis-exception.service';
import Polygon = ol.geom.Polygon;
import {AnalysisExceptionSurface} from './analysisExceptionSurface';
import {UiError} from '../main/uiError';
import GeoJSON = ol.format.GeoJSON;

@Component({
  template:`
    <h1 i18n="@@exception.surface.new.title">
      New analysis exception for a terrain surface
    </h1>
    <p i18n="@@exception.surface.new.main_description">
      This section allows users to create an exception over an terrain area with a fixed height.
    </p>
    <hr/>
    <div class="container-fluid">
      <div *ngIf="onSubmitError" class="container-fluid">
        <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
      </div>
      <div class="panel panel-default">
        <div class="panel-body">
          <form id="ngForm"
                #exceptionSurfaceForm="ngForm"
                role="form"
                class="form container-fluid"
                (ngSubmit)="onSubmit()"
          >
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputName"
                  class="control-label"
                  i18n="@@exception.surface.detail.section.general.inputName">
                  Name
                </label>
                <input type="text"
                       name="inputName"
                       class="form-control"
                       [(ngModel)]="name"
                       required
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputHeightAmls"
                  class="control-label"
                  i18n="@@exception.surface.detail.section.general.inputHeightAmls">
                  Height AMLS
                </label>
                <div class="input-group">
                  <input type="number"
                         name="inputHeightAmls"
                         class="form-control"
                         min="0"
                         step="1"
                         [(ngModel)]="heightAmls"
                         required
                  />
                  <div class="input-group-addon">[m]</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputPolygon"
                  class="control-label"
                  i18n="@@exception.surface.detail.section.general.inputPolygon">
                  Polygon
                </label>
                <textarea name="inputPolygon"
                          class="form-control"
                          [(ngModel)]="coordinatesText"
                          placeholder='[ [0.0, 0.0], ... ]'
                          rows="5"
                          required
                >
                </textarea>
              </div>
            </div>
            <br>
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
                  type="button"
                  (click)="exceptionSurfaceForm.ngSubmit.emit()"
                  [disabled]="exceptionSurfaceForm.form.invalid"
                  class="btn btn-success"
                  i18n="@@commons.button.create">
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})

export class ExceptionNewSurfaceComponent implements OnInit {

  onSubmitError:AppError;
  private analysisId: number;
  indicator;
  coordinatesText: string;
  name: string;
  heightAmls: number;

  constructor(
    private exceptionService: AnalysisExceptionService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.indicator=STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.analysisId = this.route.parent.parent.snapshot.params['analysisId'];
    this.onSubmitError = null;
  }

  onSubmit() {
    let polygon : Polygon;

    this.onSubmitError = null;

    try{
      polygon = new Polygon(JSON.parse(this.coordinatesText));
    } catch(e) {
      this.onSubmitError = new UiError("Invalid geometry to create a polygon.", "Error");
      return;
    }

    let exception = new AnalysisExceptionSurface(
                          null,
                          this.analysisId,
                          this.name,
                          this.heightAmls,
                          JSON.parse(new GeoJSON().writeGeometry(polygon))
                    );

    this.exceptionService
      .create(this.analysisId, exception)
      .then(()=> this.router.navigate([`/analysis/${this.analysisId}/stages/exception`]))
      .catch((error) => this.onSubmitError = error);
  }

    onCancel(){
    return this.router.navigate([`/analysis/${this.analysisId}/stages/exception`])
  }
}
