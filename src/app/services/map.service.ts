import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = `mapbox://styles/mapbox/streets-v11`;
  zoom = 15;


  geojson = {
    'type': 'FeatureCollection',
    'features': []
  };

  private img = '../../../../assets/img/profile-photo-round.svg';

  constructor() {
    this.mapbox.accessToken = environment.mapBoxToken;
  }

  buildMap(position) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
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
      userPhoto.src = user.avatar.toString() || this.img;

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
