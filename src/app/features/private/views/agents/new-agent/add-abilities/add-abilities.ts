import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Header } from "src/app/features/private/components/shared/header/header";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { Ability } from 'src/app/features/private/interfaces/agents/abilities/agent-ability.interface';
import { AgentsService } from 'src/app/features/private/services/agents-service';
import { AbilityFormCard } from "../components/ability-form-card/ability-form-card";
import { AbililtiesService } from 'src/app/features/private/services/abililties-service';
import { ToastsService } from 'src/app/features/private/services/toasts-service';

@Component({
  selector: 'app-add-abilities',
  imports: [Header, ReactiveFormsModule, SecondaryButton, PrimaryButton, RouterLink, AbilityFormCard],
  templateUrl: './add-abilities.html',
  styles: ``,
})
export default class AddAbilities {
  fb = inject(FormBuilder);
  ruta = inject(Router);
  agentsService = inject(AgentsService);
  abilitiesService = inject(AbililtiesService);
  route = inject(ActivatedRoute);
  toastsService = inject(ToastsService);

  // Errores
  errorMessage = signal("");
  validationErrors = signal<Record<string, string[]>>({});

  slug = signal<string>("");

  // Formulario que contiene un FormArray de habilidades (siempre 4)
  abilitiesForm: FormGroup = this.fb.group({
    abilities: this.fb.array([
      this.createAbility(),
      this.createAbility(),
      this.createAbility(),
      this.createAbility(),
    ])
  });

  // Getter para acceder al FormArray de habilidades desde el formulario
  get abilities(): FormArray {
    return this.abilitiesForm.get('abilities') as FormArray;
  }

  // Crea la estructura de una habilidad con sus controles y validaciones
  createAbility(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      icon: [null, [Validators.required]],
    });
  }

  // Helper que obtiene una habilidad del FormArray como FormGroup (necesario por tipado de Angular)
  getAbility(index: number): FormGroup {
    return this.abilities.at(index) as FormGroup;
  }

  ngOnInit(): void {
    // Obtener el slug del agente por el parametro de la URL (necesario apra la petición http)
    this.route.paramMap.subscribe(params => {
      this.slug.set(params.get('agente')!);
    })
  }

  sumbmitNewAgent(){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.abilitiesForm.invalid) {
      this.abilitiesForm.markAllAsTouched();
      return;
    }
    
    // Mandar los datos del formulario en formato multipart/form-data (obligatorio cuando hayan archivos)
    const formData = new FormData();
    const abilities = this.abilitiesForm.value.abilities;

    abilities.forEach((ability: Ability, index: number) => {
      formData.append(`abilities[${index}][name]`, ability.name);
      formData.append(`abilities[${index}][description]`, ability.description);
      formData.append(`abilities[${index}][icon]`, ability.icon);
    });

    // Hacer petición http para agregar las habilidades del agente recién creado
    this.abilitiesService.addAbilities(formData, this.slug()).subscribe({
      next: (response) => {
        this.ruta.navigateByUrl('/agentes');
        this.toastsService.showSuccessMsg(response.message);
      },
      error: err => {
        // Capturar errores que vienen del backend
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors || {});
      },
    });
  }
}
