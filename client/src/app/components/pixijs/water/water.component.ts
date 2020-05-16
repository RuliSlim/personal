import { Component, ElementRef, NgZone } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})
export class WaterComponent {
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
      this.app.stage.addChild(this.image);

      this.displacementSprite = PIXI.Sprite.from('assets/cloud.png');
      this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
      this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      this.app.stage.addChild(this.displacementSprite);
      this.app.stage.filters = [this.displacementFilter];
      
      this.app.renderer.view.style.transform = 'scale(1)';
      this.displacementSprite.scale.x = 8;
      this.displacementSprite.scale.y = 8;

      this.app.stage.interactive = true;
      
      this.app.ticker.add((delta) => {
        requestAnimationFrame(() => {
          // setTimeout(() => {
          //   this.app.stage.on('pointermove', this.animate);
          // }, 500)
          this.displacementSprite.x += 2;
          this.displacementSprite.y += 4;
        })
      });

      const trailTexture = PIXI.Texture.from('examples/assets/trail.png');
      const historyX = [];
      const historyY = [];
      // historySize determines how long the trail will be.
      const historySize = 20;
      // ropeSize determines how smooth the trail will be.
      const ropeSize = 100;
      const points = [];

      // Create history array.
      for (let i = 0; i < historySize; i++) {
          historyX.push(0);
          historyY.push(0);
      }
      // Create rope points.
      for (let i = 0; i < ropeSize; i++) {
          points.push(new PIXI.Point(0, 0));
      }

      // Create the rope
      const rope = new PIXI.SimpleRope(trailTexture, points);

      // Set the blendmode
      rope.blendMode = PIXI.BLEND_MODES.ADD;

      this.app.stage.addChild(rope);

      // Listen for animate update
      this.app.ticker.add((delta) => {
          // Read mouse points, this could be done also in mousemove/touchmove update. For simplicity it is done here for now.
          // When implementing this properly, make sure to implement touchmove as interaction plugins mouse might not update on certain devices.
          const mouseposition = this.app.renderer.plugins.interaction.mouse.global;

          // Update the mouse values to history
          historyX.pop();
          historyX.unshift(mouseposition.x);
          historyY.pop();
          historyY.unshift(mouseposition.y);
          // Update the points to correspond with history.
          for (let i = 0; i < ropeSize; i++) {
              const p = points[i];

              // Smooth the curve with cubic interpolation to prevent sharp edges.
              const ix = this.cubicInterpolation(historyX, i / ropeSize * historySize);
              const iy = this.cubicInterpolation(historyY, i / ropeSize * historySize);

              p.x = ix;
              p.y = iy;
          }
      });

      
    })
    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  animate = (e) => {
    this.displacementSprite.x += 15;
    this.displacementSprite.y += 8;
  }
  /**
   * Cubic interpolation based on https://github.com/osuushi/Smooth.js
   */
  clipInput = (k, arr) => {
      if (k < 0) k = 0;
      if (k > arr.length - 1) k = arr.length - 1;
      return arr[k];
  }
  
  getTangent = (k, factor, array) => {
      return factor * (this.clipInput(k + 1, array) - this.clipInput(k - 1, array)) / 2;
  }
  
  cubicInterpolation = (array, t, tangentFactor?) => {
      if (tangentFactor == null) tangentFactor = 1;
  
      const k = Math.floor(t);
      const m = [this.getTangent(k, tangentFactor, array), this.getTangent(k + 1, tangentFactor, array)];
      const p = [this.clipInput(k, array), this.clipInput(k + 1, array)];
      t -= k;
      const t2 = t * t;
      const t3 = t * t2;
      return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
  }
}