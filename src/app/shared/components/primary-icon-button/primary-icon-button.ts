import { NgClass } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-primary-icon-button',
  imports: [NgClass],
  templateUrl: './primary-icon-button.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimaryIconButton {
  @Input() icono:string = "";
  @Input() tipo:string = "button";
  @Input() isDisabled: boolean = false;
}
