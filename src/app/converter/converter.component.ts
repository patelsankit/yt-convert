import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="converter-container">
      <h2>YouTube to MP3 Converter</h2>
      <form (ngSubmit)="onConvert()" novalidate>
        <input
          type="text"
          [(ngModel)]="youtubeUrl"
          name="youtubeUrl"
          placeholder="Enter YouTube URL"
          required>
        <button type="submit" [disabled]="isConverting || !youtubeUrl.trim()">Convert</button>
      </form>
      <div *ngIf="isConverting" class="loading">
        <p>Converting, please wait...</p>
      </div>
      <div *ngIf="errorMessage" class="error">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .converter-container {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      text-align: center;
    }
    input {
      width: 70%;
      padding: 10px;
      margin-right: 10px;
      font-size: 1rem;
    }
    button {
      padding: 10px 20px;
      font-size: 1rem;
    }
    .loading {
      margin-top: 10px;
      color: #555;
    }
    .error {
      color: red;
      margin-top: 10px;
    }
  `]
})
export class ConverterComponent {
  youtubeUrl: string = '';
  errorMessage: string = '';
  isConverting: boolean = false;

  constructor(private http: HttpClient) {}

  onConvert() {
    this.errorMessage = '';
    if (!this.youtubeUrl.trim()) {
      this.errorMessage = 'Please enter a YouTube URL.';
      return;
    }

    // Extract the video ID from the provided URL.
    const videoId = this.extractVideoId(this.youtubeUrl);
    if (!videoId) {
      this.errorMessage = 'Invalid YouTube URL.';
      return;
    }

    this.isConverting = true;
    // Build the API endpoint URL using the video ID.
    const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;

    // Set up the required headers for RapidAPI.
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
      'x-rapidapi-key': '7870eaa5cbmsh347f1b8fd5ffd23p1cb05cjsne83bbf9a5eae'  // Replace with your RapidAPI key.
    });

    // Call the API.
    this.http.get(apiUrl, { headers })
      .subscribe({
        next: (response: any) => {debugger
          this.isConverting = false;
          // The API is expected to return a JSON object with a "link" property.
          if (response && response.link) {
            // Open the download link in a new window/tab.
            window.open(response.link, '_blank');
          } else {
            this.errorMessage = 'Conversion failed: No download link received.';
          }
        },
        error: err => {debugger
          this.isConverting = false;
          console.error('Conversion error:', err);
          this.errorMessage = 'There was an error converting the video. Please try again.';
        }
      });
  }

  // Helper function to extract the YouTube video ID from a URL.
  extractVideoId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
