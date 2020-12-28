import {Component, OnInit} from '@angular/core';
import {LoggingService} from '../logging.service';
import Tabulator from 'tabulator-tables';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from './users.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css',
        '../app.component.css']
})
export class UsersComponent implements OnInit {

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loggingService: LoggingService,
                private usersServer: UsersService
    ) {
    }

    ngOnInit() {
        var tabledata = this.usersServer.getUsers();

        var editIcon = function (cell, formatterParams, onRendered) {
            return '<i class=\'fas fa-pencil-alt\'></i>';
        };

        var goToFcn = function (id) {
            this.router.navigate(['edit-users/' + id]);
        };

        var table = new Tabulator('#users-table', {
            data: tabledata,
            height: 'calc(100vh - 250px)',
            layout: 'fitColumns',
            addRowPos: 'top',
            pagination: 'local',
            paginationSize: 6,
            paginationSizeSelector: [3, 6, 8, 10],
            initialSort: [
                {column: 'name', dir: 'asc'},
            ],
            columns: [
                {title: 'Edit', formatter: editIcon, width: 60, align: 'center', headerSort: false},
                {title: 'Id', field: 'id', width: 60},
                {title: 'First name', field: 'firstName'},
                {title: 'Last name', field: 'lastName'},
                {title: 'Role', field: 'role'},
                {title: 'Username', field: 'userName'},
                {title: 'Password', field: 'password'},
                {title: 'Email', field: 'email'},
                {
                    title: 'Delete',
                    formatter: 'buttonCross',
                    align: 'center',
                    width: 100,
                    headerSort: false,
                    cellClick: function (e, cell) {
                        cell.getRow().delete();
                    }
                },
            ],
            rowDblClick: (e, row) => {
                this.router.navigate([`/edit-users/${row.getData().id}`]);
            },
            cellClick: (e, cell) => {
                if (cell.getColumn().getDefinition().title == "Edit") {
                    this.router.navigate([`/edit-users/${cell.getRow().getData().id}`]);
                }
            }
        });
    }

    onNewUser() {
        this.router.navigate(['edit-users/0']);
    }

    onSearch() {

    }

}
