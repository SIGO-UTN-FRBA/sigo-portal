import {
  AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild
} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import Point = ol.geom.Point;
import Map = ol.Map;
import {OlComponent} from "../olmap/ol.component";
import {DirectionService} from "./direction.service";
import {ApiError} from "../main/apiError";
import Polygon = ol.geom.Polygon;
import {DirectionDistancesService} from "./direction-distances.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-direction-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.spatial.title">
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
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <div class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label" i18n="@@direction.detail.section.spatial.inputGeoJSON">
                  Point
                </label>
                <p class="form-control-static">{{geomText}}</p>
              </div>
            </div>
          </div>
          <br>
          <app-map #mapDirection (map)="map"></app-map>
        </div>
        
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="definition" entity="point"></app-empty-indicator>
        </div>
      </div>
      
    </div>
  `
})

export class DirectionDetailGeometryViewComponent implements OnInit, AfterViewInit, OnDestroy{

  @Input() airportId : number;
  @Input() runwayId : number;
  @Input() directionId : number;
  map: Map;
  private olmap: OlComponent;
  onInitError: ApiError;
  @ViewChild('mapDirection') set content(content: OlComponent) {
    this.olmap = content;
  }
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  geom  : Point;
  geomText : string;
  thresholdGeom : Polygon;
  subscription: Subscription;

  constructor(
    private directionService : DirectionService,
    private distancesService : DirectionDistancesService
  ){
    this.geom = null;
    this.indicator = STATUS_INDICATOR;

    this.subscription = this.distancesService.lengthUpdated$.subscribe(
      () => this.loadGeometries()
        .then(()=> this.olmap.clearDirectionLayer())
        .then(()=> this.olmap.clearDisplacedThresholdLayer())
        .then(()=> this.locateGeometries())
    );
  }

  ngOnInit(): void {
    this.status = STATUS_INDICATOR.LOADING;
    this.geom = null;
    this.onInitError = null;

    this.loadGeometries()
      .then(() => {
        if(this.geom != null)
          this.status = STATUS_INDICATOR.ACTIVE;
        else
          this.status = STATUS_INDICATOR.EMPTY;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  private loadGeometries() : Promise<any> {

    return this.directionService
      .getGeom(this.airportId, this.runwayId, this.directionId)
      .then(point => {

        if(point != null){
          this.geom = point;
          this.geomText = JSON.stringify(point);
        }

        return point;
      })
      .catch(error => Promise.reject(error))
      .then(point => {

        if(point != null)
          return this.directionService
            .getDisplacedThresholdGeom(this.airportId, this.runwayId, this.directionId);
        else
          return null;

      })
      .catch(error => Promise.reject(error))
      .then(polygon => this.thresholdGeom = polygon);
  }

  ngAfterViewInit(): void {
    setTimeout(()=> this.locateGeometries(),1500);
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  private locateGeometries(){
      this.olmap
        .addDirection(this.geom, {center: true, zoom: 15})
        .addThreshold(this.thresholdGeom);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
