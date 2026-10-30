import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-check',
  imports: [],
  templateUrl: './input-check.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InputCheck {
  @Input() checked: boolean = false;
  @Input() label: string = "";
}
