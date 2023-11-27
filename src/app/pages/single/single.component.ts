import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single.component.html',
  styleUrl: './single.component.scss'
})
export class SingleComponent implements OnInit {

  id!: number
  olympic!: Olympic | undefined;

  constructor( private olympicService: OlympicService,
               private route: ActivatedRoute,
               private router: Router ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.olympicService.getOlympic(this.id).subscribe({
      next: (data) => this.fillData(data),
      error: (msg) => this.router.navigateByUrl('not-found')
    });
  }

  private fillData(olympic: Olympic | undefined): void {

  }
}
