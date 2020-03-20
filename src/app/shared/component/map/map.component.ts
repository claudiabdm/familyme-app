import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user';
import { MapService } from 'src/app/services/map.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(private mapService: MapService, private dataService: DataService, private usersService: UsersService) { }

  ngOnInit(): void {

    if (navigator) {

      navigator.geolocation.getCurrentPosition(position => {

        this.mapService.buildMap(position);
        this.dataService.user.location.lat = position.coords.latitude;
        this.dataService.user.location.lng = position.coords.longitude;
        this.usersService.updateUser(this.dataService.user).subscribe();
        this.dataService.userList.forEach((user) => {
          if (user.location.lat && user.location.lng) {

            this.mapService.addMarker(user, this.mapService.map);
          }
        })
      })
    }
  }


}
