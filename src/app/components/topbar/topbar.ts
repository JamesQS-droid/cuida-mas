import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar implements OnInit {

  alertasCount = 0;

  constructor(private api: ApiService) {} 

  ngOnInit() {
    this.api.getAlertas().subscribe({
      next: (res: any[]) => {
        this.alertasCount = res.length;
      },
      error: () => {
        this.alertasCount = 0;
      }
    });
  }
}