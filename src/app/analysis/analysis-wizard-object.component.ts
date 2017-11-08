import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {AnalysisObjectService} from "./analysis-object.service";
import {ActivatedRoute} from "@angular/router";
import {AnalysisObject} from "./analysisObject";
import {PlacedObjectService} from "../object/object.service";
import {PlacedObject} from "../object/object";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";
import {PlacedObjectType} from "../object/objectType";
import {PlacedObjectCatalogService} from "../object/object-catalog.service";
import {AnalysisService} from "./analysis.service";
import {Analysis} from "./analysis";
import {AirportService} from "../airport/airport.service";
import Point = ol.geom.Point;
import {OlComponent} from "../olmap/ol.component";
import Map = ol.Map;

@Component({
  providers: [ OlComponent ],
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.object.title">Analysis: Define objects </ng-container>
      <small class="pull-right">Stage 1/4</small>
    </h1>
    <p i18n="@@wizard.object.main_description">
      This section allows users to define which objects are going to be analyzed.
    </p>
    <hr/>
    
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title" i18n="@@analysis.wizard.object.section.objects.title">
          Objects
        </h3>
      </div>
      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING" >
            <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="include" entity="objects"></app-empty-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="table-responsive">
          <table class="table table-hover">
            <tr>
              <th>#</th>
              <th i18n="@@commons.label.name">Name</th>
              <th i18n="@@commons.label.type">Type</th>
              <th i18n="@@commons.label.included">Included</th>
            </tr>
            <tbody>
              <tr *ngFor="let analysisObject of analysisObjects; index as i;">
                <td><strong>{{i+1}}</strong></td>
                <td>
                  <a [routerLink]="['/objects', analysisObject.object.typeId, analysisObject.object.id]">
                    {{analysisObject.object.name}}
                  </a>
                </td>
                <td>
                  {{types[analysisObject.object.typeId].description}}
                </td>
                <td>
                  <input type="checkbox" [ngModel]="analysisObject.included">
                </td>
              </tr>
            </tbody>
          </table>
          <br>
          <app-map #mapObjects (map)="map"></app-map>
        </div>
      </div>
    </div>
    <br>
    <nav>
      <ul class="pager">
        <li class="previous disabled"><a href="#"><span aria-hidden="true">&larr;</span> Previous</a></li>
        <li class="next"><a href="#">Next <span aria-hidden="true">&rarr;</span></a></li>
      </ul>
    </nav>
  `
})

export class AnalysisWizardObjectComponent implements OnInit, AfterViewInit {

  status:number;
  indicator;
  analysis:Analysis;
  analysisObjects:AnalysisObject[];
  onInitError:ApiError;
  types:PlacedObjectType[];
  airportGeom: Point;
  private olmap: OlComponent;
  @ViewChild('mapObjects') set content(content: OlComponent) {
    this.olmap = content;
  }
  map:Map;

  constructor(
    private analysisService: AnalysisService,
    private analysisObjectService : AnalysisObjectService,
    private objectService:PlacedObjectService,
    private objectCatalogService: PlacedObjectCatalogService,
    private airportService:AirportService,
    private route: ActivatedRoute
  ){
    this.analysisObjects = [];
    this.indicator = STATUS_INDICATOR;
    this.types = [];
  }

  ngOnInit(): void {

    let analysisId : number = this.route.snapshot.params['analysisId'];
    this.status = STATUS_INDICATOR.LOADING;
    this.onInitError = null;

    let p1 = this.objectCatalogService
      .listTypeObject()
      .then(data => this.types = data)
      .catch(error => Promise.reject(error));

    let p2 = this.analysisService
      .get(analysisId)
      .then(data => this.analysis = data)
      .then(() =>  this.analysisObjectService.getList(this.analysis.caseId))
      .then(data => this.analysisObjects = data)
      .then(() => this.resolveDataObjects())
      .then(()=> this.resolveGeometries())
      .catch(error => Promise.reject(error));

    Promise.all([p1, p2])
      .then(()=> {
        if(this.analysisObjects.length == 0 )
          this.status = STATUS_INDICATOR.EMPTY;
        else
          this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  private resolveDataObjects() : Promise<any> {
      return Promise.all(
        this.analysisObjects
          .map(a =>
            this.objectService
              .get(a.objectId)
              .then(o => a.object = o)
          )
      );
  }

  private resolveGeometries() : Promise<any> {

    let p1 = this.airportService
      .get(this.analysis.airportId)
      .then(data => this.analysis.airport=data)
/* TODO
    let p3 = this.airportService
      .getFeature(this.analysis.airportId)
      .then(data => this.airportGeom = data);
*/
    let p2 = Promise.all(
      this.analysisObjects.map(a =>
        this.objectService
          .getGeom(a.object.id)
          .then(g => a.object.geom = g)
      )
    );

    return Promise.all([p1,p2]);
  }

  ngAfterViewInit(): void {
    setTimeout(()=> {this.locateGeometries()},1500);
  }

  private locateGeometries() {

    this.analysisObjects.forEach(a => {
      switch (a.object.typeId){
        case 0:
          this.olmap.addBuildingObject(a.object.geom);
          break;
        case 1:
          this.olmap.addIndividualObject(a.object.geom);
          break;
        case 2:
          this.olmap.addWiringObject(a.object.geom);
          break;
      }
    });
/* TODO
    this.olmap.addAirport(
      this.airportGeom,
      {id: this.analysis.airportId, name: this.analysis.airport.codeFIR},
      {center:true, zoom:13}
    );
    */
  }

  locateObject(placedObject: PlacedObject) {

  }
}
