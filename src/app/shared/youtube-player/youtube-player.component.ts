import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import YouTubePlayer from 'youtube-player';
import { environment } from 'src/environments/environment';

const url = environment.localEndPoint;

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss'],
})
export class YoutubePlayerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() videoId: string;
  player: any;
  stopped = true;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.play();
  }

  play() {
    const playerVars = {
      autoplay: 1,
      controls: 0,
      autohide: 1,
      wmode: 'opaque',
      origin: url,
    };
    if (this.stopped) {
      if (this.player === undefined) {
        this.player = YouTubePlayer('divid');
      }
      this.player.loadVideoById(this.videoId, playerVars).then(() => {
        this.player.playVideo();
        this.stopped = false;
      });
    }
  }

  stop() {
    if (!this.stopped) {
      this.player.stopVideo().then(() => {
        this.stopped = true;
      });
    }
  }

  ngOnDestroy() {
    this.stop();
  }
}
