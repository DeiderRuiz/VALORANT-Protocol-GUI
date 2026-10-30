import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, HostListener, Input, effect, inject, output, signal, viewChild } from '@angular/core';
import { PrimaryButton } from 'src/app/shared/components/primary-button/primary-button';
import { InputComponent } from 'src/app/shared/components/input-component/input-component';
import { InputCheck } from 'src/app/shared/components/input-check/input-check';
import { SecondaryButton } from 'src/app/shared/components/secondary-button/secondary-button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MissionType } from '../../../interfaces/missions/mission-type.interface';
import { StatusLabelPipe } from '../../../pipes/status-label-pipe';
import { MissionSearch } from '../../../interfaces/missions/mission-search.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mission-search-bar',
  imports: [ReactiveFormsModule, PrimaryButton, InputComponent, InputCheck, SecondaryButton, StatusLabelPipe, RouterLink],
  templateUrl: './mission-search-bar.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MissionSearchBar {
  fb = inject(FormBuilder);

  searchMission = output<MissionSearch>();

  @Input() missionTypes: MissionType[] = [];
  @Input() searchParams: MissionSearch | null = null;

  private filtersContainer = viewChild<ElementRef>('filtersContainer'); 

  isFiltersOpen = signal<boolean>(false);

  missionTypesSelected= signal<number[]>([]);
  prioritiesSelected= signal<string[]>([]);
  statementsSelected= signal<string[]>([]);
  resultsSelected= signal<string[]>([]);
  
  // Opciones para los checkbox
  priorities = signal<string[]>(["baja", "media", "alta", "critica"]);
  statements = signal<string[]>(["created", "waiting_start", "in_progress", "aborted", "waiting_validation", "completed"]);
  results = signal<string[]>(["success", "failed"]);

  // Reglas de validación para el buscados
  searchMissionForm: FormGroup = this.fb.group({
    term: [''],
    priority: this.fb.control<string[]>([]),
    statement: this.fb.control<string[]>([]),
    result: this.fb.control<string[]>([]),
    type_id: this.fb.control<number[]>([]),
  });

  /* Escuchar eventos click para cerrar dorpdown de los filtros 
  cuando se hace click fuera de el */
  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      const container = this.filtersContainer()?.nativeElement;
      if (!container) return;
      if (!container.contains(event.target)) {
          this.isFiltersOpen.set(false);
      }
  }

  /* constructor() {
    effect(() => {
      const data = this.searchParams;
  
      if (!data) return;
  
      this.searchMissionForm.patchValue({
        term: data.term ?? '',
        priority: data.priority ?? [],
        statement: data.statement ?? [],
        result: data.result ?? [],
        type_id: data.type_id ?? []
      });
  
      this.prioritiesSelected.set(data.priority ?? []);
      this.resultsSelected.set(data.result ?? []);
      this.statementsSelected.set(data.statement ?? []);
      this.missionTypesSelected.set(data.type_id ?? []);
    });
  } */

  ngOnInit(): void {
    const data = this.searchParams;
    if (!data) return;

    // Darle al FormGroup los valores de los datos obtenidos
    this.searchMissionForm.patchValue({
      term: data.term,
      priority: data.priority,
      statement: data.statement,
      result: data.result,
      type_id: data.type_id
    });
    
    this.prioritiesSelected.set(data.priority ?? []);
    this.resultsSelected.set(data.result ?? []);
    this.statementsSelected.set(data.statement ?? []);
    this.missionTypesSelected.set(data.type_id ?? []);
  }

  clearFilters() {
    this.searchMissionForm.patchValue({
      priority: [],
      statement: [],
      result: [],
      type_id: []
    });

    this.prioritiesSelected.set([]);
    this.statementsSelected.set([]);
    this.resultsSelected.set([]);
    this.missionTypesSelected.set([]);
  }

  // Marcar o desmarcar item del checkbox de tipos de misión
  checkMissionTypes(missionType: number) {
    const current = this.missionTypesSelected();
    const isExists = current.some(type => type === missionType);
    if (isExists) {
      this.missionTypesSelected.set(
        this.missionTypesSelected().filter(type => type !== missionType)
      );
    }else{
      this.missionTypesSelected.set([...this.missionTypesSelected(), missionType]);
    }
    this.searchMissionForm.patchValue({
      type_id: this.missionTypesSelected()
    });
  }

  // Marcar o desmarcar item del checkbox de prioridades
  checkPriorities(priority: string){
    const current = this.prioritiesSelected();
    const isExists = current.some(_priority => _priority === priority);
    if (isExists) {
      this.prioritiesSelected.set(
        this.prioritiesSelected().filter(_priority => _priority !== priority)
      );
    }else{
      this.prioritiesSelected.set([...this.prioritiesSelected(), priority]);
    }
    this.searchMissionForm.patchValue({
      priority: this.prioritiesSelected()
    });
  }

  // Marcar o desmarcar item del checkbox de estados de misión
  checkStatements(statement: string){
    const current = this.statementsSelected();
    const isExists = current.some(_statement => _statement === statement);
    if (isExists) {
      this.statementsSelected.set(
        this.statementsSelected().filter(_statement => _statement !== statement)
      );
    }else{
      this.statementsSelected.set([...this.statementsSelected(), statement]);
    }
    this.searchMissionForm.patchValue({
      statement: this.statementsSelected()
    });
  }

  // Marcar o desmarcar item del checkbox de resultados de misión
  checkResults(result: string){
    const current = this.resultsSelected();
    const isExists = current.some(_result => _result === result);
    if (isExists) {
      this.resultsSelected.set(
        this.resultsSelected().filter(_result => _result !== result)
      );
    }else{
      this.resultsSelected.set([...this.resultsSelected(), result]);
    }
    this.searchMissionForm.patchValue({
      result: this.resultsSelected()
    });
  }

  // Determinar cual checkbox del filtro de busqueda está seleccionado
  isSelected(value: string | number):boolean {
    const priority = this.prioritiesSelected().some(_priority => _priority === value);
    const statement = this.statementsSelected().some(_statement => _statement === value);
    const result = this.resultsSelected().some(_result => _result === value);
    const type_id = this.missionTypesSelected().some(_type_id => _type_id === value);
    const isExists = priority || statement || result || type_id;
    return isExists;
  }

  //Buscar misiones
  onSearchMission(){
    const data: MissionSearch = {
      term: this.searchMissionForm.value.term,
      priority: this.searchMissionForm.value.priority,
      statement: this.searchMissionForm.value.statement,
      result: this.searchMissionForm.value.result,
      type_id: this.searchMissionForm.value.type_id,
    }

    this.searchMission.emit(data);
    
    this.isFiltersOpen.set(false);
  }
}
