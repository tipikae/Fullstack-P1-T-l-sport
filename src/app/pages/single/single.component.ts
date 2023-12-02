import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

/**
 * Single country page component.
 */
@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrl: './single.component.scss'
})
export class SingleComponent implements OnInit {

  arrow = faArrowLeft;
  title: string = '';
  numberOfEntries: number = 0;
  numberOfMedals: number = 0;
  numberOfAthletes: number = 0;

  lineChartData!: ChartConfiguration['data'];
  lineChartOptions!: ChartConfiguration['options'];
  lineChartType!: ChartType;

  isLoading$!: Observable<Boolean>;
  error$!: Observable<String>;

  constructor( private olympicService: OlympicService,
               private route: ActivatedRoute,
               private router: Router ) {}

  ngOnInit(): void {
    this.isLoading$ = this.olympicService.isLoading$;
    this.setChartConfig();
    let id = this.route.snapshot.params['id'];
    this.olympicService.getOlympic(id).subscribe({
      next: (data: Olympic) => this.fillData(data),
      error: (msg: any) => this.router.navigateByUrl('not-found')
    });
  }
  
  private setChartConfig(): void {
    this.setChartOptions();
    this.setChartType();
  }
  
  private setChartType() {
    this.lineChartType = 'line';
  }
  
  private setChartOptions() {
    this.lineChartOptions = {
      elements: {
        line: {
          tension: 0,
        },
      },
      scales: {
        y: {
          position: 'left',
          suggestedMin: 0
        },
        x: {
          title: {
            display: true,
            text: 'Dates'
          }
        }
      },
      plugins: {
        legend: { 
          display: false 
        },
      },
    };
  }

  private fillData(olympic: Olympic): void {
    this.fillTitle(olympic);
    this.fillNumberOfEntries(olympic);
    this.fillNumberOfMedals(olympic);
    this.fillNumberOfAthletes(olympic);
    this.fillChart(olympic);
  }
  
  private fillNumberOfAthletes(olympic: Olympic) {
    let athletes = 0;
    let participations = olympic.participations;
    participations.forEach(participation => athletes += participation.athleteCount);
    this.numberOfAthletes = athletes;
  }
  
  private fillNumberOfMedals(olympic: Olympic) {
    let medals = 0;
    let participations = olympic.participations;
    participations.forEach(participation => medals += participation.medalsCount);
    this.numberOfMedals = medals;
  }
  
  private fillNumberOfEntries(olympic: Olympic) {
    this.numberOfEntries = olympic.participations.length;
  }
  
  private fillTitle(olympic: Olympic) {
    this.title = olympic.country;
  }

  private fillChart(olympic: Olympic): void {
    let labels: number[] = [];
    let data: number[] = [];
    let participations = olympic.participations;

    participations.forEach(participation => {
      data.push(participation.medalsCount);
      labels.push(participation.year)
    });

    this.lineChartData = {
      datasets: [
        {
          data: data,
          backgroundColor: 'rgba(0,0,0,0)',
          fill: 'origin',
        }
      ],
      labels: labels,
    };
  }
}
