import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import * as Chartist from "chartist";
import {Validators} from '@angular/forms';
import {AuthService} from '../../core/auth/service/auth.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {

    test: any =  `<button (click)="onSelect($event)">Click me</button>`;
    entries: number = 10;
    selected: any[] = [];
    temp = [];
    activeRow: any;
    token: string;
    role: string;
    rows: any = [];

    constructor(
        private userService: AuthService,
        private def: ChangeDetectorRef,
        private ngZone:NgZone
    ) {
        this.temp = this.rows.map((prop,key)=>{
            return {
                ...prop,
                id: key
            };

        });
    }
    entriesChange($event){
        this.entries = $event.target.value;
    }
    filterTable($event) {
        let val = $event.target.value;
        this.temp = this.rows.filter(function(d) {

            for(var key in d){
                if(d[key].toLowerCase().indexOf(val) !== -1){
                    return true;
                }
            }
            return false;
        });
    }

    onActivate(event) {
        this.activeRow = event.row;
    }
    editFunction($event){
        $event.preventDefault();
        this.userService.editUser(this.activeRow)
            .subscribe(res => {
                if (res['success'] === true) {
                    if (this.activeRow.active === '1') {
                        this.activeRow.active = '0'
                    }
                    else {
                        this.activeRow.active = '1'
                    }
                }
            })
    }
    deleteFunction($event){
        $event.preventDefault();
        if (confirm('Are you going to delete this account?')) {
            this.userService.deleteUser(this.activeRow)
                .subscribe(res => {
                    if (res['success'] === true) {
                        window.history.go(0)
                    }
                })
        }

    }
    ngOnInit() {
        this.token = localStorage.getItem('token');
        this.role = localStorage.getItem('role');
        this.userService.getUser(this.role)
        .subscribe(res => {
            this.temp = res['data'];
            this.def.detectChanges();
        })
    }

}
