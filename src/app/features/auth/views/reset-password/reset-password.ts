import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ToastsService } from 'src/app/features/private/services/toasts-service';
import { InputComponent } from 'src/app/shared/components/input-component/input-component';
import { PrimaryButton } from 'src/app/shared/components/primary-button/primary-button';
import { ResetPasswordRequest } from '../../interfaces/auth.interfaces';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, InputComponent, PrimaryButton],
  templateUrl: './reset-password.html',
  styles: ``,
})
export default class ResetPassword {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  ruta = inject(Router);
  authService = inject(AuthService);
  toastsService = inject(ToastsService);

  validationErrors = signal<Record<string, string[]>>({});

  token = signal<string>("");

  loading = signal(false);

  // Reglas de validación
  resetPasswordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token.set(params.get('token')!);
    });
  }

  resetPassword(){
    if (this.loading()) return;

    this.loading.set(true);

    const data: ResetPasswordRequest = { 
      token: this.token(),
      password: this.resetPasswordForm.value.password, 
      password_confirmation: this.resetPasswordForm.value.password_confirmation,
    }

    this.authService.resetPassword(data).pipe(
      finalize(() => {this.loading.set(false); })
    ).subscribe({
      next: (response) => {
        this.toastsService.showSuccessMsg(response.message);
        this.ruta.navigateByUrl('/');
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
