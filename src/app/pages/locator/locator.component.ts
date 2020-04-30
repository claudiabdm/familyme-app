import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { MapService } from './map.service';

@Component({
  selector: 'app-locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.scss']
})
export class LocatorComponent implements OnInit {

  private ngUnsubscribe$ = new Subject<void>();
  private mapStyle: string;
  constructor(
    private mapService: MapService,
    private dataService: DataService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.mapService.mapTheme.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((theme: string) => {
          this.mapStyle = theme;
          this.mapService.buildMap(position, this.mapStyle);
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
      });
    }
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }


}
