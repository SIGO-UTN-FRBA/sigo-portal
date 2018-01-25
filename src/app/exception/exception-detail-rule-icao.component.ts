import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  template:`
    <h1 i18n="@@exception.rule.detail.title">
      Rule exception detail
    </h1>
    <p i18n="@@exception.rule.detail.main_description">
      This section allows users to inspect a rule exception.
    </p>
    <hr/>
    <div class="container-fluid">
      <app-exception-rule-general-view *ngIf="!edit_general" [(edit)]="edit_general" [analysisId]="analysisId" [exceptionId]="exceptionId"></app-exception-rule-general-view>
      <app-exception-rule-general-edit *ngIf="edit_general" [(edit)]="edit_general" [analysisId]="analysisId" [exceptionId]="exceptionId"></app-exception-rule-general-edit>
    </div>
  `
})

export class ExceptionDetailRuleIcao14Component {
  edit_general : boolean;
  exceptionId:number;
  analysisId:number;

  constructor(
    private route: ActivatedRoute
  ){
    this.edit_general = false;
  }

  ngOnInit() : void {
    this.exceptionId = +this.route.snapshot.params['exceptionId'];
    this.analysisId = +this.route.parent.snapshot.params['analysisId'];
  }
}
