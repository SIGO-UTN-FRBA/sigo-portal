import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren
} from '@angular/core';
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {OlComponent} from "../olmap/ol.component";
import {ApiError} from "../main/apiError";
import {ElevatedObjectService} from "./object.service";
import Feature = ol.Feature;
import GeoJSON = ol.format.GeoJSON;
import {ElevatedObjectTypeFactory} from './objectType';

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
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <div class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label">
                  {{geometryType}}
                </label>
                <p class="form-control-static">{{coordinatesText}}</p>
              </div>
            </div>
          </div>
          <br>
          <app-map #mapPlacedObject
                   [rotate]="true"
                   [fullScreen]="true"
                   [scale]="true"
                   [layers]="['individual', 'building', 'wire', 'road', 'highway', 'railway']"
          >
          </app-map>
        </div>
      </div>
      
    </div>
  `
})

export class PlacedObjectDetailGeometryViewComponent implements OnInit, AfterViewInit{

  @Input() objectId: number;
  @Input() objectType: number;
  private olmap: OlComponent;
  onInitError :ApiError;
  geometryType: string;
  @ViewChildren('mapPlacedObject') mapPlacedObject: QueryList<ElementRef>;
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  feature  : Feature;
  coordinatesText : string;

  constructor(
    private placedObjectService : ElevatedObjectService,
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    let type = ElevatedObjectTypeFactory.getTypeById(this.objectType);
    this.geometryType = type.geometry;
    this.coordinatesText = '';
    this.status = STATUS_INDICATOR.LOADING;

    this.placedObjectService
      .getFeature(this.objectId, this.objectType)
      .then((data) => {

        if(!data.getGeometry())
          this.status = STATUS_INDICATOR.EMPTY;
        else {
          this.feature = data;
          let jsonFeature = JSON.parse(new GeoJSON().writeFeature(data));
          this.coordinatesText = JSON.stringify(jsonFeature.geometry.coordinates);
          this.status = STATUS_INDICATOR.ACTIVE;
        }
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  ngAfterViewInit(): void {
    this.mapPlacedObject.changes.subscribe(item => {
      if(!(this.olmap = item.first))
        return;

      this.locateFeature();
    });
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  locateFeature(){
    this.olmap.addObject(this.feature, {center: true, zoom: 16});
  }
}
