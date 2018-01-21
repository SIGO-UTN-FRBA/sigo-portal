import {Component, Input} from '@angular/core';
import {AppError} from "../main/ierror";

@Component({
  selector: 'app-error-indicator',
  template:`
    <div role="alert"
         *ngFor="let error of errors"
         class="alert alert-danger center-block -align-center"> 
      <span class="glyphicon glyphicon-alert"></span>
      <strong i18n="@@commons.alert.error">Error!</strong>
      {{displayError(error)}}
    </div>
  `
})


export class ErrorIndicatorComponent{

  @Input() errors : AppError[];

  displayError(error: any) : string {

    if (error.name == "TypeError"){
      console.error(error);
      return "An expected error occurred on client app. Check console for more details..."
    } else
      return error.displayString();
  }
}
