import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, signal, output, inject, effect } from '@angular/core';
import { ToastsService } from 'src/app/features/private/services/toasts-service';

@Component({
  selector: 'app-success-toast',
  imports: [],
  templateUrl: './success-toast.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SuccessToast {
  toastsService = inject(ToastsService);

  message = this.toastsService.successMessage;

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
    this.toastsService.clearSuccessMsg();
  }
}
