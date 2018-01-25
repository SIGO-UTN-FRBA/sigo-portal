import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PlacedObject} from "./placedObject";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {Router} from "@angular/router";
import {ElevatedObjectService} from "./object.service";
import {ApiError} from "../main/apiError";
import {PlacedObjectType} from "./objectType";
import {PlacedObjectCatalogService} from "./object-catalog.service";
import {ObjectMarkIndicator} from "./objectMarkIndicator";
import {ObjectLighting} from "./objectLighting";
import {LocationService} from "../location/location.service";
import {ObjectOwnerService} from "../owner/owner.service";
import {ObjectOwner} from "../owner/objectOwner";
import {PoliticalLocation} from "../location/location";


@Component({
  selector: 'app-object-general-view',
  template:`
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
          
      <div [ngSwitch]="status" class="panel-body">
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
                  <p class="form-control-static">{{types[placedObject.typeId].description}}</p>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label for="subtype" class="control-label" i18n="@@object.detail.section.general.subtype">
                    Subtype
                  </label>
                  <p class="form-control-static">{{placedObject.subtype}}</p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label for="name" class="control-label" i18n="@@object.detail.section.general.name">
                    Name
                  </label>
                  <p class="form-control-static">{{placedObject.name}}</p>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12 form-group">
                  <label for="ownerId" class="control-label" i18n="@@object.detail.section.general.ownerId">
                    Owner
                  </label>
                  <p class="form-control-static"><a routerLink="/owners/{{owner.id}}/detail">{{owner.name}}</a></p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label for="locationId" class="control-label" i18n="@@object.detail.section.general.locationId">
                    Location
                  </label>
                  <p class="form-control-static">{{politicalLocation.name}}</p>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label for="heightAgl" class="control-label" i18n="@@object.detail.section.general.heightAgl">
                    Height AGL
                  </label>
                  <p class="form-control-static">{{placedObject.heightAgl}} [m]</p>
                </div>

                <div class="col-md-6 col-sm-12 form-group">
                  <label for="heightAmls" class="control-label" i18n="@@object.detail.section.general.heightAmls">
                    Height AMLS
                  </label>
                  <p class="form-control-static">{{placedObject.heightAmls}} [m]</p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label for="lighting" class="control-label" i18n="@@object.detail.section.general.lighting">
                    Lighting Type
                  </label>
                  <p class="form-control-static">{{lightings[placedObject.lightingId].description}}</p>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label for="markIndicator" class="control-label" i18n="@@object.detail.section.general.markIndicator">
                    Mark Indicator
                  </label>
                  <p class="form-control-static">{{marks[placedObject.markIndicatorId].description}}</p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label for="verified" class="control-label" i18n="@@object.detail.section.general.temporary">
                    Verified
                  </label>
                  <p class="form-control-static">{{placedObject.verified}}</p>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label for="temporary" class="control-label" i18n="@@object.detail.section.general.temporary">
                    Temporary
                  </label>
                  <p class="form-control-static">{{placedObject.temporary}}</p>
                </div>
              </div>
          
            </div>
      </div>
    </div>
    `
})


export class PlacedObjectDetailGeneralViewComponent implements OnInit {

  placedObject: PlacedObject;
  @Input() placedObjectId : number;
  @Input() objectTypeId: number;
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  onInitError : ApiError;
  types: PlacedObjectType[];
  owner: ObjectOwner;
  politicalLocation: PoliticalLocation;
  lightings: ObjectLighting[];
  marks: ObjectMarkIndicator[];

  constructor(
    private router: Router,
    private objectService : ElevatedObjectService,
    private catalogService : PlacedObjectCatalogService,
    private locationService: LocationService,
    private ownerService: ObjectOwnerService
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
      .then(data => this.lightings = data)
      .catch(error => Promise.reject(error));

    let p4 = this.objectService
      .get(this.placedObjectId, this.objectTypeId)
      .then( data => this.placedObject = data)
      .then(()=> this.locationService.get(this.placedObject.locationId))
      .then(data => this.politicalLocation = data )
      .then(()=> this.ownerService.get(this.placedObject.ownerId))
      .then(data => this.owner = data)
      .catch(error => Promise.reject(error));

    Promise.all([p1,p2,p3,p4])
      .then(() => this.status = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  delete() {
    this.objectService
      .delete(this.placedObjectId)
      .then(()=> this.router.navigate(['/objects']))
      .catch( error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }
}
