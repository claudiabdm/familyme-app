import { Component, OnInit, ViewChild } from '@angular/core';
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

  private ngUnsubscribe$ = new Subject<void>();
  private mapStyle: string;
  private options = {
    enableHighAccuracy: true,
  };

  constructor(
    private mapService: MapService,
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.mapStyle = this.mapService.mapTheme.getValue();
    this.initPosition();
    this.modalService.btnClicked.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      if(res === 'newPlaceBtn') {

        this.toggleModal(this.newPlaceModalElem);
      }
    })
  }

  initPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position)
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
        this.spinner.hide();
      },
        error => window.alert(`${error}: Fail to find location`)
      ),
        this.options
    }
  }

  setUsersPosition(user: User) {
    if (user.locationOn && user.location.lat && user.location.lng) {
      this.mapService.addMarker(user);
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }


}
