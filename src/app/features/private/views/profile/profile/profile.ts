import { Component, inject, signal } from '@angular/core';
import { Agent } from '../../../interfaces/agents/agents.interface';
import { ProfileService } from '../../../services/profile-service';
import { environment } from '@environments/environment';
import { AgentsService } from '../../../services/agents-service';
import { Header } from '../../../components/shared/header/header';
import { AgentDetails } from "../../../components/agents/agent-details/agent-details";
import { Loader } from "../../../components/shared/loader/loader";

@Component({
  selector: 'app-profile',
  imports: [Header, AgentDetails, Loader],
  templateUrl: './profile.html',
  styles: ``,
})
export default class Profile {
  profileService = inject(ProfileService);
  // Ruta de imagenes que viene desde el backend  
  storageUrl = environment.storageUrl;

  perfil = this.profileService.profile;
  isLoading = this.profileService.isProfileLoading;

  ngOnInit() {
    this.profileService.getProfile().subscribe();
  }
}
