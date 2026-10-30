import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea-component',
  imports: [ReactiveFormsModule],
  templateUrl: './textarea-component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TextareaComponent {
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() form!: FormGroup;
  @Input() error: string | null = null;

  ajustarAltura(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
