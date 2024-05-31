// chat.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/chat'; 

  constructor(private http: HttpClient) { }

  sendMessage(userPrompt: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { userPrompt });
  }
}
