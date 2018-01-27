import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PlacedObject} from "./placedObject";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ElevatedObjectService} from "./object.service";
import {PlacedObjectCatalogService} from "./object-catalog.service";
import {PlacedObjectType} from "./objectType";
import {ObjectMarkIndicator} from "./objectMarkIndicator";
import {ObjectLighting} from "./objectLighting";
import {ListItem} from "../commons/listItem";
import {ObjectOwnerService} from "../owner/owner.service";
import {LocationService} from "../location/location.service";


@Component({
  selector: 'app-object-general-edit',
  template: `
    <div class="panel panel-default">

      <div class="panel-heading">
        <h3 class="panel-title">General</h3>
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
                (ngSubmit)="onSubmit()">

            <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>

            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputType"
                  class="control-label"
                  i18n="@@object.detail.section.general.type">
                  Type
                </label>
                <select name="inputType"
                        class="form-control"
                        [(ngModel)]="placedObject.typeId"
                        required>
                  <option *ngFor="let type of types;" [value]="type.id">
                    {{type.description}}
                  </option>
                </select>
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
                  <option *ngFor="let lighting of lightnings;" [value]="lighting.id">
                    {{lighting.code}} - {{lighting.description}}
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
                    {{mark.code}} - {{mark.description}}
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
      <br>
    </div>
  `
})


export class PlacedObjectDetailGeneralEditComponent implements OnInit {

  placedObject: PlacedObject;
  @Input() placedObjectId: number;
  @Input() objectTypeId: number;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  status: number;
  onInitError: ApiError;
  onSubmitError: ApiError;
  indicator;
  types: PlacedObjectType[];
  locations: ListItem[];
  lightnings: ObjectLighting[];
  marks: ObjectMarkIndicator[];
  owners: ListItem[];

  constructor(
    private objectService : ElevatedObjectService,
    private catalogService : PlacedObjectCatalogService,
    private ownerService: ObjectOwnerService,
    private locationService: LocationService

  ){
    this.placedObject = new PlacedObject();
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = STATUS_INDICATOR.LOADING;

    this.onInitError = null;

    let p1 = this.catalogService
      .listTypeObject()
      .then(data => this.types = data)
      .catch(error => Promise.reject(error));

    let p2 = this.catalogService
      .listMarkIndicator()
      .then(data => this.marks = data)
      .catch(error => Promise.reject(error));

    let p3 = this.catalogService
      .listLighting()
      .then(data => this.lightnings = data)
      .catch(error => Promise.reject(error));

    let p4 = this.ownerService
      .list()
      .then(data => this.owners = data)
      .catch(error => Promise.reject(error));

    let p5 = this.locationService
      .listDepartaments()
      .then(data => this.locations = data)
      .catch(error => Promise.reject(error));

    let p6 = this.objectService
      .get(this.placedObjectId, this.objectTypeId)
      .then( data => this.placedObject = data)
      .catch(error => Promise.reject(error));

    Promise.all([p1,p2,p3,p4,p5,p6])
      .then(() => this.status = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    console.log(this.placedObject);

    this.objectService
      .update(this.placedObject)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}




