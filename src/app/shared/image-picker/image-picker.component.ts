import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: false })
  filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage: string;
  usePicker = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
  }

  toggleCamera() {
    this.usePicker = !this.usePicker;
  }

  onPickImage() {
    // if (!this.camera) {
    //   this.filePickerRef.nativeElement.click();
    //   return;
    // }

    Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      saveToGallery: true,
      preserveAspectRatio: true,
      width: 300,
      promptLabelHeader: 'Use Camera for Malamino photo?',
    }).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        //let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log({ imageData });
        this.selectedImage = imageData.dataUrl;
        this.imagePick.emit(imageData.dataUrl);
        this.showPreview = true;
      },
      (err) => {
        // Handle error
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      }
    );

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    //var imageUrl = image.webPath;

    // Can be set to the src of an image now
    //imageElement.src = imageUrl;

    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.PNG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   saveToPhotoAlbum: true,
    // };

    // this.camera.getPicture(options).then(
    //   (imageData) => {
    //     // imageData is either a base64 encoded string or a file URI
    //     // If it's base64 (DATA_URL):
    //     //let base64Image = 'data:image/jpeg;base64,' + imageData;
    //     console.log({ imageData });
    //     this.selectedImage = imageData.dataUrl;
    //     this.imagePick.emit(imageData.dataUrl);
    //     this.showPreview = true;
    //   },
    //   (err) => {
    //     // Handle error
    //     if (this.usePicker) {
    //       this.filePickerRef.nativeElement.click();
    //     }
    //     return false;
    //   }
    // );

    // Plugins.Camera.getPhoto({
    //   quality: 80,
    //   allowEditing: true,
    //   source: CameraSource.Prompt,
    //   correctOrientation: true,
    //   width: 300,
    //   resultType: CameraResultType.DataUrl,
    // })
    //   .then((image) => {
    //     this.selectedImage = image.dataUrl;
    //     this.imagePick.emit(image.dataUrl);
    //     this.showPreview = true;
    //   })
    //   .catch((error) => {
    //     if (this.usePicker) {
    //       this.filePickerRef.nativeElement.click();
    //     }
    //     return false;
    //   });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    const pickedFiles = (event.target as HTMLInputElement).files;

    if (!pickedFile || pickedFiles.length < 1) {
      return;
    }

    Array.from(pickedFiles).forEach((pkFile) => {
      const fr = new FileReader();
      fr.onload = () => {
        const dataUrl = fr.result.toString();
        this.selectedImage = dataUrl;

        this.imagePick.emit(pkFile);
      };
      fr.readAsDataURL(pkFile);
    });
  }
}
