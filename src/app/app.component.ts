import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest, fromEvent } from 'rxjs';
import { buffer } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('cartesianPlane') cartesian: any;
  @ViewChild('canvas') canvas: any;

  planeCtx: any;
  ctx: any;
  
  constructor(){}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.planeCtx = this.cartesian.nativeElement.getContext('2d');

    this.ctx.translate(750, 375);
    this.ctx.beginPath();
    this.ctx.moveTo(-275, 0);
    this.ctx.lineTo(275, 0);
    this.ctx.stroke();
    this.ctx.moveTo(0, -275);
    this.ctx.lineTo(0, 275);
    this.ctx.stroke();

    this.ctx.font = '2rem Arial';
    this.ctx.fillText('+ x', 275, -10);
    this.ctx.fillText('- y', 10, 275);

    this.ctx.fillText('- x', -275, -10);
    this.ctx.fillText('+ y', 10, -275);

    this.captureEventsOverCartesian(this.cartesian.nativeElement);
  }

  captureEventsOverCartesian(canvasEl: HTMLCanvasElement): void{
    const rect = canvasEl.getBoundingClientRect();
    const click$: any = fromEvent(canvasEl, 'click');

    click$.subscribe(_ => {
      console.log('click');      
    });

    let doubleClick = 
    click$.buffer((_: any) => click$.debounce(300))
    .map((clickWithIn300ms: any) => clickWithIn300ms.length)
    .filter((clickWithIn300ms: any) => )

      
    
    // this.addCoordinate((clickEvent.clientX - rect.left - 10), (clickEvent.clientY - rect.top - 10));
  }

  addCoordinate(x: number, y: number): void{
    this.planeCtx.fillStyle = '#F9DC5C';
    this.planeCtx.fillRect(x, y, 20, 20);
  }
}
