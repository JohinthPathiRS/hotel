import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiEndPoint: string = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    // Log the error details for debugging
    console.error('Error occurred:', errorMessage);
    console.error('Error object:', error);
    return throwError(() => new Error(errorMessage));
  }

  login(obj: any) {
    return this.http.post(this.apiEndPoint + '/Login', obj)
      .pipe(catchError(this.handleError));
  }

  getAllRooms() {
    return this.http.get(this.apiEndPoint + '/GetAllRooms')
      .pipe(catchError(this.handleError));
  }

  GetBookingsByMonth(month: number) {
    return this.http.get(this.apiEndPoint + '/GetBookingsByMonth?month=' + month)
      .pipe(catchError(this.handleError));///api/HotelBooking/CreateBooking
  }

  saveUpdateRoom(roomList: any) {
    return this.http.post(this.apiEndPoint + '/AddUpdateBulkRooms', roomList)
      .pipe(catchError(this.handleError));
  }

 
  deleteRoom(roomName: string) {
    return this.http.delete(`${this.apiEndPoint}/DeleteRoomByName?roomName=${roomName}`)
      .pipe(catchError(this.handleError));
}

  getAllCustomers() {
    return this.http.get(this.apiEndPoint + '/GetAllCustomers')
      .pipe(catchError(this.handleError));
  }

  getAllUsers() {
    return this.http.get(this.apiEndPoint + '/selectusers')
      .pipe(catchError(this.handleError));
  }

  addUpdateUser(obj: any) {
    return this.http.post(this.apiEndPoint + '/updateusers', obj)
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<any> {
    if (!userId) {
      return throwError(() => new Error("User ID is required"));
    }
    return this.http.delete(`${this.apiEndPoint}deleteusers/${userId}`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting user:', error);
          return throwError(error);
        })
      );
  }

  
  createBooking(bookingObj: any): Observable<any> {
    return this.http.post(`${this.apiEndPoint}/CreateBooking`, bookingObj)
      .pipe(catchError(this.handleError));
  }
}
