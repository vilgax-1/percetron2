import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { all, create } from 'mathjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: any;

  coordinateCloser = {
    value: 0,
    red:{
      x: 0,
      y: 0
    },
    yellow: {
      x: 0,
      y: 0
    }
  }

  coordinateRed = {
    x: 0,
    y: 0
  }

  coordinateYellow = {
    x: 0,
    y: 0
  }

  red: any = [];
  yellow: any = [];
  ctx: any;
  constructor(){}


  drawPath(): void{
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.translate(250, 250);
    this.ctx.beginPath();
    this.ctx.moveTo(-230, 0);
    this.ctx.lineTo(230, 0);
    this.ctx.stroke();
    this.ctx.moveTo(0, -230);
    this.ctx.lineTo(0, 230);
    this.ctx.stroke();

    this.ctx.font = '2rem Arial';
    this.ctx.fillText('+ x', 220, -10);
    this.ctx.fillText('- y', 10, 220);

    this.ctx.fillText('- x', -220, -10);
    this.ctx.fillText('+ y', 10, -220);
  }

  ngAfterViewInit(): void {
    this.drawPath();
  }

  calculate(): void{
    const math: any = create(all, {});
    if(this.red && this.yellow){
      this.red.forEach((red: any) => {
        this.yellow.forEach((yellow: any) => {
          const hipotenusa = math.evaluate(`sqrt(pow((${yellow.x}-${red.x}),2) + pow((${yellow.y} - ${red.y}) ,2))`);
          if(this.coordinateCloser.value === 0 || hipotenusa < this.coordinateCloser.value){
            this.coordinateCloser.value = hipotenusa;
            this.coordinateCloser.red.x = red.x;
            this.coordinateCloser.red.y = red.y;
            this.coordinateCloser.yellow.x = yellow.x;
            this.coordinateCloser.yellow.y = yellow.y;
          }
        });
      });
      this.addLine(this.coordinateCloser.red, this.coordinateCloser.yellow);
    }
  }

  addLine(p1: any, p2: any): void{
    this.ctx.moveTo(p2.x, p1.y);
    this.ctx.lineTo(p1.x, p2.y);
    this.ctx.stroke();    
    this.ctx.strokeStyle = "#FF0000";
  }

  addCoordinate(x: number, y: number, color: string, type: Array<{}>): void{    
    type.push({x:x, y: y *= -1 });
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 20, 20);
  }
}
