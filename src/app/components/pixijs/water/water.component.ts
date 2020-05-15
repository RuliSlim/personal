import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})
export class WaterComponent implements OnInit {
  public app: PIXI.Application;
  public image: PIXI.Sprite;
  public displacementSprite: PIXI.Sprite;
  public displacementFilter: any;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) { 
    this.ngZone.runOutsideAngular(() => {
      this.app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
      this.image = PIXI.Sprite.from('assets/ocean.jpg');
      this.image.width = window.innerWidth;
      this.image.height = window.innerHeight;

      this.image.anchor.set(0.5);
      this.image.x = window.innerWidth / 2;
      this.image.y = window.innerHeight / 2;
      this.app.stage.addChild(this.image);

      
      this.displacementSprite = PIXI.Sprite.from('assets/cloud.png');
      this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
      this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      this.app.stage.addChild(this.displacementSprite);
      this.app.stage.filters = [this.displacementFilter];
      
      this.app.renderer.view.style.transform = 'scale(1.02)';
      this.displacementFilter.scale.x = 4;
      this.displacementSprite.scale.y = 4;
      // this.animate();
      this.displacementSprite.x += 10;
      this.displacementSprite.y += 4;
      this.app.ticker.add((delta) => {
        requestAnimationFrame(() => {
          this.displacementSprite.x += 10;
          this.displacementSprite.y += 4;
        });
      });
    })
    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  ngOnInit(): void {
    
  }
}