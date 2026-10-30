import { NgClass } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-secondary-icon-button',
  imports: [NgClass],
  templateUrl: './secondary-icon-button.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SecondaryIconButton {
  @Input() icono:string = "";
  @Input() tipo:string = "button";
  @Input() isDisabled: boolean = false;
}
