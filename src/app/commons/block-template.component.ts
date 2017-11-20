import { Component } from '@angular/core';


@Component({
  selector: 'block-temp',
  styles: [`
    :host {
      text-align: center;
      color: darkgray;
    }
  `],
  template: `
    <div class="block-ui-template">
      <!-- <i class="fa fa-github-alt fa-4x" aria-hidden="true"></i> -->
      <div><strong>{{message}}</strong></div>
    </div>
    
  `
})
export class BlockTemplateComponent {

  message:any;

  constructor() {}

}
