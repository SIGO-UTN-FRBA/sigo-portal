import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrackSection} from './trackSection';
import {ApiError} from '../main/apiError';
import {Router} from '@angular/router';
import {PlacedObjectCatalogService} from './object-catalog.service';
import {ElevatedObjectService} from './object.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {ElevatedObjectType, ElevatedObjectTypeFactory} from './objectType';
import {TrackSectionType} from './trackSectionType';

@Component({
  selector: 'app-track-general-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@object.detail.section.general.title">
            General
          </h3>
          <div class="col-md-6">
            <div class="pull-right">
              <div class="btn-group">
                <button
                  (click)="delete();"
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

      <div [ngSwitch]="initStatus" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
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
              <label for="name" class="control-label" i18n="@@object.detail.section.general.name">
                Name
              </label>
              <p class="form-control-static">{{track.name}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label for="heightAgl" class="control-label" i18n="@@object.detail.section.general.heightAgl">
                Height AGL
              </label>
              <p class="form-control-static">{{track.heightAgl}} [m]</p>
            </div>

            <div class="col-md-6 col-sm-12 form-group">
              <label for="heightAmls" class="control-label" i18n="@@object.detail.section.general.heightAmls">
                Height AMLS
              </label>
              <p class="form-control-static">{{track.heightAmls}} [m]</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label for="verified" class="control-label" i18n="@@object.detail.section.general.temporary">
                Verified
              </label>
              <p class="form-control-static">{{track.verified}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class TrackDetailGeneralViewComponent implements OnInit {
  track: TrackSection;
  @Input() trackId : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  indicator;
  initStatus : number;
  onInitError : ApiError;
  typeName: string;
  type: ElevatedObjectType;
  subtypes: TrackSectionType[];

  constructor(
    private router: Router,
    private objectService : ElevatedObjectService,
    private catalogService : PlacedObjectCatalogService,
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

  allowEdition() {
    this.editChange.emit(true);
  }

  delete() {
    this.objectService
      .delete(this.trackId, this.type.id)
      .then(()=> this.router.navigate(['/objects/search']))
      .catch( error => {
        this.onInitError = error;
        this.initStatus = STATUS_INDICATOR.ERROR;
      })
  }
}
