import {Component, OnInit} from '@angular/core';
import {ApiError} from '../main/apiError';
import {TrackSection} from './trackSection';
import {TrackSectionType} from './trackSectionType';
import {PlacedObjectCatalogService} from './object-catalog.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {ElevatedObjectService} from './object.service';
import {Router} from '@angular/router';

@Component({
  template:`
    <h1 i18n="@@object.new.track.title">
      New track section
    </h1>
    <p i18n="@@object.new.track.main_description">
      This section allows users to create a track section.
    </p>
    <hr/>
    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@object.new.detail.section.general.title">
            General
          </h3>
        </div>
        <div class="panel-body" [ngSwitch]="initStatus">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
          </div>
          <div  *ngSwitchCase="indicator.ACTIVE" class="container-fluid">
            <form id="ngForm"
                  #objectForm="ngForm"
                  role="form"
                  class="form container-fluid"
                  (ngSubmit)="onSubmit()"

            >
              <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>

              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label class="control-label"
                         for="inputName"
                         i18n="@@object.detail.general.name">
                    Name
                  </label>
                  <input class="form-control"
                         name="inputName"
                         maxlength="255"
                         minlength="3"
                         [(ngModel)]="track.name"
                         type="text"
                         required
                  >
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label
                    for="inputSubtype"
                    class="control-label"
                    i18n="@@object.detail.section.general.subtype">
                    Subtype
                  </label>
                  <select name="inputSubtype"
                          [(ngModel)]="track.subtypeId"
                          class="form-control"
                          required
                  >
                    <option *ngFor="let subtype of subtypes" [value]="subtype.id">
                      {{subtype.name}}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label class="control-label"
                         for="inputHeightAgl"
                         i18n="@@object.detail.general.heightAgl">
                    Height AGL
                  </label>
                  <div class="input-group">
                    <input type="number"
                           name="inputHeightAgl"
                           min="0"
                           max="10000"
                           class="form-control"
                           [(ngModel)]="track.heightAgl"
                           required>
                    <div class="input-group-addon">[m]</div>
                  </div>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label class="control-label"
                         for="inputHeightAmls"
                         i18n="@@object.detail.general.heightAmls">
                    Height AMLS
                  </label>
                  <div class="input-group">
                    <input type="number"
                           name="inputHeightAmls"
                           min="0"
                           max="10000"
                           class="form-control"
                           [(ngModel)]="track.heightAmls"
                           required>
                    <div class="input-group-addon">[m]</div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3 col-sm-6 form-group">
                  <input type="checkbox"
                         name="inputVerified"
                         [(ngModel)]="track.verified"
                  >
                  <label class="control-label"
                         for="inputVerified"
                         i18n="@@object.detail.general.verified">
                    Verified
                  </label>
                </div>
              </div>
            </form>
            <br>
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
                  type="button"
                  (click)="objectForm.ngSubmit.emit()"
                  [disabled]="objectForm.form.invalid"
                  class="btn btn-success"
                  i18n="@@commons.button.create">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class ObjectNewTrackComponent implements OnInit {

  initStatus: number;
  indicator;
  track: TrackSection;
  onInitError: ApiError;
  onSubmitError: ApiError;
  subtypes: TrackSectionType[];

  constructor(
    private objectService: ElevatedObjectService,
    private catalogService: PlacedObjectCatalogService,
    private router: Router
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.track = new TrackSection();
    this.track.verified = false;

    this.onInitError = null;
    this.initStatus = STATUS_INDICATOR.LOADING;

    this.catalogService.listTrackSectionTypes()
      .then( data => {
        this.subtypes = data;
        this.initStatus = STATUS_INDICATOR.ACTIVE;
      })
      .catch( error => {
        this.onInitError = error;
        this.initStatus = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit() {

    this.onSubmitError = null;

    this.objectService
      .save(this.track)
      .then(data => this.router.navigateByUrl(`/objects/tracks/${data.id}/detail`))
      .catch(error => this.onSubmitError = error);
  };

  onCancel() {
    return this.router.navigateByUrl(`/objects/search`)
  };
}
