import { Component, OnInit } from "@angular/core";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";
import { ROUTES } from "../../components/sidebar/sidebar.component";
import { Router } from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-auth-layout",
  templateUrl: "./auth-layout.component.html",
  styleUrls: ["./auth-layout.component.css"]
})
export class AuthLayoutComponent implements OnInit {
  private listTitles: any[];
  public location: Location;
  public isCollapsed = false;

  constructor(
      location: Location,
      private router: Router,
      private modalService: NgbModal
  ) {
    this.location = location;
  }
    closeResult: string;

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.router.events.subscribe((event) => {
       this.isCollapsed = false;
       const navbar = document.getElementsByTagName('nav')[0];

       if (this.isCollapsed) {
         navbar.classList.remove('navbar-transparent');
         navbar.classList.add('bg-white');
       }else{
         navbar.classList.add('navbar-transparent');
         navbar.classList.remove('bg-white');
       }
   });
  }
  getTitle() {
    let titlee: any = this.location.prepareExternalUrl(this.location.path());
    for (let i = 0; i < this.listTitles.length; i++) {
      if (
        this.listTitles[i].type === "link" &&
        this.listTitles[i].path === titlee
      ) {
        return this.listTitles[i].title;
      } else if (this.listTitles[i].type === "sub") {
        for (let j = 0; j < this.listTitles[i].children.length; j++) {
          let subtitle =
            this.listTitles[i].path + "/" + this.listTitles[i].children[j].path;
          if (subtitle === titlee) {
            return this.listTitles[i].children[j].title;
          }
        }
      }
    }
    return "Now UI Dashboard PRO Angular";
  }
  collapse(){
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    if (this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    }else{
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }

    open(content, type, modalDimension) {
        if (modalDimension === "sm" && type === "modal_mini") {
            this.modalService
                .open(content, { windowClass: "modal-mini modal-primary", size: "sm" })
                .result.then(
                result => {
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                }
            );
        } else if (modalDimension == undefined && type === "Login") {
            this.modalService
                .open(content, { windowClass: "modal-login modal-primary" })
                .result.then(
                result => {
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                }
            );
        } else {
            this.modalService.open(content).result.then(
                result => {
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                }
            );
        }
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return "by pressing ESC";
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return "by clicking on a backdrop";
        } else {
            return `with: ${reason}`;
        }
    }
}
