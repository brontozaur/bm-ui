import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class NotificationService {

    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(private snackBar: MatSnackBar) {
    }

    showErrorNotification(message: string) {
        this.snackBar.open(message, 'x', {
            duration: 3000,
            panelClass: ["error-custom-style"],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    showOKNotification(message: string) {
        this.snackBar.open(message, 'x', {
            duration: 3000,
            panelClass: ["ok-custom-style"],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
