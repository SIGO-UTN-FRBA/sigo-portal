import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {PlacedObjectCatalogService} from './object-catalog.service';
import {TrackSection} from './trackSection';
import {ElevatedObjectService} from './object.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {ApiError} from '../main/apiError';
import {ElevatedObjectType, ElevatedObjectTypeFactory} from './objectType';
import {TrackSectionType} from './trackSectionType';
import {AppError} from '../main/ierror';

@Component({
  selector: 'app-track-general-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title" i18n="@@object.detail.section.general.title">
          General
        </h3>
      </div>
      <div [ngSwitch]="initStatus" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <form id="ngForm"
                #objectForm="ngForm"
                role="form"
                class="form container-fluid"
                (ngSubmit)="onSubmit()"
          >
            <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>

            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label for="type" class="control-label" i18n="@@object.detail.section.general.type">
                  Type
                </label>
                <p class="form-control-static">{{typeName}}</p>
              </div>
              <div class="col-md-6 col-sm-12 form-group">
                <label for="subtype" class="control-label" i18n="@@object.detail.section.general.subtype">
                  Subtype
                </label>
                <p class="form-control-static">{{subtypes[track.subtypeId].name}}</p>
              </div>
            </div>
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
                class="btn btn-danger"
                i18n="@@commons.button.cancel">
                Cancel
              </button>
              <button
                type="button"
                (click)="objectForm.ngSubmit.emit()"
                [disabled]="objectForm.form.invalid"
                class="btn btn-success"
                i18n="@@commons.button.create">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class TrackDetailGeneralEditComponent implements OnInit {

  track: TrackSection;
  @Input() trackId: number;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  indicator;
  initStatus: number;
  onInitError: ApiError;
  typeName: string;
  type: ElevatedObjectType;
  subtypes: TrackSectionType[];
  onSubmitError: AppError;

  constructor(
    private router: Router,
    private objectService: ElevatedObjectService,
    private catalogService: PlacedObjectCatalogService,
  ){
    this.indicator = STATUS_INDICATOR;
    this.type = ElevatedObjectTypeFactory.getTrackSectionType();
  }

  ngOnInit(): void {
    this.initStatus = STATUS_INDICATOR.LOADING;
    this.onInitError = null;

    Promise.all([
      this.resolveSubtypes(),
      this.resolveObject()
    ])
      .then(() => {
        this.typeName = this.type.description;
        this.initStatus = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.initStatus = STATUS_INDICATOR.ERROR;
      })
  }

  private resolveSubtypes(): Promise<any> {
    return this.catalogService
      .listTrackSectionTypes()
      .then(data => this.subtypes = data)
      .catch( error => Promise.reject(error));
  }

  private resolveObject(): Promise<any> {
    return this.objectService
      .get(this.trackId, this.type.id)
      .then(data => this.track = data as TrackSection)
      .catch( error =>  Promise.reject(error))
  }

  onSubmit(){

    this.onSubmitError = null;

    this.objectService
      .update(this.track)
      .then( () => this.disallowEdition())
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
