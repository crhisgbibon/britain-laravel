'use strict';

class Vector
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}

let cities = [
  ['london', 51, 0],
  ['edinburgh', 56, -3],
];

const C = document.getElementById('c');
const CANVAS = C.getContext('2d');
const CW = 883;
const CH = 1425;

let width = window.innerWidth * 0.95;
let height = window.innerHeight * 0.95;

let w = 883;
let h = 1425;
let scale = 1;
let fit = 1;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let startPos = new Vector();
let endPos = new Vector();
let geo = new Vector();

const I = document.createElement('img');
I.onload = function () {
  Draw();
}
I.src = 'ukCropped.svg';

window.onkeydown = function(event)
{
  if(event.key === '=' || event.key === '+')
  {
    if(scale > 0.1)
    {
      scale -= 0.1;
      scale = Math.round(scale * 100) / 100;
    }
  }

  if(event.key === '-' || event.key === '_')
  {
    if(scale < 10)
    {
      scale += 0.1;
      scale = Math.round(scale * 100) / 100;
    }
  }

  if(event.key === ' ')
  {
    ResetView();
  }
  console.log(scale);
  Draw();
}

window.onwheel = function(event)
{
  if(event.deltaY > 0)
  {
    if(scale > 1)
    {
      scale -= 0.1;
      scale = Math.round(scale * 100) / 100;
      // offsetX += (55 / scale);
      // offsetY += (45 / scale);
    }
  }
  if(event.deltaY < 0)
  {
    if(scale < 10)
    {
      scale += 0.1;
      scale = Math.round(scale * 100) / 100;
      // offsetX -= (55 / scale);
      // offsetY -= (45 / scale);
    }
  }
  Draw();
}

window.onmousedown = function(event)
{
  event.preventDefault();
  let rect = C.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  startPos.x = x;
  startPos.y = y;
  dragging = true;

  Draw();

  console.log(startPos);

  Geo(startPos);
}

window.onmousemove = function(event)
{
  event.preventDefault();
  if(!dragging) return;
  let rect = C.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  endPos.x = x;
  endPos.y = y;
  Drag();
  startPos.x = x;
  startPos.y = y;
  Draw();
}

window.onmouseup = function(event)
{
  event.preventDefault();
  let rect = C.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  endPos.x = x;
  endPos.y = y;
  Drag();
  dragging = false;
  Draw();
}

function Drag()
{
  let changeX = endPos.x - startPos.x;
  let changeY = endPos.y - startPos.y;

  offsetX += (changeX / scale);
  offsetY += (changeY / scale);
}

function ResetView()
{
  offsetX = 0;
  offsetY = 0;
  scale = 1;
}

function Draw()
{
  width = window.innerWidth * 0.95;
  height = window.innerHeight * 0.95;

  let ph = ( 100 / CH ) * height;
  let pw = ( 100 / CW ) * width;
  // console.log('height % is ' + ph, 'width % is ' + pw);

  if(ph < pw)
  {
    fit = ph / 100;
  }
  else
  {
    fit = pw / 100;
  }

  // console.log('ch is ' + CH);
  // console.log('cw is ' + CW);
  // console.log('height is ' + height);
  // console.log('width is ' + width);
  // console.log('h is ' + h);
  // console.log('w is ' + w);
  // console.log('scale is ' + scale);

  C.width = w * fit;
  C.height = h * fit;
  CANVAS.clearRect(0, 0, w, h);
  CANVAS.drawImage(I, 0, 0, w, h, 0 + offsetX, 0 + offsetY, w * fit * scale, h * fit * scale);

  FillCities();
}

window.addEventListener('resize', Draw);
window.addEventListener('orientationchange', Draw);

function Geo(pos)
{
  // -10 -> 2 left -> right = 12 range

  // 48 -> 61 bottom -> top = 13 range

  let startX = pos.x;
  let startY = pos.y;

  let pX = ( 100 / C.width ) * startX;
  let pY = ( 100 / C.height ) * startY;

  console.log(pX, pY);

  let rangeX = ( 12 / 100 ) * pX;
  let rangeY = ( 13 / 100) * pY;

  let geoX = -10 + rangeX;
  let geoY = 61 - rangeY;

  console.log(geoX, geoY);

  geo.x = geoX;
  geo.y = geoY;
  console.log(geo);
}

function FillCities()
{
  for(let i = 0; i < cities.length; i++)
  {
    let name = cities[i][0];
    let lat = cities[i][1];
    let long = cities[i][2];

    console.log(name, long, lat);

    let vec = LongLatToPixel(long, lat);

    console.log(vec);

    CANVAS.beginPath();
    CANVAS.rect(vec.x, vec.y, 5, 5);
    CANVAS.stroke();
  }
}

function LongLatToPixel(long, lat)
{
  console.log(long, lat);

  let geoX = 10 + long;
  let geoY = 61 - lat;

  console.log(geoX, geoY);

  let pX = ( 100 / 12 ) * geoX;
  let pY = ( 100 / 13 ) * geoY;

  console.log(pX, pY);

  let x = ( C.width / 100 ) * pX;
  let y = ( C.height / 100 ) * pY;

  console.log(x, y);

  return new Vector(x, y);
}