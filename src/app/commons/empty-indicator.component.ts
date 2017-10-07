import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-empty-indicator',
  template: `
    <h3 class="text-center"> No {{entity}} </h3>
  `
})

export class EmptyIndicatorComponent{
  @Input() entity : string;
  @Input() type : string;

}
