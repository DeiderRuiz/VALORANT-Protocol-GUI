import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { InputComponent } from "src/app/shared/components/input-component/input-component";
import { ToastsService } from 'src/app/features/private/services/toasts-service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, PrimaryButton, InputComponent],
  templateUrl: './login.html',
  styles: ``,
})
export default class Login {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  ruta = inject(Router);
  toastsService = inject(ToastsService);

  validationErrors = signal<Record<string, string[]>>({});

  // Reglas de validación
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login(){
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.toastsService.clearErrorMsg();
        this.toastsService.clearSuccessMsg();
        this.ruta.navigateByUrl('/dashboard');
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
