import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorToast } from 'src/app/shared/components/error-toast/error-toast';
import { SuccessToast } from 'src/app/shared/components/success-toast/success-toast';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, ErrorToast, SuccessToast],
  templateUrl: './auth.html',
  styles: ``,
})
export default class Auth {

}
