import { Component, Input } from '@angular/core';
import { InputComponent } from "src/app/shared/components/input-component/input-component";
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";
import { InputImageComponent } from "src/app/shared/components/input-image-component/input-image-component";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ability-form-card',
  imports: [InputComponent, TextareaComponent, InputImageComponent],
  templateUrl: './ability-form-card.html',
  styles: ``,
})
export class AbilityFormCard {
  @Input() titulo: string = "";
  @Input() form!: FormGroup;
  @Input() errors!: Record<string, string[]>
  @Input() index!: number;
  
  // Obtener errores de vaidación desde el backend
  getValidationError(field: string): string | null {
    const key = `abilities.${this.index}.${field}`;
    return this.errors?.[key]?.[0] ?? null;
  }
}
