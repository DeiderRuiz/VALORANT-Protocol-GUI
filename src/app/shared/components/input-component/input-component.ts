import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-component',
  imports: [ReactiveFormsModule],
  templateUrl: './input-component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InputComponent {
  @Input() controlName!: string;
  @Input() tipo: string = "text"
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() form!: FormGroup;
  @Input() error: string | null = null;
}
