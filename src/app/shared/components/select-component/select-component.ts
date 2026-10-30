import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-component',
  imports: [ReactiveFormsModule],
  templateUrl: './select-component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectComponent {
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() form!: FormGroup;
  @Input() error: string | null = null;
}
