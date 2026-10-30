import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  imports: [NgClass],
  templateUrl: './primary-button.html',
  styles: ``,
})
export class PrimaryButton {
  @Input() texto:string = "";
  @Input() tipo:string = "button";
  @Input() isDisabled: boolean = false;
  @Input() isActive: boolean = false;
}
