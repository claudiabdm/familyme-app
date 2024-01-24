import { ApplicationRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import { NgxSpinnerService } from 'ngx-spinner';

import { User } from '../shared/models/user';
import { DataService } from './data.service';
import { UsersService } from 'src/app/services/users.service';
import { GroupsService } from './groups.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  geocoderUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  map: mapboxgl.Map;
  markers: { id: string, marker: mapboxgl.Marker }[] = [];
  placeMarkers: { id: string, marker: mapboxgl.Marker }[] = [];
  themes = ['mapbox://styles/mapbox/light-v10', 'mapbox://styles/mapbox/dark-v10']
  mapTheme = new BehaviorSubject(this.themes[0]);
  categories: string[] = ['restaurant', 'school', 'home', 'cafe', 'park', 'work', 'other']

  constructor(
    private ref: ApplicationRef,
    private usersService: UsersService,
    private dataService: DataService,
    private groupService: GroupsService,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) {
    const darkModeOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (darkModeOn) {
      this.mapTheme.next(this.themes[1]);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
      this.mapTheme.next(e.matches ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10');
      this.ref.tick();
    });

  }

  buildMap(position: GeolocationPosition, style: string): void {
    if (this.map) {
      this.map.remove();
    }
    this.map = new mapboxgl.Map({
      accessToken: environment.mapBoxToken,
      container: 'map',
      style: style,
      zoom: 15,
      center: [position.coords.longitude, position.coords.latitude],
    });

    this.map.on('load', () => {
      this.dataService.groupData$.subscribe(res => {
        this.addSource(this.map, 'places', res.savedPlaces);
        this.addLayer(this.map, res.savedPlaces);
        this.spinner.hide();
      })
    });
  }

  addNewPlace(place): void {
    const icon = place.categoryName.toLowerCase();
    const newPlace = {
      'type': 'Feature',
      'properties': {
        name: place.title,
        description: place.address,
        icon
      },
      'geometry': {
        'type': 'Point',
        'coordinates': place.location.coordinate
      }
    }
    this.dataService.groupData$.pipe(
      map(res => {
        res.savedPlaces.features.push(newPlace);
        const source = this.map.getSource('places') as mapboxgl.GeoJSONSource;
        source.setData(res.savedPlaces);
        this.addLayer(this.map, res.savedPlaces);
        return res;
      }),
      switchMap(res => this.groupService.updateGroupData(res)),
      take(1)
    ).subscribe();
  }

  addSource(map, sourceName, data): void {
    map.addSource(sourceName, {
      type: 'geojson',
      data
    })
  };

  addLayer(map: mapboxgl.Map, data: any): void {
    data.features.forEach(feature => {
      const symbol = feature.properties['icon'];
      const layerID = 'poi-' + symbol;
      if (!map.getLayer(layerID)) {
        this.addSvg(symbol, map);
        map.addLayer({
          'id': layerID,
          'type': 'symbol',
          'source': 'places',
          'layout': {
            'icon-image': symbol,
            'icon-allow-overlap': true,
          },
          'filter': ['==', 'icon', symbol]
        });
        this.addClickOnPlace(map, layerID)
      }
    });
  }

  toogleLayer(layerName, visible): void {
    const mode = visible ? 'visible' : 'none';
    this.map.setLayoutProperty(layerName, 'visibility', mode);
  }

  updateUserCoords(user: User, position: GeolocationPosition): Observable<User[]> {
    user.location.lat = position.coords.latitude;
    user.location.lng = position.coords.longitude;
    return this.usersService.updateUserData(user);
  }

  searchPlace(text: string): Observable<any[]> {
    let search = text.replace(' ', '%20');
    return this.http.get(`${this.geocoderUrl}/${search}.json?access_token=${environment.mapBoxToken}&autocomplete=true`)
      .pipe(
        map((res) => {
          const locations = [];
          res['features'].forEach(feature => {
            const location = {
              name: feature.place_name,
              coordinate: feature.center,
            }
            locations.push(location);
          })
          return locations;
        })
      );
  }

  filterPlace(layerID: string, checked: boolean, map: mapboxgl.Map): void {
    map.setLayoutProperty(
      layerID,
      'visibility',
      checked ? 'visible' : 'none'
    );
  }

  private addSvg(symbol: string, map: mapboxgl.Map): void {
    let img = new Image(30, 30);
    img.onload = () => map.addImage(symbol, img);
    img.src = `/assets/icons/${symbol}.svg`;
  }

  private addClickOnPlace(map: mapboxgl.Map, layerID: string): void {
    map.on('click', layerID, (e) => {
      const coordinates = e.features[0].geometry['coordinates'].slice();
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <section class="map-popup">
            <h2 class="map-popup__title">${e.features[0].properties.name}</h2>
            <p class="map-popup__desc">${e.features[0].properties.description}</p>
          </section>
          `)
        .addTo(map);
    })
  }

}
