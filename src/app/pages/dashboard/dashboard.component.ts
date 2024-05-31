import { Component } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


  images = [
    {
      src: 'https://imageio.forbes.com/specials-images/imageserve/652f603a91415a3d647fc207/Modern-Style-Bedroom/960x0.jpg?format=jpg&width=1440',
      alt: 'Room 1',
      description: 'Luxurious room with a view of the sea.'
    },
    {
      src: 'https://imageio.forbes.com/specials-images/imageserve/652f6171ec0ae0e868d5da9a/Ashton-Woods-Bedroom-2/960x0.jpg?format=jpg&width=1440',
      alt: 'Room 2',
      description: 'Cozy room with a balcony overlooking the city.'
    },
    {
      src: 'https://imageio.forbes.com/specials-images/imageserve/652f646c8b486a76cd884933/Ashton-Wood-Bedroom-Color/960x0.jpg?format=jpg&width=1440',
      alt: 'Pool',
      description: 'Relax and unwind by our beautiful swimming pool.'
    },
    {
      src: '/assets/AdobeStock_131189921_Preview.jpeg',
      alt: 'View',
      description: 'Breathtaking view of the mountains from our hotel.'
    }
  ];

}
