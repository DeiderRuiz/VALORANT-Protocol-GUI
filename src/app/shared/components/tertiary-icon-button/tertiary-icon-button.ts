import { NgClass } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-tertiary-icon-button',
  imports: [NgClass],
  templateUrl: './tertiary-icon-button.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TertiaryIconButton {
  @Input() icono:string = "";
  @Input() tipo:string = "button";
  @Input() isDisabled: boolean = false;
  @Input() isSelected: boolean = false;
}
