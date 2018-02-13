import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ObjectOwnerService} from '../owner/owner.service';
import {PlacedObjectCatalogService} from './object-catalog.service';
import {ObjectLighting} from './objectLighting';
import {ObjectMarkIndicator} from './objectMarkIndicator';
import {ListItem} from '../commons/listItem';
import {LocationService} from '../location/location.service';
import {ElevatedObjectService} from './object.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {ApiError} from '../main/apiError';
import {PlacedObject} from './placedObject';
import {ElevatedObjectType} from './objectType';

@Component({
  template:`
    <h1 i18n="@@object.new.placed.title">
      New placed object
    </h1>
    <p i18n="@@object.new.placed.main_description">
      This section allows users to create a placed object.
    </p>
    <hr/>

    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@object.new.placed.detail.section.general.title">
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
          <div *ngSwitchCase="indicator.ACTIVE" class="container-fluid">
            <form id="ngForm"
                  #objectForm="ngForm"
                  role="form"
                  class="form container-fluid"
                  (ngSubmit)="onSubmit()"
            >

              <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>

              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label
                    for="inputType"
                    class="control-label"
                    i18n="@@object.detail.section.general.type">
                    Type
                  </label>
                  <p class="form-control-static">
                    {{typeName}}
                  </p>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label
                    for="inputSubtype"
                    class="control-label"
                    i18n="@@object.detail.section.general.subtype">
                    Subtype
                  </label>
                  <input type="text"
                         name="inputSubtype"
                         [(ngModel)]="placedObject.subtype"
                         class="form-control"
                         maxlength="140"
                         minlength="3"
                         required
                  >
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
                         [(ngModel)]="placedObject.name"
                         type="text"
                         required
                  >
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label class="control-label"
                         for="inputOwner"
                         i18n="@@object.detail.general.owner">
                    Owner
                  </label>
                  <select name="inputOwner"
                          class="form-control"
                          [(ngModel)]="placedObject.ownerId"
                          required>
                    <option *ngFor="let owner of owners" [value]="owner.key">
                      {{owner.value}}
                    </option>
                  </select>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label class="control-label"
                         for="inputLocation"
                         i18n="@@object.detail.general.location">
                    Location
                  </label>
                  <select name="inputLocation"
                          class="form-control"
                          [(ngModel)]="placedObject.locationId"
                          required>
                    <option *ngFor="let location of locations" [value]="location.key">
                      {{location.value}}
                    </option>
                  </select>
                </div>
              </div>
              <br>
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
                           [(ngModel)]="placedObject.heightAgl"
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
                           [(ngModel)]="placedObject.heightAmls"
                           required>
                    <div class="input-group-addon">[m]</div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label class="control-label"
                         for="inputLighting"
                         i18n="@@object.detail.general.lighting">
                    Lighting Type
                  </label>
                  <select name="inputLighting"
                          [(ngModel)]="placedObject.lightingId"
                          class="form-control"
                          required>
                    <option *ngFor="let lighting of lightings;" [value]="lighting.id">
                      {{lighting.description}}
                    </option>
                  </select>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label class="control-label"
                         for="inputMarkIndicator"
                         i18n="@@object.detail.general.markIndicator">
                    Mark Indicator
                  </label>
                  <select name="inputMarkIndicator"
                          [(ngModel)]="placedObject.markIndicatorId"
                          class="form-control"
                          required>
                    <option *ngFor="let mark of marks;" [value]="mark.id">
                      {{mark.description}}
                    </option>
                  </select>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col-md-3 col-sm-6 form-group">
                  <input type="checkbox"
                         name="inputVerified"
                         [(ngModel)]="placedObject.verified"
                  >
                  <label class="control-label"
                         for="inputVerified"
                         i18n="@@object.detail.general.verified">
                    Verified
                  </label>
                </div>
                <div class="col-md-3 col-sm-6 form-group">
                  <input type="checkbox"
                         name="inputTemporary"
                         [(ngModel)]="placedObject.temporary"
                  >
                  <label class="control-label"
                         for="inputVerified"
                         i18n="@@object.detail.general.temporary">
                    Temporary
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

export class ObjectNewPlacedComponent {
  status: number;
  indicator;
  placedObject: PlacedObject;
  onInitError: ApiError;
  onSubmitError: ApiError;
  types: ElevatedObjectType[];
  locations: ListItem[];
  lightings: ObjectLighting[];
  marks: ObjectMarkIndicator[];
  owners: ListItem[];
  typeName: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private objectService: ElevatedObjectService,
    private catalogService: PlacedObjectCatalogService,
    private ownerService: ObjectOwnerService,
    private locationService: LocationService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    debugger;
    this.onInitError = null;
    this.status = STATUS_INDICATOR.LOADING;
    let typeId =+this.route.snapshot.queryParamMap.get("type");

    this.placedObject = new PlacedObject(typeId);
    this.placedObject.temporary = false;
    this.placedObject.verified = false;

    Promise.all([
      this.resolveTypes(),
      this.resolveLights(),
      this.resolveMarks(),
      this.resolveOwners(),
      this.resolveLocations()
    ])
      .then(()=> {
        this.typeName = this.types.find(t => t.id == typeId).description;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  private resolveTypes() {
    return this.catalogService
      .listTypeObject()
      .then(data => this.types = data)
      .catch(error => Promise.reject(error));
  }

  private resolveLights() {
    return this.catalogService
      .listLighting()
      .then(data => this.lightings = data)
      .catch(error => Promise.reject(error));
  }

  private resolveMarks() {
    return this.catalogService
      .listMarkIndicator()
      .then(data => this.marks = data)
      .catch(error => Promise.reject(error));
  }

  private resolveOwners() {
    return this.ownerService
      .list()
      .then(data => this.owners = data)
      .catch(error => Promise.reject(error));
  }

  private resolveLocations() {
    return this.locationService
      .listDepartaments()
      .then(data => this.locations = data)
      .catch(error => Promise.reject(error));
  }

  onSubmit() {

    this.onSubmitError = null;

    this.objectService
      .save(this.placedObject)
      .then(data => this.router.navigateByUrl(`/objects/${data.typeId}/${data.id}/detail`))
      .catch(error => this.onSubmitError = error);
  };

  onCancel() {
    return this.router.navigateByUrl(`/objects/search`)
  };
}
