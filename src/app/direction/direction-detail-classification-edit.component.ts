import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RunwayClassification, RunwayClassificationICAOAnnex14} from "./runwayClassification";
import {ApiError} from "../main/apiError";
import {DirectionClassificationService} from "./direction-classification.service";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {EnumItem} from "../commons/enumItem";
import {STATUS_INDICATOR} from "../commons/status-indicator";

@Component({
  selector: 'app-direction-classification-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.classification.title">
            Classification
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
        <ng-container *ngSwitchCase="indicator.ACTIVE">
          <ng-container [ngSwitch]="classification.type">
            
            <ng-container *ngSwitchCase="'RunwayClassificationICAOAnnex14'">
              
              <form #classificationICAOForm="ngForm"
                  role="form"
                  class="form container-fluid"
                  (ngSubmit)="onSubmit(classificationICAO)">

                <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>
            
                <div class="row">
                  <div class="col-md-6 col-sm-12 form-group">
                    <label class="control-label"
                           for="inputCodeLetter"
                           i18n="@@direction.detail.section.classification.codeLetter">
                      Code Letter
                    </label>
                    <select name="inputCodeLetter"
                            [(ngModel)]="classificationICAO.runwayTypeLetter"
                            class="form-control"
                            required>
                      <option *ngFor="let item of runwayCodeLetters" [value]="item.id">
                        {{item.name}}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6 col-sm-12 form-group">
                    <label class="control-label"
                           for="inputCodeNumber"
                           i18n="@@direction.detail.section.classification.codeNumber">
                      Code Number
                    </label>
                    <select name="inputCodeNumber"
                            [(ngModel)]="classificationICAO.runwayTypeNumber"
                            class="form-control"
                            required>
                      <option *ngFor="let item of runwayCodeNumbers" [value]="item.id">
                        {{item.name}}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 col-sm-12 form-group">
                    <label class="control-label"
                           for="inputRunwayClassification"
                           i18n="@@direction.detail.section.classification.runwayClassification">
                      Runway Classification
                    </label>
                    <select name="inputRunwayClassification"
                            [(ngModel)]="classificationICAO.runwayClassification"
                            class="form-control"
                            required>
                      <option *ngFor="let item of runwayClassifications" [value]="item.id">
                        {{item.name}}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6 col-sm-12 form-group">
                    <label class="control-label"
                           for="inputRunwayCategory"
                           i18n="@@direction.detail.section.classification.runwayCategory">
                      Runway Category
                    </label>
                    <select name="inputRunwayCategory"
                            [(ngModel)]="classificationICAO.runwayCategory"
                            class="form-control"
                            required>
                      <option *ngFor="let item of runwayCategories" [value]="item.id">
                        {{item.name}}
                      </option>
                    </select>
                  </div>
                </div>
                
                <hr>
                
                <div class="row">
                  <div class="pull-right">
                    <button
                      (click)="onCancel()"
                      type="button"
                      class="btn btn-default"
                      i18n="@@commons.button.cancel">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      [disabled]="classificationICAOForm.invalid"
                      class="btn btn-success"
                      i18n="@@commons.button.save">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </ng-container>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `
})

export class DirectionDetailClassificationEditComponent implements OnInit {

  classification:RunwayClassification;
  classificationICAO : RunwayClassificationICAOAnnex14;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  runwayCategories:EnumItem[];
  runwayClassifications: EnumItem[];
  runwayCodeLetters: EnumItem[];
  runwayCodeNumbers: EnumItem[];
  status: number;
  indicator;
  onInitError: ApiError;
  onSubmitError: ApiError;

  constructor(
    private catalogICAOService:RegulationIcaoService,
    private classificationService:DirectionClassificationService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = STATUS_INDICATOR.LOADING;

    this.onInitError = null;

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
      })
      .then(()=>this.status=STATUS_INDICATOR.ACTIVE)
      .catch(error =>{
        this.onInitError= error;
        this.status=STATUS_INDICATOR.ERROR;
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

  initAsFAA(data) {
    throw new Error("Not implemented");
  }

  onSubmit(classification:RunwayClassification){
    this.onSubmitError = null;

    this.classificationService
      .update(this.airportId, this.runwayId, this.directionId, classification)
      .then(()=> this.disallowEdition())
      .catch(error => this.onSubmitError = error);
  }

  onCancel(){
    this.disallowEdition();
  }

  disallowEdition() {
    this.editChange.emit(false);
  }
}
