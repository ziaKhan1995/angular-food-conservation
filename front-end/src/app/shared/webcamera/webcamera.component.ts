import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dimensions, ImageCroppedEvent, ImageTransform } from '../image-cropper/interfaces';
import { FormControl } from '@angular/forms';
import { buttonAnimation } from './../buttonAnimations';
import { DataUrl, NgxImageCompressService, DOC_ORIENTATION } from 'ngx-image-compress';
import { ErrorsService } from 'src/app/services/errors.service';

interface Picture {
  imageFile: File;
  imageBase64: string;
  multipleWebcamsAvailable: boolean;
  allowCameraSwitch: boolean;
  cameraStatus: boolean;
  deviceId: string;
  errorsInCamera: WebcamInitError[] //error in allowing camera or hardware issue
}

@Component({
  selector: 'webcamera-selector',
  templateUrl: './webcamera.component.html',
  styleUrls: ['./webcamera.component.scss'],
  animations: buttonAnimation()
})
export class WebcameraComponent implements OnInit,AfterViewInit {
  //image size after compression
  imageBeforeCpmression: DataUrl = '';
  //Variables declaration for drag drop statred
  dragDropConfig = {
    showList: false,
    showProgress: true,
    multiple: false
  }

  //Variable for selected tab
  selectedTab = new FormControl(0);
  disabledForSomeTime=false;
  imageURLFromInternt = new FormControl();

  //Variables declaration for NGX image cropper statred
  imageChangedEvent: any = '';
  croppedImage: any | undefined;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;//Emits the LoadedImage when it was loaded into the cropper
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imageTaken: boolean = false;
  linkImageLoaded = false;
  btnClicked = false;
  isCropperReady = false;
  //Variables declaration for NGX image cropper 
  imageLoading = false;
  //Variables declaration ///Started/// for Image Conversion to Base64
  imageUploadedFromDeviceFile: any;
  imageUploadedFromDeviceToBase64String: string;
  imageSource: any = '';
  //Variables declaration ///Ended/// for Image Conversion to Base64
  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  file: File | undefined;
  photoDetail: any | undefined;//passed into this component
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  cameraNotWork = false;
  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  constructor(
    private imageCompress: NgxImageCompressService,
    private errorsService: ErrorsService,
    private _mdr: MatDialogRef<WebcameraComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    if (data) {
      this.photoDetail = data;
      console.info('From child to parent data passed:-', this.photoDetail);
    }
  }
  ngAfterViewInit() {
  }
  public ngOnInit(): void {
    console.info('From child to parent data passed:-',
      (this.photoDetail.id));
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    //listner to change tab value     
    this.selectedTab.valueChanges.subscribe(x => {
      console.log('selectedTab.valueChanges: webcam errors', this.errors);
      if (this.selectedTab.value == 2) {
        this.showWebcam = true;
        this.disabledForSomeTime = true;
        setTimeout(() => {
          this.disabledForSomeTime = false;
        }, 2500);
      }
      else {
        this.showWebcam = false;
      }
    })
    console.log('ngOnInit: webcam errors', this.errors);

  }

  tryAnootherImage() {
    this.imageTaken = false;
    this.imageUploadedFromDeviceToBase64String = '';
    this.croppedImage = '';
    this.btnClicked = false;
    this.isCropperReady = false;
  }

  async compressFile(image) {
    // return this.imageCompress
    // .uploadFile()
    // .then(({ image, orientation, fileName }: UploadResponse) => {
    //   this.imageBeforeCpmression = image;
    //   console.warn('File Name:', fileName);
    //   console.warn(
    //     `Original: ${image.substring(0, 50)}... (${image.length} characters)`
    //   );
    console.warn('++++++111Size in bytes was:', this.imageCompress.byteCount(image));
    var orientation = DOC_ORIENTATION.Up;
    await this.imageCompress
      .compressFile(image, orientation, 50, 50)
      .then((result: DataUrl) => {
        this.croppedImage = result;
        console.warn('++++++2222.00Size in bytes was:', this.imageCompress.byteCount(image));

        console.warn(
          `++++++222Compressed: ${result.substring(0, 50)}... (${
          result.length
          } characters)`
        );
        console.warn(
          '++++++333Size in bytes is now:',
          this.imageCompress.byteCount(result)
        );
      });
    // });
  }

  async saveThisPicture() {
    // await this.compressFile(this.croppedImage);
    await this.compressFile(this.croppedImage);
    console.warn(
      '++++++444Size in bytes is now:',
      this.imageCompress.byteCount(this.croppedImage)
    );
    this.imageLoading = true;
    let imagFile = this.dataURItoBlob(this.croppedImage, 'png');

    //console.log('imageFile:',imageFile);
    let picture: Picture = {
      imageFile: imagFile,
      imageBase64: this.croppedImage,
      multipleWebcamsAvailable: this.multipleWebcamsAvailable,
      allowCameraSwitch: this.allowCameraSwitch,
      cameraStatus: this.showWebcam,
      deviceId: this.deviceId,
      errorsInCamera: this.errors
    };
    this.showWebcam = false;
    setTimeout(() => {
      this.imageLoading = false;
      this._mdr.close(picture);
    }, 100);
    return false;
  }
  // public getLink(event: ClipboardEvent): void {
  //   const isIEorEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
  //   const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  //   if (isIEorEdge) {
  //     const data = event?.clipboardData || window['clipboardData'];
  //     const clipboardData = data?.getData('text');
  //     console.log(clipboardData);
  //   } else {
  //     navigator['clipboard']?.readText()?.then((data) => {
  //       console.log(data);
  //     });
  //   }
  // }
  closeDialog() {
    let picture: Picture = null;
    this.croppedImage = '';
    this._mdr.close(picture);
    this.showWebcam = false;
  }
  dataURItoBlob(imageURI, mimeType) {
    //console.log('imageURI:',imageURI);
    const arr = imageURI.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const fileName = this.photoDetail?.id?.toString() + '.png';
    const file: File = new File([u8arr], fileName, { type: mimeType })
    console.log(file);
    return file;
  }

  public triggerSnapshot(): void {
    // var d={
    //   url:this.webcamImage!.imageAsDataUrl,
    //   event:evnt
    // }
    //this.newItemEvent.emit(this.webcamImage.imageAsDataUrl); 
    this.trigger.next();
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError) {
    this.errors.push(error);
    console.log('webcame errors', this.errors);
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn(
        "Camera access was not allsowed by suer",
        'top');
    }
    return this.errors;
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.file = this.dataURItoBlob(this.webcamImage.imageAsDataUrl, 'jpg');
    this.imageTaken = true;
    this.imageUploadedFromDeviceToBase64String = this.webcamImage.imageAsDataUrl;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  /*** */
  /*** Now From Here Coding for NGX Image Cropper methods Started
  /*** Image cropper for Angular
  /*** */

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageTaken = true;
    console.log('imageChangedEvent uploaded:', this.imageChangedEvent);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log("imageCropped.bytesCount", this.imageCompress.byteCount(this.croppedImage));
    // console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions?: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
    this.isCropperReady = true
  }

  loadImageFailed() {
    console.log('Load failed');
    this.errorsService.showSwalToastMessage('warning', 'Load failed. Please try valid image file', 'top');
    this.imageTaken=false;
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  /**Code For */
  /**Conversion of Image Chosed from device */
  /** To Basse64String*/
  /** This is for matching of image with image taken by webCamera*/
  /** Started from here*/
  public dropped(event: any) {
    console.log('files droppped: ', event);
    this.imageTaken = true;
    var length = event.length > 0 ? event.length - 1 : 0;
    const file: File = event[length];
    if (file) {
      this.imageUploadedFromDeviceFile = file;
      this.handleInputChange(file); // turn into base64
    } else {
      this.errorsService.showSwalToastMessage('error', 'No file selected');
    }
  }
  public picked(event: any) {
    console.log('files uploaded: ', event);
    this.imageTaken = true;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.imageUploadedFromDeviceFile = file;
      this.handleInputChange(file); // turn into base64
    } else {
      this.errorsService.showSwalToastMessage('error', 'No file selected', 'top');
    }
  }
  handleInputChange(files: any) {
    const file = files;
    const pattern = /image-*/;
    var n=file!.name!.lastIndexOf('.');//does it has .
    var iphoneFileType=file!.name!.substring(n+1);
    console.log('file iphoneFileType',iphoneFileType);
    const reader = new FileReader();
    console.log('file image',file);
    if (!file!.type.match(pattern) && iphoneFileType !="heic") {
      this.btnClicked = false;
      this.imageTaken = false;
      this.errorsService.showSwalToastMessage('warning', 'Invalid format', 'top');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e: any) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.imageSource = 'data:image/jpg;base64,' + base64result;
    this.imageUploadedFromDeviceToBase64String = this.imageSource;
    console.log('imageUploadedFromDeviceToBase64String: ', this.imageUploadedFromDeviceToBase64String);
  }
  /** Ended  here*/

  /** Code started for drag and drop  here*/
  getUploadedFiles(event) {
    console.log('Evennnnt', event);
    this.dropped(event);
  }
  /** Code Ended for drag and drop */

  /** Code Strated for Image From URL */
  getImageFromInternetURL(imageInternetUrl) {
    this.btnClicked = true;
    this.linkImageLoaded = false;
    this.getBase64ImageFromURL(imageInternetUrl).subscribe((base64data) => {
      //console.log('getImageFromInternetURL', base64data);
      this.imageUploadedFromDeviceToBase64String = 'data:image/jpg;base64,' + base64data;
      this.imageTaken = true;
      this.linkImageLoaded = true;
      this.btnClicked = false;
    }
      , (error) => {
        this.linkImageLoaded = false;
        this.btnClicked = false;
        this.imageTaken = false;
        this.errorsService.showSwalToastMessage('error',
          'Error in Image link address.\nPlease Save image and retry', 'top');
      }
    );

  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }
  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  /** Code ended for Image link From internet */

  /**Function for copy and pasting image */
  msg = ''
  onPastingImage(event: any) {
    console.log('onPastingImage');
    const items = event.clipboardData.items;
    let blob = null;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
        this.msg = '';
      }
      else {
        this.msg = 'Invalid Format. Only Images are allowed';
        return;
      }
    }
    // load image if there is a pasted image
    if (blob !== null) {
      const fileFromBlob: File = new File([blob], 'your-filename.jpg');
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        console.log('evt.target.result', evt.target.result); // data url!
        this.imageUploadedFromDeviceToBase64String = evt.target.result;
        this.imageTaken = true;
        this.msg = '';
      };
      reader.readAsDataURL(blob);
    }
    else {
      this.msg = 'No image is copied to the clipboard';
    }
  }

}