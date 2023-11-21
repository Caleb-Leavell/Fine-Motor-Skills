class button {
  constructor(x, y, w, h, text, color, hoverColor, scene, newScene, r) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = r || 0;
    this.text = text;
    this.color = color;
    this.hoverColor = hoverColor;
    this.scene = scene;
    this.newScene = newScene;
    this.cooldown = 0;
    this.pressed = false;
  }
  create() {
      fill(this.isOver());
      noStroke();
      rect(this.x, this.y, this.w, this.h, this.r);
      fill(255);
      stroke(255);
      strokeWeight(1);
      let size = this.h/2 - this.text.length;
      if(size * this.text.length * 0.7 > this.w) {
        size = this.w / (this.text.length * 0.7);
      }
      textSize(size);
      textAlign(CENTER, CENTER);
      textStyle(NORMAL);
      text(this.text, (this.x * 2 + this.w ) / 2, this.y + this.h / 2);
  }
  isOver() {
    if(touches.length < 1) {
      return this.color;
    }
    if(touches[0].x > this.x && touches[0].x  < this.x + this.w && 
       touches[0].y  > this.y && touches[0].y  < this.y + this.h) 
    {
       this.pressed = true;
       return this.hoverColor;
    }
    else {
      this.pressed = false;
      return this.color;
    }
  }
  isPressed() {
    if(touches.length < 1 && this.pressed) {
        this.pressed = false;
        scene = this.newScene;
        return true;
    }
  }
  
  
}