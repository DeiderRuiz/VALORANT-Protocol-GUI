import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  http = inject(HttpClient);

  updateEmail(email: string){
    return this.http.patch<{ message: string }>(`${environment.apiUrl}/credentials/email`, { email });
  }

  updatePassword(password: string, password_confirmation: string){
    return this.http.patch<{ message: string }>(`${environment.apiUrl}/credentials/password`, { 
      password, 
      password_confirmation
    });
  }
}
