import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoggingService} from '../logging.service';
import Tabulator from 'tabulator-tables';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from './users.service';
import {UserBook} from "./user-book.model";
import {AuthenticationService} from "../auth/authentication.service";
import {NotificationService} from "../notification.service";
import {environment} from "../../environments/environment";
import {ConfirmDialogComponent} from "../dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css',
        '../app.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

    private users: UserBook[] = [];
    private table;
    searchTerm: string = "";

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loggingService: LoggingService,
                private usersServer: UsersService,
                private notification: NotificationService,
                private authenticationService: AuthenticationService,
                private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.authenticationService.testIfHasToken("users");

        var editIcon = function (cell, formatterParams, onRendered) {
            return '<i class=\'fas fa-pencil-alt\'></i>';
        };

        var goToFcn = function (id) {
            this.router.navigate(['edit-users/' + id]);
        };

        this.table = new Tabulator('#users-table', {
            data: this.users,
            height: 'calc(100vh - 250px)',
            layout: 'fitColumns',
            addRowPos: 'top',
            ajaxFiltering: true,
            pagination: "remote",
            ajaxConfig: "POST",
            paginationDataSent: { // override the sent params for pagination
                "page": "pageNumber",
                "size": "pageSize"
            },
            paginationDataReceived: { // override the received pagination default properties
                "last_page": "totalPages",
                "current_page": "number",
                "data": "content"
            },
            paginationSizeSelector: [5, 10, 15, 20, 50, 100, 500, 1000],
            ajaxURL: `${environment.apiUrl}/api/v1/users/filter`,
            ajaxURLGenerator: (url, config, params) => {
                params.searchTerm = this.searchTerm;
                if (this.authenticationService.currentUserValue) {
                    config.headers = {
                        'Authorization': `Bearer ${this.authenticationService.currentUserValue.accessToken}`
                    };
                }
                return url + "?params=" + encodeURI(JSON.stringify(params));
            },
            ajaxError: (xhr, textStatus, errorThrown) => {
                if (xhr.status == 401) {
                    this.authenticationService.logout();
                    this.router.navigate(['/login'], {queryParams: {returnUrl: "books"}});
                    return;
                }
                this.notification.showErrorNotification(xhr)
            },
            paginationSize: 20,
            initialSort: [
                {column: 'name', dir: 'asc'},
            ],
            columns: [
                {title: 'Edit', formatter: editIcon, width: 60, hozAlign: 'center', headerSort: false},
                {title: 'Id', field: 'id', width: 60},
                {title: 'First name', field: 'firstName'},
                {title: 'Last name', field: 'lastName'},
                {title: 'Role', field: 'role'},
                {title: 'Username', field: 'username'},
                {title: 'Email', field: 'email'},
                {title: 'Delete', formatter: 'buttonCross', hozAlign: 'center', width: 100, headerSort: false},
            ],
            rowDblClick: (e, row) => {
                this.router.navigate([`/edit-users/${row.getData().id}`]);
            },
            cellClick: (e, cell) => {
                if (cell.getColumn().getDefinition().title == "Edit") {
                    this.router.navigate([`/edit-users/${cell.getData().id}`]);
                } else if (cell.getColumn().getDefinition().title == "Delete") {
                    var userName = cell.getData().firstName + " " + cell.getData().lastName;
                    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
                        data: {
                            title: 'Confirm remove user',
                            message: 'Are you sure you want to remove the user ' + userName
                        }
                    });
                    confirmDialog.afterClosed().subscribe(result => {
                        if (result === true) {
                            this.usersServer.deleteUser(cell.getData().id, function () {
                                cell.getRow().delete();
                            });
                        }
                    });
                }

            },
            ajaxResponse:function(url, params, response) {
                var el = document.getElementById("row-count");
                el.innerHTML = "Showing " + response.numberOfElements + " of " + response.totalElements;
                return response;
            }
        });
    }

    onNewUser() {
        this.router.navigate(['edit-users/0']);
    }

    onSearch() {
        this.table.setData();
    }

    ngOnDestroy() {
    }
}
