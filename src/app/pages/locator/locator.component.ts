import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { MapService } from './map.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.scss']
})
export class LocatorComponent implements OnInit {

  private ngUnsubscribe$ = new Subject<void>();
  private mapStyle: string;
  private options = {
    enableHighAccuracy: true,
  };

  constructor(
    private mapService: MapService,
    private dataService: DataService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    if (navigator) {
      this.mapStyle = this.mapService.mapTheme.getValue();
      navigator.geolocation.getCurrentPosition(
        position => {
          this.mapService.buildMap(position, this.mapStyle);
          this.dataService.getMembers().forEach(user => {
            if (user._id === this.dataService.getUser()._id) {
              this.mapService.updateUserCoords(user, position).subscribe();
            }
            if (user.location.lat && user.location.lng) {
              this.mapService.addMarker(user, this.mapService.map);
            }
          })
        },
        error => { },
        this.options
      );

      navigator.geolocation.watchPosition(
        position => {
          this.mapService.updateUserCoords(this.dataService.getUser(), position);
          this.usersService.getUsersByFamilyCode(this.dataService.getUser().familyCode).subscribe(users => {
            users.forEach((user) => {
              if (user._id === this.dataService.getUser()._id) {
                this.mapService.updateUserCoords(user, position).subscribe();
              }
              if (user.location.lat && user.location.lng) {
                this.mapService.addMarker(user, this.mapService.map);
              }
            })
          });
        },
        error => { },
        this.options
      )

    }
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }


}
