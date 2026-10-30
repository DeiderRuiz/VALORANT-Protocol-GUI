import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { Header } from "../../../components/shared/header/header";
import { ActivatedRoute, Router } from '@angular/router';
import { AgentsService } from '../../../services/agents-service';
import { Agent } from '../../../interfaces/agents/agents.interface';
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountriesService } from '../../../services/countries-service';
import { InputComponent } from "src/app/shared/components/input-component/input-component";
import { SelectComponent } from "src/app/shared/components/select-component/select-component";
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";
import { UpdateImageCard } from "../components/update-image-card/update-image-card";
import { Modal } from "src/app/shared/components/modal/modal";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { InputImageComponent } from "src/app/shared/components/input-image-component/input-image-component";
import { Ability } from '../../../interfaces/agents/abilities/agent-ability.interface';
import { AbililtiesService } from '../../../services/abililties-service';
import { forkJoin } from 'rxjs';
import { AgentProfileRequest } from '../../../interfaces/agents/agent-request.interface';
import { Loader } from "../../../components/shared/loader/loader";
import { ToastsService } from '../../../services/toasts-service';

@Component({
  selector: 'app-edit-agent',
  imports: [Header, ReactiveFormsModule, InputComponent, SelectComponent, TextareaComponent, UpdateImageCard, Modal, SecondaryButton, PrimaryButton, InputImageComponent, Loader],
  templateUrl: './edit-agent.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class EditAgent {
  agentsService = inject(AgentsService);
  abilitiesService = inject(AbililtiesService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  countriesService= inject(CountriesService);
  toastsService = inject(ToastsService);

  openModal = signal<string | null>(null);
  
  // Errores
  errorMessage = signal("");
  agentValidationErrors = signal<Record<string, string[]>>({});
  abilityValidationErrors = signal<Record<string, string[]>>({});
  
  // Paises
  countries = this.countriesService.countries;
  isLoadingCountries = this.countriesService.isLoadingCountries;
  //Roles de agentes
  agentClasses = this.agentsService.classes;
  isLoadingClasses = this.agentsService.isLoadingClasses;

  agent = this.agentsService.agent;
  isLoading = this.agentsService.isAgentLoading;
  slug = signal<string>("");
  currentImage = signal<string | null>(null);

  storageUrl = environment.storageUrl;

  // Actualizar Perfil de agente
  updateAgentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    bio: ['', [Validators.required, Validators.maxLength(1000)]],
    country_code: [null, Validators.required],
    class: [null, [Validators.required]],
  });

  // Actualizar Foto de Perfil
  updateProfilePhotoForm: FormGroup = this.fb.group({
    profile_photo: [null, Validators.required]
  });

  // Actualizar Foto del agente
  updateAgentPhotoForm: FormGroup = this.fb.group({
    agent_photo: [null, Validators.required]
  });

  // Actualizar Habilidades
  updateAbilityForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    icon: [null, ],
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug.set(params.get('agente')!);
      forkJoin({
        countries: this.countriesService.getCountries(),
        agentClasses: this.agentsService.getAgentClasses(),
        agent: this.agentsService.getAgent(this.slug())
      }).subscribe({
        next: ({ countries, agentClasses, agent }) => {
          this.setFormValues();
        }
      });
    });
  }

  // Estabecer valores para el FormGroup updateAgentForm
  setFormValues(){
    this.updateAgentForm.patchValue({
      name: this.agent()?.name,
      bio: this.agent()?.bio,
      country_code: this.agent()?.nationality?.country_code,
      country_name: this.agent()?.nationality?.country_name,
      class: this.agent()?.class?.id
    });
  }

  // Abrir modal para actualizar foto de Perfil o imagen de agente
  openEditPhotoModal(photo: string, path: string) {
    this.currentImage.set(photo);
    this.openModal.set(path);
  }

  // Abrir el modal para actualizar las habilidades
  openEditAbilityModal(ability: Ability){
    this.abilityValidationErrors.set({});
    this.currentImage.set(ability.icon);
    
    //Actualizar el formulario con los datos de la habiliadad que se visualiza
    this.updateAbilityForm.patchValue({
      name: ability.name,
      description: ability.description,
    });

    this.openModal.set(ability.name);
  }

  updateProfilePhoto(agent: Agent){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.updateProfilePhotoForm.invalid) {
      this.updateProfilePhotoForm.markAllAsTouched();
      return;
    }
    
    // Mandar los datos del formulario en formato multipart/form-data (obligatorio si mandas archivos)
    const formData = new FormData();
    /* PHP no procesa correctamente multipart/form-data en peticiones PATCH,
    por lo que se utiliza POST con method spoofing para que Laravel interprete
    la petición como PATCH y pueda recibir correctamente los archivos */
    formData.append('_method', 'PATCH');
    formData.append('profile_photo', this.updateProfilePhotoForm.value.profile_photo);

    this.agentsService.updateProfilePhoto(agent, formData).subscribe({
      next: (response) => {
        this.openModal.set(null);
        this.toastsService.showSuccessMsg(response.message);
      },
      error: (err) => {
        this.toastsService.showErrorMsg(err.error?.message); // Toast de errores
        this.agentValidationErrors.set(err.error?.errors || {}); // Errores de validación
      }
    });
  }
  
  updateAgentPhoto(agent: Agent){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.updateAgentPhotoForm.invalid) {
      this.updateAgentPhotoForm.markAllAsTouched();
      return;
    }
    
    // Mandar los datos del formulario en formato multipart/form-data (obligatorio si mandas archivos)
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('agent_photo', this.updateAgentPhotoForm.value.agent_photo);

    this.agentsService.updateAgentPhoto(agent, formData).subscribe({
      next: (response) => {
        this.openModal.set(null);
        this.toastsService.showSuccessMsg(response.message);
      },
      error: (err) => {
        this.toastsService.showErrorMsg(err.error?.message); // Toast de errores
        this.agentValidationErrors.set(err.error?.errors || {}); // Errores de validación
      }
    });
  }

  updateAbility(ability: Ability){ 
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.updateAbilityForm.invalid) {
      this.updateAbilityForm.markAllAsTouched();
      return;
    }
    
    // Mandar los datos del formulario en formato multipart/form-data (obligatorio si mandas archivos)
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('name', this.updateAbilityForm.value.name);
    formData.append('description', this.updateAbilityForm.value.description);
    if (this.updateAbilityForm.value.icon) {
      formData.append('icon', this.updateAbilityForm.value.icon);
    }

    this.abilitiesService.updateAbility(ability, formData).subscribe({
      next: (response) => {
        this.agent.set(response.agent as Agent);
        this.openModal.set(null);
        this.toastsService.showSuccessMsg(response.message);
      },
      error: (err) => {
        // Capturar errores que viene del backend
        this.toastsService.showErrorMsg(err.error?.message);
        this.abilityValidationErrors.set(err.error?.errors || {});
      },
    });
  }

  updateAgentProfile(agent: Agent){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.updateAgentForm.invalid) {
      this.updateAgentForm.markAllAsTouched();
      return;
    }

    const data: AgentProfileRequest = {
      name: this.updateAgentForm.value.name,
      bio: this.updateAgentForm.value.bio,
      country_name: this.updateAgentForm.value.country_name,
      country_code: this.updateAgentForm.value.country_code,
      class: this.updateAgentForm.value.class,
    }

    this.agentsService.updateAgentProfile(agent, data).subscribe({
      next: (response) => {
        if (response.agent.slug !== agent.slug) {
          this.router.navigate(['/agentes', response.agent.slug, 'editar-perfil']);
        }
        this.updateAgentForm.markAsPristine();
        this.toastsService.showSuccessMsg(response.message);
      },
      error: (err) => {
        // Capturar errores que viene del backend
        this.toastsService.showErrorMsg(err.error?.message);
        this.agentValidationErrors.set(err.error?.errors || {});
      },
    });
  }

  // Obtener errores de vaidación relacionados al agente
  getAgentError(field: string): string | null {
    return this.agentValidationErrors()[field]?.[0] ?? null;
  }

  // Obtener errores de vaidación relacionados a las habilidades del agente
  getAbilityError(field: string): string | null {
    return this.abilityValidationErrors()[field]?.[0] ?? null;
  }
}
