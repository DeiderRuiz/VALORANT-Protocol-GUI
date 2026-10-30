import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, Input, output, signal } from '@angular/core';
import { ToastsService } from 'src/app/features/private/services/toasts-service';

@Component({
  selector: 'app-error-toast',
  imports: [],
  templateUrl: './error-toast.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ErrorToast {
  toastsService = inject(ToastsService);

  message = this.toastsService.errorMessage;

  constructor() {
    effect(() => {
      if (this.message()) {  
        setTimeout(() => {
          this.close();
        }, 10000);
      }
    });
  }

  close() {
    this.toastsService.clearErrorMsg();
  }
}
