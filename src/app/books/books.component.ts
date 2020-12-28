import {Component, OnInit} from '@angular/core';
import {LoggingService} from '../logging.service';
import Tabulator from 'tabulator-tables';
import {ActivatedRoute, Router} from '@angular/router';
import {BooksService} from './books.service';
import {Author} from '../authors/author.model';

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.css',
        '../app.component.css']
})
export class BooksComponent implements OnInit {

    constructor(private router: Router,
                private route: ActivatedRoute,
                private loggingService: LoggingService,
                private booksServer: BooksService
    ) {
    }

    ngOnInit() {
        var tabledata = this.booksServer.getBooks();

        var editIcon = function (cell, formatterParams, onRendered) {
            return '<i class=\'fas fa-pencil-alt\'></i>';
        };

        var goToFcn = function (id) {
            this.router.navigate(['edit-books/' + id]);
        };

        var statusFormatter = function (cell, formatterParams, onRendered) {
            if (cell.getValue() === 'GREEN') {
                return '<span class=\'status green\'></span>';
            } else if (cell.getValue() === 'RED') {
                return '<span class=\'status red\'></span>';
            } else if (cell.getValue() === 'YELLOW') {
                return '<span class=\'status yellow\'></span>';
            }
        };

        var table = new Tabulator('#books-table', {
            data: tabledata,
            height: 'calc(100vh - 250px)',
            layout: 'fitColumns',
            addRowPos: 'top',
            pagination: 'local',
            paginationSize: 6,
            paginationSizeSelector: [3, 6, 8, 10],
            initialSort: [
                {column: 'id', dir: 'desc'},
            ],
            columns: [
                {
                    formatter: "rowSelection",
                    width: 60,
                    titleFormatter: "rowSelection",
                    hozAlign: "center",
                    headerSort: false,
                    cellClick: function (e, cell) {
                        cell.getRow().toggleSelect();
                    }
                },
                {title: 'Edit', formatter: editIcon, width: 60, align: 'center', headerSort: false},
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
                {title: 'Id', field: 'id', width: 60},
                {title: 'Title', field: 'title'},
                {
                    title: 'Author', field: 'authors', formatter: function (cell, formatterParams) {
                        return cell.getValue()[0].firstName + ' ' + cell.getValue()[0].lastName;
                    }
                },
                {title: 'ISBN', field: 'isbn'},
                {
                    title: 'Status',
                    field: 'status',
                    formatter: statusFormatter,
                    width: 100,
                    align: 'center',
                    headerSort: false
                },
                {
                    title: 'Created at', field: 'createdAt', formatter: function (cell, formatterParams) {
                        return cell.getValue().toLocaleDateString() + ' ' + cell.getValue().toLocaleTimeString();
                    }
                },
                {title: 'Created by', field: 'createdBy'}
            ],
            rowDblClick: (e, row) => {
                this.router.navigate([`/edit-books/${row.getData().id}`]);
            },
            cellClick: (e, cell) => {
                if (cell.getColumn().getDefinition().title == 'Edit') {
                    this.router.navigate([`/edit-books/${cell.getRow().getData().id}`]);
                }
            }
        });
    }

    upload() {
        this.router.navigate(['/upload-books']);
    }

    encryptionDRM() {
        alert("encryptionDRM file");
    }

    publish() {
        alert("publish");
    }

}
