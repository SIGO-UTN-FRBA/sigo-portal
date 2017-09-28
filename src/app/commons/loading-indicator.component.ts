import {Component, InjectionToken} from "@angular/core";

@Component({
  selector: 'loading-indicator',
  template: `
    <br>
    <img class="center-block" src="../../assets/images/loading.gif">
    <br>
  `
})

export class LoadingIndicatorComponent{

  status = {
    LOADING : 0,
    ACTIVE: 1,
    EMPTY: 2
  }
  
}
