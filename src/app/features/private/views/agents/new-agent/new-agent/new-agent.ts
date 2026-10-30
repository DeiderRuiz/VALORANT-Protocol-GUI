import { Component, inject, signal } from '@angular/core';
import { Header } from "src/app/features/private/components/shared/header/header";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from "src/app/shared/components/input-component/input-component";
import { InputImageComponent } from "src/app/shared/components/input-image-component/input-image-component";
import { SelectComponent } from "src/app/shared/components/select-component/select-component";
import { CountriesService } from 'src/app/features/private/services/countries-service';
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";
import { AgentsService } from 'src/app/features/private/services/agents-service';
import { AgentDraftCard } from "../components/agent-draft-card/agent-draft-card";
import { Agent } from 'src/app/features/private/interfaces/agents/agents.interface';
import { AgentDraft } from 'src/app/features/private/interfaces/agents/agent-draft.interface';
import { Loader } from "src/app/features/private/components/shared/loader/loader";

@Component({
  selector: 'app-new-agent',
  imports: [ReactiveFormsModule, Header, SecondaryButton, PrimaryButton, InputComponent, InputImageComponent, SelectComponent, TextareaComponent, AgentDraftCard, Loader],
  templateUrl: './new-agent.html',
  styles: ``,
})
export default class NewAgent {
  fb = inject(FormBuilder);
  ruta = inject(Router);
  agentsService= inject(AgentsService);
  countriesService= inject(CountriesService);
  private route = inject(ActivatedRoute);

  currentProfilePhoto = signal<string | null>(null);
  currentAgentImage = signal<string | null>(null);

  isCreating = signal<boolean>(true);
  agentDraftSelected = signal<AgentDraft | null>(null);

  // Errores
  errorMessage = signal("");
  validationErrors = signal<Record<string, string[]>>({});
  // Paises
  countries = this.countriesService.countries;
  isLoadingCountries = this.countriesService.isLoadingCountries;
  //Roles de agentes
  agentClasses = this.agentsService.classes;
  isLoadingClasses = this.agentsService.isLoadingClasses;
  //Agentes borrador
  agentDraft = this.agentsService.agentsDraft;
  isLoadingAgentDraft = this.agentsService.isLoadingAgentsDraft;

  // Formulario para crear un agente con sus campos y validaciones requeridas
  agentForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    bio: ['', [Validators.required, Validators.maxLength(1000)]],
    profile_photo: [null],
    agent_photo: [null],
    country_code: [null, Validators.required],
    class: [null, [Validators.required]],
  });

  ngOnInit() {
    // Obtener los roles de agente para el select
    this.agentsService.getAgentClasses().subscribe();
    // Obtener los paises para el select de nacionalidad
    this.countriesService.getCountries().subscribe();

    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length === 0) {
        this.agentsService.getAgentsDraft().subscribe();
        return;
      }

      const data: string = params['agent'];

      this.agentsService.agentDraftExists(data).subscribe(
        (agentDraft) => {
          this.onEditAgentDraft(agentDraft);
        }
      );
    });
  }

  // Obtener errores de vaidación desde el backend
  getValidationError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }

  onEditAgentDraft(agent: AgentDraft){
    this.agentForm.patchValue({
      email: agent.user.email,
      name: agent.name,
      bio: agent.bio,
      country_code: agent.nationality?.country_code,
      class: agent.class.id,
    });

    this.currentProfilePhoto.set(agent.profile_photo);
    this.currentAgentImage.set(agent.agent_photo);

    this.isCreating.set(false);
    this.agentDraftSelected.set(agent);
  }

  submitAgent(agentDraft: AgentDraft){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.agentForm.invalid) {
      this.agentForm.markAllAsTouched();
      return;
    }

    // Mandar los datos del formulario en formato multipart/form-data (obligatorio cuando hayan archivos)
    const formData = new FormData();
    formData.append('email', this.agentForm.value.email);
    formData.append('password', this.agentForm.value.password);
    formData.append('password_confirmation', this.agentForm.value.password_confirmation);
    formData.append('name', this.agentForm.value.name);
    formData.append('bio', this.agentForm.value.bio);
    if (this.agentForm.value.profile_photo) {
      formData.append('profile_photo', this.agentForm.value.profile_photo);
    }
    if (this.agentForm.value.agent_photo) {
      formData.append('agent_photo', this.agentForm.value.agent_photo);
    }
    formData.append('country_code', this.agentForm.value.country_code);
    formData.append('class', this.agentForm.value.class);

    if (this.isCreating()) {
      // Petición http para agregar el nuevo agente
      this.agentsService.createDraftAgent(formData).subscribe({
        next: (response) => {
          // Redirección para agregar las habilidades del nuevo agente
          this.ruta.navigate(['/agentes/nuevo-agente/agregar-habilidades', response.agent.slug]);
        },
        error: err => {
          // Capturar errores que viene del backend
          this.errorMessage.set(err.error?.message || 'Error al crear el agente');
          this.validationErrors.set(err.error?.errors || {});
        }
      });
    }else {
      formData.append('_method', 'PATCH');
      // Petición http para agregar el nuevo agente
      this.agentsService.updateDraftAgent(formData, agentDraft).subscribe({
        next: (response) => {
          // Redirección para agregar las habilidades del nuevo agente
          this.ruta.navigate(['/agentes/nuevo-agente/agregar-habilidades', response.agent.slug]);
        },
        error: err => {
          // Capturar errores que viene del backend
          this.errorMessage.set(err.error?.message || 'Error al crear el agente');
          this.validationErrors.set(err.error?.errors || {});
        }
      });
    }
  }
}
