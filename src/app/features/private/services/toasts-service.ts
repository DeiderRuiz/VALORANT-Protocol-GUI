import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  successMessage = signal("");
  errorMessage = signal("");

  showSuccessMsg(message: string){
    this.successMessage.set(message);
  }
  showErrorMsg(message: string){
    this.errorMessage.set(message);
  }

  clearSuccessMsg(){
    this.successMessage.set("");
  }
  clearErrorMsg(){
    this.errorMessage.set("");
  }
}
