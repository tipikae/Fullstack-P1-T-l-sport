import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  public numberOfJOs$: Observable<number> = of(0);
  public numberOfCountries$: Observable<number> = of(0);

  public pieChartData!: ChartData<'pie', number[], string | string[]>;
  public pieChartOptions!: ChartConfiguration['options'];
  public pieChartType!: ChartType;
  public pieChartPlugins = [DatalabelsPlugin];

  constructor(private olympicService: OlympicService,
              private router: Router) {}

  ngOnInit(): void {
    this.setChartConfig();
    this.olympicService.getOlympics().subscribe( (data: Olympic[]) => this.fillData(data) );
  }

  private fillData(olympics: Olympic[]): void {
    this.fillNumberOfCountries(olympics);
    this.fillNumberOfJOs(olympics);
    this.fillChart(olympics);
  }

  private fillNumberOfCountries(olympics: Olympic[]): void {
    this.numberOfCountries$ = of(olympics.length);
  }

  private fillNumberOfJOs(olympics: Olympic[]): void {
    let numberMax = 0;
    olympics.forEach(country => {
      let participations: Participation[] = country.participations;
      numberMax < participations.length ? numberMax = participations.length : null;
    });
    this.numberOfJOs$ = of(numberMax);
  }

  private fillChart(olympics: Olympic[]): void {
    let labels: string[] = [];
    let data: number[] = [];

    olympics.forEach(country => {
      let participations: Participation[] = country.participations;
      let medals = 0;
      participations.forEach(participation => medals += participation.medalsCount);
      data.push(medals);
      labels.push(country.country);
    });

    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
        },
      ],
    };
  }

  private setChartConfig(): void {
    this.setChartOptions();
    this.setChartType();
  }

  private setChartOptions(): void {
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          formatter: (value: any, ctx: any) => {
            if (ctx.chart.data.labels) {
              return ctx.chart.data.labels[ctx.dataIndex];
            }
          },
        },
        tooltip: {
          displayColors: true,

        }
      },
      onClick: (event, elements, chart) => {
        let index = elements[0].index;
        this.router.navigateByUrl('country/' + (index + 1));
      }
    };
  }

  private setChartType(): void {
    this.pieChartType = 'pie';
  }
}