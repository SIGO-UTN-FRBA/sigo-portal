import {BsModalRef} from 'ngx-bootstrap';
import {Component, OnInit} from '@angular/core';
import {AnalysisResult} from './analysisResult';
import {AnalysisResultService} from './analysis-result.service';
import {AnalysisObstacle} from './analysisObstacle';
import {AnalysisAspect} from './analysisAspect';
import {AnalysisMitigation} from './analysisMitigation';

@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">Edit analysis obstacle result</h4>
      <button type="button" 
              class="close pull-right" 
              aria-label="Close" 
              (click)="onCancel()"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <ng-container *ngIf="result">
      <div class="modal-body">
        <form #resultForm="ngForm"
              role="form" 
              class="form"
              (ngSubmit)="onSubmit()"
        >
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputHasAdverseEffect"
                class="control-label"
                i18n="@@analysis.modal.analysis.inputHasAdverseEffect">
                Has adverse effect?
              </label>
              <select
                class="form-control"
                name="inputHasAdverseEffect"
                [(ngModel)]="result.hasAdverseEffect"
                (ngModelChange)="updateAdverseEffect()"
                required>
                <option [ngValue]="true" i18n="@@commons.button.yes">Yes</option>
                <option [ngValue]="false" i18n="@@commons.button.no">No</option>
              </select>
            </div>
          </div>
          <div class="row" *ngIf="result.hasAdverseEffect">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputAspect"
                class="control-label"
                i18n="@@analysis.modal.analysis.inputAspect">
                Which aspect?
              </label>
              <select
                class="form-control"
                name="inputAspect"
                [(ngModel)]="result.aspectId"
                (ngModelChange)="updateAspect()"
                [required]="result.hasAdverseEffect"
              >
                <option *ngFor="let aspect of aspects" [ngValue]="aspect.id">{{aspect.name}}</option>
              </select>
            </div>
          </div>
          <div class="row" *ngIf="result.hasAdverseEffect">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for=""
                class="control-label"
                i18n="@@analysis.modal.analysis.inputMitigation">
                Apply any mitigation measures?
              </label>
            </div>
            <div class="col-md-12 col-sm-12">
              <p *ngFor="let mitigation of mitigationMeasures">
                <input type="checkbox" [checked]="result.mitigationMeasuresIds.indexOf(mitigation.id) != -1" [value]="mitigation.id" (change)="toggleMitigationCheck($event)"/> {{mitigation.name}}. <i>{{(mitigation.operationDamage)? "Unacceptable": "Acceptable"}}</i>
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputAllowed"
                class="control-label"
                i18n="@@analysis.modal.analysis.inputAllowed">
                Is allowed?
              </label>
              <select
                class="form-control"
                name="inputAllowed"
                [(ngModel)]="result.allowed"
                required
              >
                <option [ngValue]="true" i18n="@@commons.button.yes">Yes</option>
                <option [ngValue]="false" i18n="@@commons.button.no">No</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputDetail"
                class="control-label"
                i18n="@@analysis.modal.analysis.inputDetail">
                More details
              </label>
              <textarea name="inputDetail"
                        class="form-control"
                        [(ngModel)]="result.extraDetail"
                        required
              >
              </textarea>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button"
                class="btn btn-primary"
                (click)="resultForm.ngSubmit.emit()"
                [disabled]="!resultForm.form.valid"
                i18n="@@commons.button.save"
        >
          Save
        </button>
        <button type="button"
                class="btn btn-default"
                (click)="onCancel()"
                i18n="@@commons.button.cancel"
        >
          Cancel
        </button>
      </div>
    </ng-container>
  `
})
export class AnalysisModalAnalysisComponent implements OnInit {

  obstacle: AnalysisObstacle;
  result:AnalysisResult;
  aspects: AnalysisAspect[];
  mitigationMeasures: AnalysisMitigation[];

  constructor(
    private resultService : AnalysisResultService,
    private bsModalRef: BsModalRef
  ) {
    this.result = null;
    this.aspects = [];
  }

  ngOnInit(): void {
    this.resultService
      .getAspects()
      .then(data => this.aspects = data)
      .then(() => Promise.all(this.aspects.map(a => this.resultService.getMitigationMeasuresByAspect(a.id).then(data => a.mitigationMeasures = data))))
      .then(() => this.result.aspect = this.aspects.find(a => this.result.aspectId == a.id))
      .then(() => this.mitigationMeasures = (this.result.aspectId) ? this.result.aspect.mitigationMeasures : []);
  }

  onCancel(){
    this.bsModalRef.hide();
  }

  onSubmit(){
    this.resultService
      .save(this.obstacle.caseId, this.result.obstacleId, this.result)
      .then(() => this.bsModalRef.hide())
      //TODO catch error .catch()
  }

  updateAdverseEffect() {
    this.result.aspectId = null;
    if(!this.result.hasAdverseEffect){
      this.result.allowed = true;
    } else {
      this.result.allowed = null;
    }
    this.updateAspect();
  }

  updateAspect() {
    if(this.result.hasAdverseEffect){
      this.result.aspect = (this.result.aspectId) ? this.aspects.find( a => a.id == this.result.aspectId) : null;
      this.result.mitigationMeasuresIds = [];
      this.mitigationMeasures = (this.result.aspectId) ? this.result.aspect.mitigationMeasures : [];

      this.updateMitigationMeasures();
    }
    else {
      this.result.aspectId = null;
      this.result.aspect = null;
      this.result.mitigationMeasuresIds = null;
    }
  }

  toggleMitigationCheck(event){

    if(event.target.checked){
      this.result.mitigationMeasuresIds.push(event.target.value);
    } else {
      this.result.mitigationMeasuresIds.splice(this.result.mitigationMeasuresIds.indexOf(event.target.value),1);
    }

    this.updateMitigationMeasures();
  }

  updateMitigationMeasures(){

    if(this.result.mitigationMeasuresIds.length == 0){
      this.result.allowed = null;
    }
    else {
      this.result.mitigationMeasures = this.result.mitigationMeasuresIds.map( id => this.result.aspect.mitigationMeasures.find( m => m.id == id));
      this.result.allowed = this.result.mitigationMeasures.every( m => !m.operationDamage);
    }
  }
}
