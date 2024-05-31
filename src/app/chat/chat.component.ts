// chat.component.ts

import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userMessage = '';
  messages: { text: string, role: string }[] = [];

  constructor(private chatService: ChatService) { }

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.messages.push({ text: this.userMessage, role: 'user' });
      this.chatService.sendMessage(this.userMessage)
        .subscribe(response => {
          this.messages.push({ text: response.response, role: 'assistant' });
        }, error => {
          console.error('Error:', error);
          this.messages.push({ text: 'Oops! Something went wrong. Please try again.', role: 'assistant' });
        });
      this.userMessage = '';
    }
  }
}
