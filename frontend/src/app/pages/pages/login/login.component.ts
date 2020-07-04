import { Component, OnInit, OnDestroy } from "@angular/core";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../core/auth/service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  public focus;
  public focus2;
  public focus3;
  returnUrl: string;
  constructor(
      private _router: Router,
      private userService: AuthService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
  ) {}

    login: FormGroup;
    loading = false;
    submitted = false;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app/dashboard';
    var $page = document.getElementsByClassName("full-page")[0];
    var image_src;
    var image_container = document.createElement("div");
    image_container.classList.add("full-page-background");
    image_container.style.backgroundImage = "url(assets/img/bg3.jpg)";
    $page.appendChild(image_container);
    $page.classList.add("login-page");

      this.login = this.formBuilder.group({
          userEmail: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          role: ['', Validators.required]
      });
  }

    get f() {return this.login.controls}
    onSubmit() {
        this.submitted = true;
        if (this.login.invalid) {
            return;
        }
        this.loading = true;
        this.userService.login(this.login.value)
            .pipe(first())
            .subscribe(res => {
              if (res['success'] === false) {
                alert(res['msg'])
              }
              else {
                if (res['data'].role === 'admin') {
                    this._router.navigate([this.returnUrl])
                }
              }
            })
    }

  ngOnDestroy() {
    var $page = document.getElementsByClassName("full-page")[0];
    $page.classList.remove("login-page");
  }
}
