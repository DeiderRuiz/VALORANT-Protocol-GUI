import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, signal } from '@angular/core';
import { PrimaryButton } from "../primary-button/primary-button";
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-input-image-component',
  imports: [PrimaryButton, ReactiveFormsModule],
  templateUrl: './input-image-component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InputImageComponent {
  @Input() label: string = "";
  @Input() controlName!: string;
  @Input() form!: FormGroup;
  @Input() error: string | null = null;
  @Input() currentImage: string | null = null;

  urlImage = signal<string | null>(null);

  // Ruta para mostrar las imagenes
  storageUrl = environment.storageUrl;

  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.urlImage.set(null);
      return;
    }

    // const file: File = input.files[0];
    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;
    // guardar el archivo en el form
    this.form.get(this.controlName)?.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.urlImage.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
