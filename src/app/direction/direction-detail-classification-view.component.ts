import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayClassification, RunwayClassificationICAOAnnex14} from "./runwayClassification";
import {DirectionClassificationService} from "./direction-classification.service";
import {ApiError} from "../main/apiError";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {EnumItem} from "../commons/enumItem";

@Component({
  selector: 'app-direction-classification-view',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">

        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.classification.title">
            Classification
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

      <div class="panel-body" [ngSwitch]="status">
        <div *ngSwitchCase="indicator.LOADING" class="container-fluid">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <ng-container [ngSwitch]="classification.type">
            <ng-container *ngSwitchCase="'RunwayClassificationICAOAnnex14'">
              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label class="control-label" i18n="@@direction.detail.section.classification.codeLetter">
                    Code Letter
                  </label>
                  <p class="form-control-static" *ngIf="classificationICAO.runwayTypeLetter !== undefined">{{runwayCodeLetters[classificationICAO.runwayTypeLetter].description}}</p>
                  <p class="form-control-static" *ngIf="classificationICAO.runwayTypeLetter == undefined">(undefined)</p>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label class="control-label" i18n="@@direction.detail.section.classification.codeNumber">
                    Code Number
                  </label>
                  <p class="form-control-static" *ngIf="classificationICAO.runwayTypeNumber !== undefined">{{runwayCodeNumbers[classificationICAO.runwayTypeNumber].description}}</p>
                  <p class="form-control-static" *ngIf="classificationICAO.runwayTypeNumber == undefined">(undefined)</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 col-sm-12 form-group">
                  <label class="control-label" i18n="@@direction.detail.section.classification.runwayClassification">
                    Runway Classification
                  </label>
                  <p class="form-control-static" *ngIf="classificationICAO.runwayClassification !== undefined">{{runwayClassifications[classificationICAO.runwayClassification].description}}</p>
                  <p class="form-control-static" *ngIf="classificationICAO.runwayClassification == undefined">(undefined)</p>
                </div>
                <div class="col-md-6 col-sm-12 form-group">
                  <label class="control-label" i18n="@@direction.detail.section.classification.runwayCategory">
                    Runway Category
                  </label>
                  <p class="form-control-static" *ngIf="classificationICAO.runwayCategory !== undefined">{{runwayCategories[classificationICAO.runwayCategory].description}}</p>
                  <p class="form-control-static" *ngIf="classificationICAO.runwayCategory == undefined">(undefined)</p>
                </div>
              </div>
            </ng-container>
            <ng-container *ngSwitchCase="'RunwayClassificationFAA'">
              <!-- TODO -->
            </ng-container>
          </ng-container>
        </div>
      </div>
    </div>
  `
})

export class DirectionDetailClassificationViewComponent implements OnInit {

  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  @Input() regulationName: string;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  status: number;
  indicator;
  classification: RunwayClassification;
  classificationICAO: RunwayClassificationICAOAnnex14;
  onInitError:ApiError;
  runwayCategories:EnumItem[];
  runwayClassifications: EnumItem[];
  runwayCodeLetters: EnumItem[];
  runwayCodeNumbers: EnumItem[];

  constructor(
    private classificationService:DirectionClassificationService,
    private catalogICAOService:RegulationIcaoService
  ){
    this.indicator= STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = STATUS_INDICATOR.LOADING;

    this.classificationService
      .get(this.airportId, this.runwayId, this.directionId)
      .then(data => {
        this.classification = data;

        switch (data.type){
          case 'RunwayClassificationICAOAnnex14':
            return this.initAsICAO(data);
          case 'RunwayClassificationFAA':
            return this.initAsFAA(data);
        }

        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  private initAsICAO(data) : Promise<any> {

    this.classificationICAO = data as RunwayClassificationICAOAnnex14;

    let p1 = this.catalogICAOService
      .listICAOAnnex14RunwayCategories()
      .then(data => this.runwayCategories = data)
      .catch(error => Promise.reject(error));

    let p2 = this.catalogICAOService
      .listICAOAnnex14RunwayClassifications()
      .then(data => this.runwayClassifications = data)
      .catch(error => Promise.reject(error));

    let p3 = this.catalogICAOService
      .listICAOAnnex14RunwayCodeLetters()
      .then(data => this.runwayCodeLetters = data)
      .catch(error => Promise.reject(error));

    let p4 = this.catalogICAOService
      .listICAOAnnex14RunwayCodeNumbers()
      .then(data => this.runwayCodeNumbers = data)
      .catch(error => Promise.reject(error));

    return Promise.all([p1,p2,p3,p4])
      .then(()=> this.status = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.status = STATUS_INDICATOR.ERROR;
        this.onInitError = error;
      })
  }

  private initAsFAA(data){
      throw new Error("Not implemented.")
  }

  allowEdition() {
    this.editChange.emit(true);
  }
}
