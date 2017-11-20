import {Component, Input} from "@angular/core";
import {AppError} from "../main/ierror";

@Component({
  selector: 'app-error-indicator',
  template:`
    <div role="alert"
         *ngFor="let error of errors"
         class="alert alert-danger center-block -align-center"> 
      <span class="glyphicon glyphicon-alert"></span>
      <strong i18n="@@commons.alert.error">Error!</strong>
      {{error.displayString()}}
    </div>
  `
})


export class ErrorIndicatorComponent {

  @Input() errors : AppError[];

}
