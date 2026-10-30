import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, output } from '@angular/core';

@Component({
  selector: 'app-radio-input',
  imports: [],
  templateUrl: './radio-input.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioInput {
  @Input() value: string | number | boolean | null = null;
  @Input() checked: boolean = false;
  @Input() label!: string;

  valueChange  = output<string | number | boolean>();

  // Emitir al padre el valor del radio seleccionado
  onSelect(){
    /* let valueToEmit = value;
    this.valueChange .emit(valueToEmit); */
    if (this.value !== null) {
      this.valueChange.emit(this.value);
    }
  }
}
