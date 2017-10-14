import {Component, Input, OnInit} from "@angular/core";
import {ApiError} from "../main/apiError";

@Component({
  selector: 'app-error-indicator',
  template:`
    <div class="alert alert-danger center-block -align-center" role="alert"> 
      <span class="glyphicon glyphicon-alert"></span>
      <strong i18n="@@commons.alert.error">Error!</strong>
      {{message}}
    </div>
  `
})


export class ErrorIndicatorComponent implements OnInit {

  @Input() error : ApiError;
  message : string = '';

  ngOnInit(): void {
    if(this.error.code != null)
      this.message = this.error.message;
    else
      this.message = 'Unexpected error occurred.';
  }
}
