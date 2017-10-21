import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {PlacedObjectService} from "./object.service";
import Geometry = ol.geom.Geometry;
import PlacedObjectTypes, {PlacedObjectType} from './objectType';

@Component({
  selector: 'app-object-geometry-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@object.detail.section.spatial.title">
            Spatial
          </h3>
        </div>
      </div>

      <div class="panel-body" [ngSwitch]="status">

        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        
        <form  #geometryForm="ngForm"
               *ngSwitchCase="indicator.ACTIVE"
               role="form" 
               class="form container-fluid" 
               (ngSubmit)="onSubmit()">

          <app-error-indicator [error]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>
          
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputGeoJSON" class="control-label" i18n="@@object.detail.section.spatial.inputGeoJSON">
                {{geometryType}}
              </label>
              <textarea
                name="inputGeoJSON"
                [(ngModel)]="geomText"
                class="form-control"
                [placeholder]=""
                rows="3"
                required>
              </textarea>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="pull-right">
              <button
                (click)="onCancel()"
                type="button"
                class="btn btn-danger"
                i18n="@@commons.button.cancel">
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="geometryForm.invalid"
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

export class PlacedObjectDetailGeometryEditComponent implements OnInit {
  geom: Geometry;
  geomText : string;
  @Input() placedObjectId: number;
  @Input() placedObjectType: number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  onInitError : ApiError;
  onSubmitError : ApiError;
  indicator;
  status : number;
  geometryType :string;

  constructor(
    private placedObjectService : PlacedObjectService,
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.geometryType = PlacedObjectTypes[this.placedObjectType].geometry;

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.placedObjectService
      .getGeom(this.placedObjectId)
      .then( data => {
        this.geom = data;
        this.geomText = JSON.stringify(data);
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    let geometry : Geometry = JSON.parse(this.geomText) as Geometry;

    this.placedObjectService
      .saveGeom(this.placedObjectId, geometry)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError= error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
