import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/service/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  roomList: any[] = [];

  constructor(private roomService: RoomService, private http: HttpClient) { } // Inject HttpClient here

  ngOnInit(): void {
    this.getAllRooms();
  }

  getAllRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (data: any) => {
        this.roomList = data.data;
      },
      error: (error: any) => {
        console.error('There was an error!', error);
      }
    });
  }

  AddNewRoom() {
    const newRoom = {
      roomId: 0,
      roomName: '',
      isAcAvailable: false,
      roomCapacity: 0,
      isActive: false,
      roomTariff: 0.0,
      extensionNo: ''
    };
    this.roomList.push(newRoom);
  }

  onDelete(roomId: number) {
    console.log('Deleting room:', roomId);
    this.http.delete(`http://localhost:3000/DeleteRoomById/${roomId}`)
      .subscribe(
        () => {
          console.log('Room deleted successfully!');
          // Optional: Remove the room from the local list if needed
          // this.roomList = this.roomList.filter(room => room.roomId !== roomId);
          this.getAllRooms(); // Refresh room list after deletion
        },
        (error: any) => {
          console.error('Error deleting room:', error);
        }
      );
  }

  saveRooms() {
    this.roomService.saveUpdateRoom(this.roomList).subscribe({
      next: () => {
        console.log('Rooms saved successfully!');
        this.getAllRooms(); // Refresh the room list after saving
      },
      error: (error: any) => {
        console.error('There was an error saving the rooms!', error);
      }
    });
  }
}
