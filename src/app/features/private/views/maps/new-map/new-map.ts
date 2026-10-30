import { Component, inject, signal } from '@angular/core';
import { Header } from "../../../components/shared/header/header";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MapsService } from '../../../services/maps-service';
import { InputComponent } from "src/app/shared/components/input-component/input-component";
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";
import { InputImageComponent } from "src/app/shared/components/input-image-component/input-image-component";
import { ToastsService } from '../../../services/toasts-service';

@Component({
  selector: 'app-new-map',
  imports: [ReactiveFormsModule, Header, SecondaryButton, PrimaryButton, InputComponent, TextareaComponent, InputImageComponent, RouterLink],
  templateUrl: './new-map.html',
  styles: ``,
})
export default class NewMap {
  fb = inject(FormBuilder);
  ruta = inject(Router);
  mapaService = inject(MapsService);
  toastsService = inject(ToastsService);

  errorMessage = signal("");
  validationErrors = signal<Record<string, string[]>>({});

  // Reglas de validación para el formulario
  mapForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    photo: [null, [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  newMap(){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.mapForm.invalid) {
      this.mapForm.markAllAsTouched();
      return;
    }
    // Mandar los datos del formulario en formato multipart/form-data (obligatorio si mandas archivos)
    const formData = new FormData();
    formData.append('name', this.mapForm.value.name);
    formData.append('description', this.mapForm.value.description);
    formData.append('photo', this.mapForm.value.photo);

    this.mapaService.newMap(formData).subscribe({
      next: (response) => {
        this.ruta.navigateByUrl('/mapas');
        this.toastsService.showSuccessMsg(response.message);
      },
      error: err => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors || {});
      }
    });
  }

  // Obtener errores de vaidación de validación
  getvalidationError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }
}
