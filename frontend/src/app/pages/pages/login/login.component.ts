import { Component, OnInit, OnDestroy } from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth/service/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
    animations: [
        // the fade-in/fade-out animation.
        trigger('simpleFadeAnimation', [

            // the "in" style determines the "resting" state of the element when it is visible.
            state('in', style({opacity: 1})),

            // fade in when created. this could also be written as transition('void => *')
            transition(':enter', [
                style({opacity: 0}),
                animate(600 )
            ]),

            // fade out when destroyed. this could also be written as transition('void => *')
            transition(':leave',
                animate(600, style({opacity: 0})))
        ])
    ]
})
export class LoginComponent implements OnInit, OnDestroy {
  private focus;
  private focus2;
    returnUrl: string;
  constructor(
      private _router: Router,
      private route: ActivatedRoute,
      private userService: AuthService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
  ) {}

  login: FormGroup;
  loading = false;
  submitted = false;
  role: string;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app/dashboard';
    var $page = document.getElementsByClassName("full-page")[0];
    var image_src;
    var image_container = document.createElement("div");
    image_container.classList.add("full-page-background");
    image_container.style.backgroundImage = "url(assets/background/background.jpg)";
    $page.appendChild(image_container);
    $page.classList.add("login-page");

      this.login = this.formBuilder.group({
          userEmail: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
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
            if (res['success'] === true)
            {
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
                this.role =  localStorage.getItem('role');
                if (this.role === 'admin') {
                    this._router.navigate([this.returnUrl]);
                }
            }
            else {
              if (res['data'] === null) {
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
              } else {
                  if (res['data'].active === '1') {
                      this.toastr.info(
                          '<span class="now-ui-icons ui-1_bell-53"></span> ' + res['msg'],
                          "",
                          {
                              timeOut: 8000,
                              closeButton: true,
                              enableHtml: true,
                              toastClass: "alert alert-danger alert-with-icon",
                              positionClass: "toast-top-right"
                          }
                      );
                  } else {
                      this.toastr.info(
                          '<span class="now-ui-icons ui-1_bell-53"></span> ' + res['msg'],
                          "",
                          {
                              timeOut: 8000,
                              closeButton: true,
                              enableHtml: true,
                              toastClass: "alert alert-info alert-with-icon",
                              positionClass: "toast-top-right"
                          }
                      );
                  }
              }
          }
      })
  }

  ngOnDestroy() {
    var $page = document.getElementsByClassName("full-page")[0];
    $page.classList.remove("login-page");
  }

  user_register() {
    this._router.navigate(['pages/register'])
  }

}
