import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { MapsService } from '../../../services/maps-service';
import { Header } from "../../../components/shared/header/header";
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { RouterLink } from "@angular/router";
import { environment } from '@environments/environment';
import { Modal } from "src/app/shared/components/modal/modal";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { InputComponent } from "src/app/shared/components/input-component/input-component";
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";
import { InputImageComponent } from "src/app/shared/components/input-image-component/input-image-component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameMap } from '../../../interfaces/maps/maps.interface';
import { PrimaryIconButton } from "src/app/shared/components/primary-icon-button/primary-icon-button";
import { Loader } from "../../../components/shared/loader/loader";
import { ToastsService } from '../../../services/toasts-service';

@Component({
  selector: 'app-maps',
  imports: [Header, PrimaryButton, ReactiveFormsModule, RouterLink, Modal, SecondaryButton, InputComponent, TextareaComponent, InputImageComponent, PrimaryIconButton, Loader],
  templateUrl: './maps.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class Maps {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  mapaService = inject(MapsService);
  toastsService = inject(ToastsService);

  errorMessage = signal("");
  validationErrors = signal<Record<string, string[]>>({});

  updateMapForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    photo: [null],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
  });
  
  // Ruta para mostrar las imagenes
  storageUrl = environment.storageUrl;

  // Abrir modal
  modalOpened = signal<string | null>(null);
  selectedMap = signal<GameMap | null>(null);
  currentImage = signal<string | null>(null);
  
  isLoading = this.mapaService.loadingMaps;
  mapas = this.mapaService.mapas;

  // Validar si el rol en el sistema del usuario es el de admin
  isAdmin = computed(() => {
    const role = this.authService.userRole();
    return role === 'admin';
  });

  // Obtener los mapas
  ngOnInit() {
    if (this.mapas === null) {
      this.mapaService.getMaps().subscribe();
    } else {
      this.reloadMaps();
    }
  }

  // Traer mapas actualizados sin hacer refresh
  reloadMaps(){
    this.mapaService.getMaps(true).subscribe();
  }

  openEditModal(map: GameMap) {
    this.selectedMap.set(map);

    this.currentImage.set(map.photo);
    
    this.updateMapForm.patchValue({
      name: map.name,
      description: map.description,
    });

    this.modalOpened.set(map.name);
  }

  updateMap(mapa: GameMap){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.updateMapForm.invalid) {
      this.updateMapForm.markAllAsTouched();
      return;
    }
    
    // Mandar los datos del formulario en formato multipart/form-data (obligatorio si mandas archivos)
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('name', this.updateMapForm.value.name);
    formData.append('description', this.updateMapForm.value.description);
    if (this.updateMapForm.value.photo) {
      formData.append('photo', this.updateMapForm.value.photo);
    }

    this.mapaService.updateMap(formData, mapa).subscribe({
      next: (response) => {
        this.reloadMaps();
        this.modalOpened.set(null);
        this.toastsService.showSuccessMsg(response.message);
      },
      error: err => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors || {});
      }
    });
  }

  // Obtener errores de validación desde el backend
  getvalidationError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }
}
