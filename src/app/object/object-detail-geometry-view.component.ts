import {
  AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import Map = ol.Map;
import {OlComponent} from "../olmap/ol.component";
import {ApiError} from "../main/apiError";
import Geometry = ol.geom.Geometry;
import {PlacedObjectService} from "./object.service";
import PlacedObjectTypes from "./objectType";

@Component({
  selector: 'app-object-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@object.detail.section.spatial.title">
            Spatial
          </h3>
          <div class="col-md-6 btn-group">
            <a
              (click)="allowEdition();"
              class="btn btn-default pull-right"
              i18n="@@commons.button.edit">
              Edit
            </a>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>

      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING" class="container-fluid">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="definition" [entity]="geometryType"></app-empty-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <div class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label">
                  {{geometryType}}
                </label>
                <p class="form-control-static">{{geomText}}</p>
              </div>
            </div>
          </div>
          <br>
          <app-map #mapPlacedObject (map)="map"></app-map>
        </div>
      </div>
      
    </div>
  `
})

export class PlacedObjectDetailGeometryViewComponent implements OnInit, AfterViewInit{

  @Input() placedObjectId: number;
  @Input() placedObjectType: number;
  map: Map;
  private olmap: OlComponent;
  onInitError :ApiError;
  geometryType: string;
  @ViewChild('mapPlacedObject') set content(content: OlComponent) {this.olmap = content}
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  geom  : Geometry;
  geomText : string;

  constructor(
    private placedObjectService : PlacedObjectService,
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.geometryType = PlacedObjectTypes[this.placedObjectType].geometry;

    this.status = STATUS_INDICATOR.LOADING;

    this.placedObjectService
      .getGeom(this.placedObjectId)
      .then((geometry : Geometry) => {

        if(!geometry)
          this.status = STATUS_INDICATOR.EMPTY;
        else {
          this.geom = geometry;
          this.geomText = JSON.stringify(geometry);
          this.status = STATUS_INDICATOR.ACTIVE;
        }
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  ngAfterViewInit(): void {
    setTimeout(()=> {if (this.geom != null) this.locateGeom(); },1500);
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  locateGeom(){

    switch (this.placedObjectType){
      case 1:
        this.olmap.addIndividualObject(this.geom, {center: true, zoom: 16});
        break;
      case 2:
        this.olmap.addWiringObject(this.geom, {center: true, zoom: 16});
        break;
      case 0:
        this.olmap.addBuildingObject(this.geom, {center: true, zoom: 16});
        break;
    }

  }
}
