import { ApplicationRef, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import { User } from '../shared/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { DataService } from './data.service';

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

  places = {
    'type': 'FeatureCollection' as const,
    'features': [
      {
        'type': 'Feature' as const,
        'properties': {
          icon: 'restaurant'
        },
        'geometry': {
          'type': 'Point' as const,
          'coordinates': [-3.859567, 40.475012],
        }
      },
      {
        'type': 'Feature' as const,
        'properties': {
          icon: 'school'
        },
        'geometry': {
          'type': 'Point' as const,
          'coordinates': [-3.876872, 40.467926],
        }
      }
    ]
  };

  private img = '../../../../assets/img/profile-photo-round.svg';

  constructor(
    private ref: ApplicationRef,
    private usersService: UsersService,
    private dataService: DataService,
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

  buildMap(position: Position, style: string) {
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
      this.addSource(this.map, 'places', this.places);
      this.addLayer(this.map, this.places);
    });
  }

  addNewPlace(place) {
    const icon = place.categoryName.toLowerCase();
    const newPlace = {
      'type': 'Feature' as const,
      'properties': {
        icon
      },
      'geometry': {
        'type': 'Point' as const,
        'coordinates': place.location.coordinate
      }
    }
    this.places.features.push(newPlace);
    const source = this.map.getSource('places') as mapboxgl.GeoJSONSource;
    source.setData(this.places);
    this.addLayer(this.map, this.places);
  }

  addSource(map, sourceName, data) {
    map.addSource(sourceName, {
      type: 'geojson',
      data
    })
  };

  addLayer(map: mapboxgl.Map, data: any) {
    data.features.forEach(feature => {
      const symbol = feature.properties['icon'];
      const layerID = 'poi-' + symbol;
      if (!map.hasImage(symbol)) this.addSvg(symbol, map);
      if (!map.getLayer(layerID)) {
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
      }
    });
  }

  toogleLayer(layerName, visible) {
    const mode = visible ? 'visible' : 'none';
    this.map.setLayoutProperty(layerName, 'visibility', mode);
  }

  addMarker(user: User) {
    // const marker = this.markers.find(marker => marker.id === user._id);
    const html = this.createHtmlMarker(user);
    const coords = new mapboxgl.LngLat(+user.location.lng, +user.location.lat);
    const newMarker = new mapboxgl.Marker(html).setLngLat(coords).addTo(this.map);
    this.markers.push({ id: user._id, marker: newMarker });
  }

  updateUserCoords(user: User, position: Position): Observable<User[]> {
    user.location.lat = position.coords.latitude;
    user.location.lng = position.coords.longitude;
    return this.usersService.updateUserData(user);
  }

  searchPlace(text: string) {
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

  addLocation(location) {
    const coords = new mapboxgl.LngLat(location.coordinate[0], location.coordinate[1]);
    const newMarker = new mapboxgl.Marker().setLngLat(coords).addTo(this.map);
  }

  filterPlace(layerID: string, checked: boolean, map: mapboxgl.Map) {
    map.setLayoutProperty(
      layerID,
      'visibility',
      checked ? 'visible' : 'none'
    );
  }

  private addSvg(symbol: string, map: mapboxgl.Map) {
    let img = new Image(30, 30);
    img.onload = () => map.addImage(symbol, img);
    img.src = `/assets/icons/${symbol}.svg`;
  }

  private createHtmlMarker(user: User): HTMLDivElement {
    const overlay = document.createElement('div');
    overlay.classList.add('marker');
    const overlayContainer = document.createElement('div');
    overlayContainer.classList.add('user__img-wrapper', 'user__img-wrapper--medium');
    const userPhoto = document.createElement('img');
    userPhoto.classList.add('user__img', 'user__img--medium');
    userPhoto.src = user.avatar.toString() || this.img;
    overlayContainer.appendChild(userPhoto);
    overlay.appendChild(overlayContainer);
    return overlay;
  }



}
