import { NgClass } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { GameMap } from 'src/app/features/private/interfaces/maps/maps.interface';

@Component({
  selector: 'app-map-selector-button',
  imports: [NgClass],
  templateUrl: './map-selector-button.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapSelectorButton {
  @Input() mapa: GameMap = {
    id: 0,
    name: "",
    photo: "",
    description: ""
  }

  @Input() isSelected: boolean = false;

  // Ruta para mostrar imagenes que vienen del backend
  storageUrl = environment.storageUrl;
}
