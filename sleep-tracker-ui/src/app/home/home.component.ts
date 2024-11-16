import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule,
    RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Düzeltilmiş
})
export class HomeComponent implements AfterViewInit {
  public apiUrl = "http://localhost:5010/api";
  sleepData = new MatTableDataSource<any>();
  public displayedColumns: string[] = ['id', 'start', 'end', 'duration'];
  
  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.sleepData.paginator = this.paginator; // Düzeltilmiş
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>(`${this.apiUrl}/Sleep`).subscribe((res) => {
      console.table(res);
      this.sleepData.data = res;
    });
  }
}
