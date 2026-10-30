import { Component, inject, signal } from '@angular/core';
import { Header } from '../../components/shared/header/header';
import { PrimaryButton } from 'src/app/shared/components/primary-button/primary-button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from 'src/app/shared/components/input-component/input-component';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { CredentialsService } from '../../services/credentials-service';
import { ToastsService } from '../../services/toasts-service';

@Component({
  selector: 'app-settings',
  imports: [Header, PrimaryButton, ReactiveFormsModule, InputComponent],
  templateUrl: './settings.html',
  styles: ``,
})
export default class Settings {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  credentialsService = inject(CredentialsService);
  toastsService = inject(ToastsService);

  validationErrors = signal<Record<string, string[]>>({});

  // Reglas de validación para el formulario
  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
  });

  passwordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required]],
  });

  ngOnInit() {
    this.emailForm.patchValue({
      email: this.authService.user().email,
    });
  }

  updateEmail(){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const email = this.emailForm.value.email;
    this.credentialsService.updateEmail(email).subscribe({
      next: (response) => {
        this.emailForm.markAsPristine();
        this.toastsService.showSuccessMsg(response.message);
      },
      error: (err) => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors || {});
      }
    });
  }

  updatePassword(){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const password = this.passwordForm.value.password;
    const password_confirmation = this.passwordForm.value.password_confirmation;

    this.credentialsService.updatePassword(password, password_confirmation).subscribe({
      next: (response) => {
        this.authService.logout().subscribe();
        this.toastsService.showSuccessMsg(response.message);
      },
      error: (err) => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors || {});
      }
    });
  }

  // Obtener errores de vaidación desde el backend
  getEmailError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }

  // Obtener errores de vaidación desde el backend
  getPasswordError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }
}
