import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {PlacedObjectService} from "./object.service";
import Geometry = ol.geom.Geometry;
import PlacedObjectTypes, {PlacedObjectType} from './objectType';
import {Feature} from "openlayers";
import Polygon = ol.geom.Polygon;
import Point = ol.geom.Point;
import LineString = ol.geom.LineString;
import MultiPolygon = ol.geom.MultiPolygon;
import GeoJSON = ol.format.GeoJSON;

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
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        
        <form  #geometryForm="ngForm"
               *ngSwitchCase="indicator.ACTIVE"
               role="form" 
               class="form container-fluid" 
               (ngSubmit)="onSubmit()">

          <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>
          
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputGeoJSON" class="control-label" i18n="@@object.detail.section.spatial.inputGeoJSON">
                {{geometryType}}
              </label>
              <textarea
                name="inputGeoJSON"
                [(ngModel)]="coordinatesText"
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
  feature: Feature;
  coordinatesText : string;
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
    this.coordinatesText = "";
    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.placedObjectService
      .getFeature(this.placedObjectId)
      .then( data => {
        this.feature = data;
        if(data.getGeometry()){
          let jsonFeature = JSON.parse(new GeoJSON().writeFeature(data));
          this.coordinatesText = JSON.stringify(jsonFeature.geometry.coordinates);
        }
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    let geom : Geometry;

    switch(this.placedObjectType){
      case 0:
        geom = new MultiPolygon(JSON.parse(this.coordinatesText));
        break;
      case 1:
        geom = new Point(JSON.parse(this.coordinatesText));
        break;
      case 2:
        geom = new LineString(JSON.parse(this.coordinatesText));
        break;
    }

    this.placedObjectService
      .updateFeature(this.placedObjectId, geom)
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
