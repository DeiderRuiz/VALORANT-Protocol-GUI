import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { AuthService } from '../../services/auth-service';
import { InputComponent } from 'src/app/shared/components/input-component/input-component';
import { ToastsService } from 'src/app/features/private/services/toasts-service';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, PrimaryButton, InputComponent, RouterLink],
  templateUrl: './forgot-password.html',
  styles: ``,
})
export default class ForgotPassword {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastsService = inject(ToastsService);

  validationErrors = signal<Record<string, string[]>>({});

  loading = signal(false);
  
  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  forgotPassword(){
    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).pipe(
        finalize(() => {this.loading.set(false); })
      ).subscribe({
      next: (response) => {
        this.toastsService.showSuccessMsg(response.message);
      },
      error: (err) => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors ?? {});
      }
    })
  }

  // Obtener errores de validación desde el backend
  getValidationError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }
}
