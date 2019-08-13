import { Component, OnInit,ViewChild,AfterViewInit,ElementRef } from '@angular/core';

@Component({
  selector: 'app-zoom-image',
  templateUrl: './zoom-image.component.html',
  styleUrls: ['./zoom-image.component.scss']
})
export class ZoomImageComponent implements OnInit,AfterViewInit {

  zoomImageURL: string;
  @ViewChild('zoomImageModel',{static: false}) zoomImageModel: ElementRef;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
   
  }

  zoomImage(url) {
    this.zoomImageURL = url;
    this.zoomImageModel.nativeElement.style.display="block";
  }

  closeImage() {
    this.zoomImageModel.nativeElement.style.display="none";
  }


}
