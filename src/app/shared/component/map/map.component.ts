import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';

import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private ngUnsubscribe$ = new Subject<void>();

  constructor(private mapService: MapService, private dataService: DataService, private usersService: UsersService) { }

  ngOnInit(): void {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.mapService.buildMap(position);
        this.dataService.user.location.lat = position.coords.latitude;
        this.dataService.user.location.lng = position.coords.longitude;
        this.usersService.updateUser(this.dataService.user).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
          this.dataService.userList.forEach((user) => {
            if (user.location.lat && user.location.lng) {
              this.mapService.addMarker(user, this.mapService.map);
            }
          })
        })
      })
    }
  }


  ngOnDestroy(): void {
    console.log('destroy')
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }


}
