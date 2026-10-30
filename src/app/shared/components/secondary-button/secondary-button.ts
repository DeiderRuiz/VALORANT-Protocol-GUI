import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  imports: [NgClass],
  templateUrl: './secondary-button.html',
  styles: ``,
})
export class SecondaryButton {
  @Input() texto:string = "";
  @Input() tipo:string = "button";
  @Input() isDisabled: boolean = false;
  @Input() isActive: boolean = false;
}
