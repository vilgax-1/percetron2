import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { all, create } from 'mathjs';
import { combineLatest, Observable } from 'rxjs';
import * as _ from 'lodash';
import { ThisReceiver } from '@angular/compiler';
import { takeRightWhile, without } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: any;

  umbral = 0;
  tasa_de_aprendizaje = 0.1;
  form: FormGroup;
  
  coordinate = {
    x: 0,
    y: 0,
  };

  arrayCoordinates = new Array();
  w = new Array();
  ctx: any;

  ages = 0;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      coordinates: this.fb.array([
        { x: -175, y: -75, color: 1 },
        { x: 150, y: 95, color: 0 },
        { x: -133, y: -45, color: 1 },
        { x: 100, y: 105, color: 0 },
      ]),
    });
  }

  drawPath(): void {
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
    this.ctx.fillText('+x', 220, -10);
    this.ctx.fillText('-y', 10, 220);

    this.ctx.fillText('-x', -220, -10);
    this.ctx.fillText('+y', 10, -220);
  }

  ngAfterViewInit() {
    this.drawPath();
  }

  startTrain(): void{
    this.initPerceptron();
    this.calcularUmbral();
  }

  initPerceptron(){
    const math: any = create(all, {});
    _.forEach(this.form.get('coordinates')?.value as FormArray, (data, i) => {
      this.arrayCoordinates.push({x: data.x, y: data.y, color: data.color});
      this.addCoordinateColor(data.x, data.y, data.color );
    });

    for(var n=0; n < 2; n++){
      this.w.push(Math.random());
    }
    this.trainPerceptron(this.form.controls.coordinates?.value);
  }

  getSum(register: any): Number{
    let sum = 0;
    this.w.forEach((data, i) => sum += this.w[i] * register[ i === 0 ? 'x':'y']);    
    return sum;
  }

  trainPerceptron(data: Array<any>): void{
    this.ages = 0;
    while(true){
      let contador_de_errores = 0;
      for(let n=0; n < data.length; n++){
          let resultado = 0;
          let sum = this.getSum(data[n]);

          if(sum > this.umbral){
              resultado = 1;
          }
          
          var error = data[n].color - resultado;

          if (error !== 0){
              contador_de_errores += 1;
              for(let i=0; i < 2; i++){
                  this.w[i] += this.tasa_de_aprendizaje * error * data[n][ i == 0 ? 'x' : 'y'];
              }
          }
          
          this.ages+=1;
      }
      if (contador_de_errores === 0){
          break;
      }
    }  
  }

  calcularUmbral(): void {
    const math: any = create(all, {});
    const red = this.arrayCoordinates.filter(data => data.color === 1);
    const yellow = this.arrayCoordinates.filter(data => data.color === 0);

    let coordinateCloser = {
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

    yellow.forEach((yellow: any) => {
      red.forEach((red: any) => {
        const hipotenusa = math.evaluate(`sqrt(pow((${yellow.x}-${red.x}),2) + pow((${yellow.y} - ${red.y}) ,2))`);                
        if (coordinateCloser.value === 0 || hipotenusa < coordinateCloser.value) {
          coordinateCloser.value = hipotenusa;
          coordinateCloser.red.x = red.x;
          coordinateCloser.red.y = red.y;
          coordinateCloser.yellow.x = yellow.x;
          coordinateCloser.yellow.y = yellow.y;
        }
      });
    });
    this.umbral = +this.getSum({ x:((coordinateCloser.red.x + coordinateCloser.yellow.x) / 2), y:((coordinateCloser.red.y + coordinateCloser.yellow.y) / 2)});
    this.addLine({ x: coordinateCloser.red.x, y: coordinateCloser.red.y }, { x: coordinateCloser.yellow.x, y: coordinateCloser.yellow.y});
  }

  predic(data: any): number{
    let value = this.getSum(data);
    return (value > 0)? 1 : 0;
  }

  async addCoordinate(x: number, y: number){
    let color = this.predic({x: x, y: y});
    this.arrayCoordinates.push({x: x, y: y, color: color});
    await this.addCoordinateColor(x, y, color);
    this.calcularUmbral();
  }

  addCoordinateColor(x: number, y: number, color: number): void {
    this.ctx.fillStyle = color === 1 ? '#EF280F' : '#F9DC5C';
    this.ctx.fillRect(x, (y *= -1), 20, 20);
  }

  addLine(p1: any, p2: any): void {
    this.ctx.beginPath();
    this.ctx.moveTo(p2.x,(p1.y *= -1));
    this.ctx.lineTo(p1.x, (p2.y*=-1));
    this.ctx.stroke();
  }
}