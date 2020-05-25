import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { MapService } from '../../services/map.service';
import * as mapboxgl from 'mapbox-gl';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile, concatMap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';

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
    private usersService: UsersService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.mapStyle = this.mapService.mapTheme.getValue();
    this.initPosition();
  }

  initPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        this.mapService.buildMap(position, this.mapStyle);

        this.usersService.getLoggedUser()
          .pipe(
            concatMap((user: User) => user.locationOn ? this.mapService.updateUserCoords(user, position) : this.usersService.getUsersByFamilyCode(user.familyCode)),
            takeWhile((users: User[]) => !users, true),
          )
          .subscribe((users: User[]) => {
            users?.forEach((user: User) => this.setUsersPosition(user));
            this.spinner.hide();
          }
          );
      },
        error => window.alert(`${error}: Fail to find location`)
      ),
        this.options
    }
  }

  setUsersPosition(user: User) {
    if (user.locationOn && user.location.lat && user.location.lng) {
      this.mapService.addMarker(user, this.mapService.map);
    }
  }

  showUserLocation(selectedUser) {

    this.mapService.markers.find(marker => marker.id === selectedUser._id)
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }


}
