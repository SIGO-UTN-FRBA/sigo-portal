import {Component, OnInit} from "@angular/core";
import {AnalysisExceptionService, ExceptionType} from "./analysis-exception.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';

@Component({
  template:`
    <h1 i18n="@@exception.new.title">
      New analysis exception
    </h1>
    <p i18n="@@exception.new.main_description">
      This section allows users to select a kind of exception to be created.
    </p>
    <hr/>
    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-body">
          <form id="ngForm"
                #exceptionForm="ngForm"
                role="form"
                class="form container-fluid"
                (ngSubmit)="onSubmit()">
            <div class="form-group" *ngFor="let type of types">
              <div class="col-sm-12">
                <div class="radio">
                  <label for="options">
                    <input type="radio"
                           name="options"
                           [value]="type.raw.code"
                           [(ngModel)]="type.check"
                           required
                    />
                    {{type.raw.name}}
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <br>
      <div class="row">
        <div class="pull-right">
          <button
            type="button"
            (click)="onCancel()"
            class="btn btn-default"
            i18n="@@commons.button.cancel">
            Cancel
          </button>
          <button
            type="button"
            (click)="exceptionForm.ngSubmit.emit()"
            [disabled]="exceptionForm.form.invalid"
            class="btn btn-success"
            i18n="@@commons.button.create">
            Create
          </button>
        </div>
      </div>
    </div>
  `
})

export class ExceptionNewComponent implements OnInit {

  types:Array<{raw: ExceptionType, check:boolean}> = [];
  analysisId:number;

  constructor(
    private exceptionService : AnalysisExceptionService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ){}

  ngOnInit(): void {
    this.analysisId = this.route.parent.snapshot.params['analysisId'];
    this.types = this.exceptionService.types().map((t)=> {return {raw: t, check:false} });
  }

  onSubmit(){
      //TODO disabled when there is no selection
    let selected = this.types.filter(t=>t.check).map(t=>t.raw.code)[0];
    this.router.navigate([`/analysis/${this.analysisId}/exceptions/new/${selected}`])
  }

  onCancel(){
    this.router.navigate([`/analysis/${this.analysisId}/stages/exception`])
  }
}
