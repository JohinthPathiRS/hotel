import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.css']
})
export class NewBookingComponent implements OnInit {

  bookingObj: any = {
    name: "",
    mobileNo: "",
    email: "",
    aadharNo: "",
    city: "",
    address: "",
    roomId: 0,
    bookingFromDate: "",
    bookingToDate: "",
    bookingRate: 0,
    naration: "",
    hotelBookingDetails: []
  };

  guestObj: any = {
    customerName: "",
    aadharCardNo: ""
  };
  private apiEndPoint: string = "http://localhost:3000";

  roomList: any[] = [];
  
  constructor(private roomSrv: RoomService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    this.roomSrv.getAllRooms().subscribe((res: any) => {
      this.roomList = res.data;
    });
  }

  addGuest() {
    this.bookingObj.hotelBookingDetails.push({ ...this.guestObj });
  }

  removeGuest(index: number) {
    this.bookingObj.hotelBookingDetails.splice(index, 1);
  }

  onSaveBooking() {
    this.http.post(`${this.apiEndPoint}/CreateBooking`, this.bookingObj)
      .subscribe(
        (res: any) => {
          if (res.result) {
            alert('Booking Created');
          } else {
            alert(res.message);
          }
        },
        (error: HttpErrorResponse) => {
          console.error('Error occurred while creating booking:', error);
          // Handle error
        }
      );
  }
}
