import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Statistic } from 'src/app/core/models/Statisitic';

/**
 * Home page component.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  statistics: Statistic[] = [];
  numberOfJOsTitle: string = 'Number of JOs';
  numberOfCountriesTitle = 'Number of countries';

  pieChartData!: ChartData<'pie', number[], string | string[]>;
  pieChartOptions!: ChartConfiguration['options'];
  pieChartType!: ChartType;
  pieChartPlugins = [DatalabelsPlugin];
  
  isLoading$!: Observable<Boolean>;
  error$!: Observable<String>;

  constructor(private olympicService: OlympicService,
              private router: Router) {}

  ngOnInit(): void {
    this.isLoading$ = this.olympicService.isLoading$;
    this.error$ = this.olympicService.error$
    this.setChartConfig();
    this.olympicService.getOlympics().subscribe(
      (data: Olympic[]) => this.fillData(data)
    );
  }

  private fillData(olympics: Olympic[]): void {
    this.fillStatistics(olympics);
    this.fillChart(olympics);
  }

  private fillStatistics(olympics: Olympic[]) {
    this.fillNumberOfJOs(olympics);
    this.fillNumberOfCountries(olympics);
  }

  private fillNumberOfJOs(olympics: Olympic[]): void {
    let title = this.numberOfJOsTitle;
    let value = 0;
    olympics.forEach(country => {
      let participations: Participation[] = country.participations;
      value < participations.length ? value = participations.length : null;
    });
    this.statistics.push({title, value});
  }

  private fillNumberOfCountries(olympics: Olympic[]): void {
    let title = this.numberOfCountriesTitle;
    let value = olympics.length;
    this.statistics.push({title, value});
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
          enabled: false,
          position: 'nearest',
          external: this.externalTooltipHandler
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

  /*
   * Customize tooltip to insert icon.
   */
  private externalTooltipHandler(context: any): any {
    // Tooltip Element
    const {chart, tooltip} = context;
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
  
      const table = document.createElement('table');
      table.style.margin = '0px';
  
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b: any) => b.lines);
  
      const tableHead = document.createElement('thead');
  
      titleLines.forEach((title: any) => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = '0';
  
        const th = document.createElement('th');
        th.style.borderWidth = '0';
        const text = document.createTextNode(title);
  
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
  
      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body: any, i: any) => {
        const colors = tooltip.labelColors[i];
  
        const img = document.createElement('img');
        img.setAttribute('src', 'assets/img/medal.png');
        img.style.width = '20px';
        img.style.height = '20px';
  
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = '0';
  
        const td = document.createElement('td');
        td.style.borderWidth = '0';
  
        const text = document.createTextNode(body);
  
        td.appendChild(img);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
  
      const tableRoot = tooltipEl.querySelector('table');
  
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
  
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  }
}