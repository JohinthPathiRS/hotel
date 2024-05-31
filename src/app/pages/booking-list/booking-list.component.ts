import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'],
  providers: [DatePipe]
})
export class BookingListComponent implements OnInit {

  bookings: any[] = [];

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings() {
    this.http.get<any[]>('http://localhost:3000/GetAllBookings')
      .subscribe(
        (data) => {
          // If you want to transform dates here, uncomment the next lines and modify accordingly
          this.bookings = data.map(booking => ({
            ...booking,
            startDate: this.datePipe.transform(booking.startDate, 'yyyy/MM/dd'),
            endDate: this.datePipe.transform(booking.endDate, 'yyyy/MM/dd')
          }));
        },
        (error) => {
          console.error('Error fetching bookings:', error);
        }
      );
  }

  checkout(bookingId: number) {
    if (confirm('Are you sure you want to checkout? This will delete the booking.')) {
      this.http.delete(`http://localhost:3000/deleteBooking/${bookingId}`)
        .subscribe(
          (response: any) => {
            console.log('Checkout and deletion successful:', response);
            // Refresh the bookings list
            this.fetchBookings();
          },
          (error) => {
            console.error('Error during checkout and deletion:', error);
          }
        );
    }
  }
}
