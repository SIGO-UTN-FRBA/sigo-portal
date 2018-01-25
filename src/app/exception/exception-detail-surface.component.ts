import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: `
    <h1 i18n="@@exception.surface.detail.title">
      Surface exception detail
    </h1>
    <p i18n="@@exception.surface.detail.main_description">
      This section allows users to inspect a surface exception.
    </p>
    <hr/>
    <div class="container-fluid">
      <app-exception-surface-general-view *ngIf="!edit_general" 
                                       [(edit)]="edit_general" 
                                       [analysisId]="analysisId" 
                                       [exceptionId]="exceptionId"
      >
      </app-exception-surface-general-view>
      
      <app-exception-surface-general-edit *ngIf="edit_general" 
                                       [(edit)]="edit_general" 
                                       [analysisId]="analysisId" 
                                       [exceptionId]="exceptionId"
      >
      </app-exception-surface-general-edit>
    </div>
  `
})

export class ExceptionDetailSurfaceComponent {

  edit_general: boolean;
  exceptionId: number;
  analysisId: number;

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
