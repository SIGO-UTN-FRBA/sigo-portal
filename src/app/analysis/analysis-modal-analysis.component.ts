import {BsModalRef} from 'ngx-bootstrap';
import {Component, OnInit} from '@angular/core';
import {AnalysisResult} from './analysisResult';
import {AnalysisResultReason} from './analysisResultReason';
import {AnalysisResultService} from './analysis-result.service';
import {AnalysisObstacle} from './analysisObstacle';

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
                for="inputIsObstacle"
                class="control-label"
                i18n="@@analysis.modal.analysis.inputIsObstacle">
                Is an obstacle?
              </label>
              <select
                class="form-control"
                name="inputIsObstacle"
                [(ngModel)]="result.obstacle"
                (ngModelChange)="updateObstacle()"
                required>
                <option [ngValue]="true" i18n="@@commons.button.yes">Yes</option>
                <option [ngValue]="false" i18n="@@commons.button.no">No</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputKeep"
                class="control-label"
                i18n="@@analysis.modal.analysis.inputKeep">
                Keep?
              </label>
              <select
                class="form-control"
                name="inputKeep"
                [(ngModel)]="result.keep"
                (ngModelChange)="updateKeep()"
                required>
                <option [ngValue]="true" i18n="@@commons.button.yes">Yes</option>
                <option [ngValue]="false" i18n="@@commons.button.no">No</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputReason"
                class="control-label"
                i18n="@@analysis.modal.analysis.inputReason">
                Reason?
              </label>
              <select
                class="form-control"
                name="inputReason"
                [(ngModel)]="result.reasonId"
                required
              >
                <option *ngFor="let reason of filteredReasons" [ngValue]="reason.id" >
                  {{reason.description}}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label
                for="inputDetail"
                class="control-label"
                i18n="@@analysis.modal.analysis.inputDetail">
                Reason details
              </label>
              <textarea name="inputDetail"
                        class="form-control"
                        [(ngModel)]="result.reasonDetail"
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
  filteredReasons: AnalysisResultReason[];
  reasons: AnalysisResultReason[];

  constructor(
    private resultService : AnalysisResultService,
    private bsModalRef: BsModalRef
  ) {
    this.result = null;
    this.reasons = [];
  }

  ngOnInit(): void {
    this.resultService
      .getReasons()
      .then(data => this.reasons = data);
      //TODO catch error
  }

  onCancel(){
    this.bsModalRef.hide();
  }

  onSubmit(){
    this.resultService
      .save(this.obstacle.caseId, this.result.obstacleId, this.result)
      .then(() => this.bsModalRef.hide()) //TODO update summary
      .catch() //TODO catch error
  }

  updateObstacle() {
    this.result.keep = !this.result.obstacle;
    this.updateKeep();
  }

  updateKeep() {
    this.result.reason = null;
    this.result.reasonDetail = "";
    this.filteredReasons = this.reasons.filter( reason =>
      reason.obstacle == this.result.obstacle && reason.keep == this.result.keep)
  }
}
