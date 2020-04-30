import { ApplicationRef, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import { User } from '../../shared/models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MapService {

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;

  themes = ['mapbox://styles/mapbox/light-v10', 'mapbox://styles/mapbox/dark-v10']
  mapTheme = new BehaviorSubject(this.themes[0]);


  geojson = {
    'type': 'FeatureCollection',
    'features': []
  };

  private img = '../../../../assets/img/profile-photo-round.svg';

  constructor(private ref: ApplicationRef) {
    this.mapbox.accessToken = environment.mapBoxToken;
    const darkModeOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (darkModeOn) {
      this.mapTheme.next(this.themes[1]);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
      this.mapTheme.next(e.matches ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10');
      this.ref.tick();
    });

  }

  buildMap(position, style) {
    if (this.map) {
      this.map.remove();
    }
    this.map = new mapboxgl.Map({
      container: 'map',
      style: style,
      zoom: 15,
      center: [position.coords.longitude, position.coords.latitude]
    });
    // this.map.addControl(new mapboxgl.NavigationControl());
  }

  addMarker(user: User, map: mapboxgl.Map) {
    const overlay = document.createElement('div');
    overlay.classList.add('marker');
    const overlayContainer = document.createElement('div');
    overlayContainer.classList.add('user__img-wrapper', 'user__img-wrapper--medium');
    const userPhoto = document.createElement('img');
    userPhoto.classList.add('user__img', 'user__img--medium');
    userPhoto.src = user.avatar.toString() || this.img;

    overlayContainer.appendChild(userPhoto);
    overlay.appendChild(overlayContainer);

    const coords = new mapboxgl.LngLat(user.location.lng, user.location.lat);

    this.geojson.features.push({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': coords,
      }
    }
    )
    new mapboxgl.Marker(overlay).setLngLat(coords).addTo(map);

  }

}
