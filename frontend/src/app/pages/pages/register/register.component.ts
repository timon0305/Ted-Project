import { Component, OnInit, OnDestroy } from "@angular/core";
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from './_helpers/must-match.validator';
import {AuthService} from '../../../core/auth/service/auth.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit, OnDestroy {
  public focus;
  public focus2;
  public focus3;
  public focus4;
  public focus5;
  public focus6;
  public focus7;
  public focus8;

  constructor(
      private formBuilder: FormBuilder,
      private _router: Router,
      private userService: AuthService,
  ) {}

    register: FormGroup;
    loading = false;
    submitted = false;
    file: File;

  ngOnInit() {
    var $page = document.getElementsByClassName("full-page")[0];
    var image_src;
    var image_container = document.createElement("div");
    image_container.classList.add("full-page-background");
    $page.classList.add("register-page");
    image_container.style.backgroundImage = "url(assets/img/bg16.jpg)";
    $page.appendChild(image_container);

      this.register = this.formBuilder.group({
          fullName: ['', Validators.required],
          userName: ['', Validators.required],
          userEmail: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
          role: ['', Validators.required],
          // photo: ['', Validators.required],
          telephone: ['', Validators.required]
      }, {
          validator: MustMatch('password', 'confirmPassword')
      })
  }

    get f() {return this.register.controls}
    onSubmit() {
        this.submitted = true;
        if (this.register.invalid) {
            return;
        }
        // this.userService.profile(this.file).subscribe(res => {
        //     console.log(res)
        // })
        console.log(this.register.value)
        this.userService.register(this.register.value)
            .subscribe(res =>{
                if (res['success'] === true) {
                    console.log('adsfasdfa')
                    this._router.navigate(['pages/login'])
                }
            })
    }
  ngOnDestroy() {
    var $page = document.getElementsByClassName("full-page")[0];
    $page.classList.remove("register-page");
  }
}
