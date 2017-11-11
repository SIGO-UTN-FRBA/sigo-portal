import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {AnalysisCaseService} from "./analysis-case.service";
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
import {OlComponent} from "../olmap/ol.component";
import Map = ol.Map;
import Feature = ol.Feature;
import {AnalysisCase} from "./analysisCase";

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
      <div [ngSwitch]="initStatus" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING" >
            <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <ng-container *ngSwitchCase="indicator.ACTIVE">
          <form #caseForm 
                class="form-inline"
                (ngSubmit)="onUpdateRadius()"
          >
            <div class="form-group">
              <label for="inputSearchRadius" 
                     i18n="@@analysis.wizard.object.section.objects.searchRadius"
              >
                Search Radius
              </label>
              <div class="input-group">
                
                <input type="number" 
                       class="form-control" 
                       name="inputSearchRadius" 
                       [(ngModel)]="searchRadius"
                       required>
                <div class="input-group-addon">[km]</div>
              </div>
            </div>
            <button type="submit"
                    [disabled]="caseForm.invalid"
                    class="btn btn-default"
                    i18n="@commons.button.update"
            >
              Update
            </button>
          </form>
          <br>
          <ng-container [ngSwitch]="updateStatus">

            <div *ngSwitchCase="indicator.LOADING" >
              <app-loading-indicator></app-loading-indicator>
            </div>
            
            <app-error-indicator *ngSwitchCase="indicator.ERROR" [error]="onUpdateError"></app-error-indicator>

            <div *ngSwitchCase="indicator.EMPTY" >
              <app-empty-indicator entity="placed objects" type="included"></app-empty-indicator>
            </div>
            
            
            <div *ngSwitchCase="indicator.ACTIVE" class="table-responsive">
              <table class="table table-hover">
                <tr>
                  <th>#</th>
                  <th i18n="@@analysis.wizard.object.section.objects.name">Name</th>
                  <th i18n="@@analysis.wizard.object.section.objects.type">Type</th>
                  <th i18n="@@analysis.wizard.object.section.objects.included">Included</th>
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
            </div>
          </ng-container>
          <app-map #mapObjects (map)="map"></app-map>
        </ng-container>
      </div>
    </div>
   
    <br>
    
    <nav>
      <ul class="pager">
        <li class="previous disabled">
          <a href="#">
            <span aria-hidden="true">&larr;</span>
            <ng-container i18n="@@commons.wizard.previus"> Previous</ng-container>
          </a>
        </li>
        <li class="next">
          <a href="#">
            <ng-container i18n="@@commons.wizard.next">Next </ng-container>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </li>
      </ul>
    </nav>
  `
})

export class AnalysisWizardObjectComponent implements OnInit, AfterViewInit {

  initStatus:number;
  updateStatus:number;
  submitStatus:number;
  indicator;
  analysis:Analysis;
  analysisId:number;
  analysisCase:AnalysisCase;
  analysisObjects:AnalysisObject[];
  onInitError:ApiError;
  onUpdateError:ApiError;
  onSubmitError:ApiError;
  types:PlacedObjectType[];
  airportFeature: Feature;
  private olmap: OlComponent;
  @ViewChild('mapObjects') set content(content: OlComponent) {
    this.olmap = content;
  }
  map:Map;
  searchRadius:number;

  constructor(
    private analysisService: AnalysisService,
    private caseService : AnalysisCaseService,
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

    this.analysisId = this.route.snapshot.params['analysisId'];
    this.initStatus = STATUS_INDICATOR.LOADING;
    this.onInitError = null;
    this.updateStatus = null;

    let p1 = this.objectCatalogService
      .listTypeObject()
      .then(data => this.types = data)
      .catch(error => Promise.reject(error));

    let p2 = this.resolveAnalysis()
      .then(() => this.resolveAnalysisCase())
      .then(() => this.resolveObjects())
      .catch(error => Promise.reject(error));

    Promise.all([p1, p2])
      .then(() => {
        this.initStatus = STATUS_INDICATOR.ACTIVE;
        this.updateStatus = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.initStatus = STATUS_INDICATOR.ERROR;
      });
  }

  private resolveAnalysis() : Promise<any> {
      return this.analysisService
        .get(this.analysisId)
        .then(data => this.analysis = data)
  }

  private resolveAnalysisCase() : Promise<any> {
    return this.caseService
      .get(this.analysis.id, this.analysis.caseId)
      .then(data => {
        this.analysisCase = data;
        this.searchRadius = data.searchRadius * 100;
      })
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

  private resolveFeatureObjects() : Promise<any> {

    let p1 = this.airportService
      .get(this.analysis.airportId)
      .then(data => this.analysis.airport=data);

    let p3 = this.airportService
      .getFeature(this.analysis.airportId)
      .then(data => this.airportFeature = data);

    let p2 = Promise.all(
      this.analysisObjects.map(a =>
        this.objectService
          .getFeature(a.object.id)
          .then(f => a.object.feature = f)
      )
    );

    return Promise.all([p1,p2,p3]);
  }

  ngAfterViewInit(): void {
    setTimeout(()=> {this.locateFeatures()},3500);
  }

  private locateFeatures() {

    this.analysisObjects.forEach(
      a => this.olmap.addObject(a.object.feature)
    );

    this.olmap.addAirport(this.airportFeature,{center:true, zoom:13});
  }

  locateObject(placedObject: PlacedObject) {

  }

  onUpdateRadius(){

    this.updateStatus = STATUS_INDICATOR.LOADING;
    this.onUpdateError=null;
    this.analysisObjects = [];

    this.caseService
      .update(this.analysis.id, this.analysisCase.id, this.searchRadius / 100)
      .then(data => this.analysisCase = data)
      .then(() => this.clearMapLayers())
      .then(() => this.resolveObjects())
      .then(()=> this.locateFeatures())
      .then(() => {
        if(this.analysisObjects.length > 0)
          this.updateStatus = STATUS_INDICATOR.ACTIVE;
        else
          this.updateStatus = STATUS_INDICATOR.EMPTY;
      })
      .catch(error => {
        this.onUpdateError = error;
        this.updateStatus = STATUS_INDICATOR.ERROR;
      })
  }

  private resolveObjects() : Promise<any> {

    return this.caseService
      .getObjects(this.analysis.id, this.analysisCase.id)
      .then(data => this.analysisObjects = data)
      .then(() => this.resolveDataObjects())
      .then(() => this.resolveFeatureObjects())
  }

  private clearMapLayers() : OlComponent {
    return this.olmap
      .clearObjectLayers()
      .clearAirportLayer()
      .clearRunwayLayer();
  }
}
