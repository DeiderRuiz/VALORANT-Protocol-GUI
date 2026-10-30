import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-datetime-component',
  imports: [ReactiveFormsModule],
  templateUrl: './input-datetime-component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InputDatetimeComponent {
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() form!: FormGroup;
  @Input() error: string | null = null;
}
