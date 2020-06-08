import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

import { UsersService } from 'src/app/services/users.service';
import { MapService } from '../../services/map.service';
import * as mapboxgl from 'mapbox-gl';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeWhile, concatMap, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.scss']
})
export class LocatorComponent implements OnInit {

  @ViewChild('newPlaceModal') private newPlaceModalElem: ModalComponent;

  categories = [];

  private ngUnsubscribe$ = new Subject<void>();
  private mapStyle: string;
  private options = {
    enableHighAccuracy: true,
  };
  private img = '/assets/img/profile-photo-round.svg';

  constructor(
    private mapService: MapService,
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.mapStyle = this.mapService.mapTheme.getValue();
    this.initPosition();
    this.mapService.places.features.forEach(feature => { if (!this.categories.includes(feature)) this.categories.push(feature.properties.icon) });
    this.modalService.btnClicked.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      if (res === 'newPlaceBtn') {
        this.toggleModal(this.newPlaceModalElem);
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
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
      this.addMarker(user);
    }
  }

  showUserLocation(selectedUser) {
    this.mapService.markers.find(marker => marker.id === selectedUser._id)
  }

  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  onChecked(layerID: string, checked: boolean) {
    this.mapService.filterPlace(`poi-${layerID.toLowerCase()}`, checked, this.mapService.map);
  }

  private addMarker(user: User) {
    // const marker = this.markers.find(marker => marker.id === user._id);
    const html = this.createHtmlMarker(user);
    const coords = new mapboxgl.LngLat(+user.location.lng, +user.location.lat);
    const newMarker = new mapboxgl.Marker(html).setLngLat(coords).addTo(this.mapService.map);
    this.mapService.markers.push({ id: user._id, marker: newMarker });
  }

  private createHtmlMarker(user: User): HTMLDivElement {
    const overlay = this.renderer.createElement('div');
    this.renderer.addClass(overlay, 'marker');
    const overlayContainer = this.renderer.createElement('div');
    this.renderer.addClass(overlayContainer, 'user__img-wrapper');
    this.renderer.addClass(overlayContainer,  'user__img-wrapper--medium');
    const userPhoto = this.renderer.createElement('img');
    this.renderer.addClass(userPhoto, 'user__img');
    this.renderer.addClass(userPhoto, 'user__img--medium');
    this.renderer.setProperty(userPhoto, 'src', user.avatar.toString() || this.img);
    this.renderer.appendChild(overlayContainer, userPhoto);
    this.renderer.appendChild(overlay, overlayContainer);
    return overlay;
  }



}
