import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../forms/validation-forms/password-validator.component';
import {AuthService} from '../../../core/auth/service/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit, OnDestroy {
  private focus;
  private focus2;
  private focus3;
  private focus4;
  private focus5;
  private focus6;
  private focus7;
  private focus8;
  private focus9;

  private dropdownList1 = [];
  private selectedItems1 = [];
  private dropdownSettings1 = {};

  constructor(
      private formBuilder: FormBuilder,
      private _router: Router,
      private userService: AuthService,
      private toastr: ToastrService
  ) {}

  register: FormGroup;
  loading = false;
  submitted = false;
  err_msg = '';

  ngOnInit() {
    var $page = document.getElementsByClassName("full-page")[0];
    var image_src;
    var image_container = document.createElement("div");
    image_container.classList.add("full-page-background");
    $page.classList.add("register-page");
    image_container.style.backgroundImage = "url(assets/background/background.jpg)";
    $page.appendChild(image_container);

    this.register = this.formBuilder.group({
        userName: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userEmail: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    })
  }
  get f() {return this.register.controls}

    keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
  onSubmit() {
    this.submitted = true;
    if (this.register.invalid) {
      return;
    }
    this.userService.register(this.register.value)
        .subscribe(res => {
            if (res['success'] === false) {
                this.toastr.info(
                    '<span class="now-ui-icons ui-1_bell-53"></span> ' + res['msg'],
                    "",
                    {
                        timeOut: 8000,
                        closeButton: true,
                        enableHtml: true,
                        toastClass: "alert alert-warning alert-with-icon",
                        positionClass: "toast-top-right"
                    }
                );
            }
            else {
                this.toastr.info(
                    '<span class="now-ui-icons ui-1_bell-53"></span> ' + res['msg'],
                    "",
                    {
                        timeOut: 8000,
                        closeButton: true,
                        enableHtml: true,
                        toastClass: "alert alert-success alert-with-icon",
                        positionClass: "toast-top-right"
                    }
                );
                this._router.navigate(['pages/login'])
            }
        });
      this.loading = false
  }

  ngOnDestroy() {
    var $page = document.getElementsByClassName("full-page")[0];
    $page.classList.remove("register-page");
  }

  user_login() {
    this._router.navigate(['pages/login'])
  }
}
