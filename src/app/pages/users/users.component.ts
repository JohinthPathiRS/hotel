import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userList: any[] = [];
  userObj: any = {
    "username": "",
    "password": "",
    "role": ""
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.http.get<any>('http://localhost:3000/selectusers').subscribe({
      next: (res) => {
        this.userList = res.data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        alert('An error occurred while fetching users.');
      }
    });
  }

  onSaveUser() {
    console.log('userObj:', this.userObj);

    this.http.post<any>('http://localhost:3000/users', this.userObj)
      .subscribe(
        (res: any) => {
          if (res.result) {
            alert('User Created Successfully');
            this.getUsers();
          } else {
            alert(res.message);
          }
        },
        (error) => {
          console.error('Error saving user:', error);
          alert('An error occurred while saving the user.');
        }
      );
  }

  onEdit(data: any) {
    this.userObj = { ...data };
}

onDelete(id: number) {
    const isDelete = confirm('Are you sure you want to delete?');
    if (isDelete) {
        this.http.delete<any>('http://localhost:3000/users/' + id)
            .subscribe(
                (res: any) => {
                    if (res.result) {
                        alert('User Deleted');
                        this.getUsers();
                    } else {
                        alert(res.message);
                    }
                },
                (error) => {
                    console.error('Error deleting user:', error);
                    alert('An error occurred while deleting the user.');
                }
            );
    }
}

onUpdateUser(userId: number) {
  console.log('Updating user:', userId);

  this.http.put<any>('http://localhost:3000/users/' + userId, this.userObj)
    .subscribe(
      (res: any) => {
        if (res.result) {
          alert('User Updated Successfully');
          this.getUsers();
        } else {
          alert(res.message);
        }
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('An error occurred while updating the user.');
      }
    );
}


}
