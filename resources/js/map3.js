'use strict';

class Vector
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}
// 52.14796097531532, -10.477826616187714
let baseX = -10.477826616187714;
// 60.86064719846991, -0.8740738034888755
let baseY = 60.86064719846991;
// 52.4812598013847, 1.7629939424516798
let topX = 1.7629939424516798;
// 49.16248885762907, -2.0730199712002615
let topY = 49.16248885762907;

let xRange = Math.abs(baseX) + topX;
let yRange = baseY - topY;
yRange = 11;

console.log('ranges are ' + xRange, yRange);

let cities = [
  ['haroldswick', 60.80678075284218, -0.8137147579227069],
  ['london', 51.50709385319816, -0.1277055175679454],
  ['edinburgh', 55.95331925239274, -3.1883990781292946],
  ['birmingham', 52.48617259045626, -1.8912674761599197],
  ['belfast', 54.59756154069731, -5.930240420051534],
  ['cardiff', 51.484475928272424, -3.1681565093371336],
  ['manchester', 53.48093090697318, -2.242554111967525],
];

const C = document.getElementById('c');
const CANVAS = C.getContext('2d');
const CW = 839;
const CH = 1401;

let width = window.innerWidth * 0.95;
let height = window.innerHeight * 0.95;

let w = 839;
let h = 1401;
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
  console.log(I.width, I.height);
}
I.src = 'ukCropped2.svg';

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
  let startX = pos.x;
  let startY = pos.y;

  let pX = ( 100 / C.width ) * startX;
  let pY = ( 100 / C.height ) * startY;

  console.log(pX, pY);

  let rangeX = ( xRange / 100 ) * pX;
  let rangeY = ( yRange / 100) * pY;

  let geoX = baseX + rangeX;
  let geoY = baseY - rangeY;

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
    CANVAS.rect(vec.x - 2.5, vec.y - 2.5, 5, 5);
    CANVAS.stroke();
  }
}

function LongLatToPixel(long, lat)
{
  console.log('long/lat is ' + long, lat);

  let geoX = (long + Math.abs(baseX));
  let geoY = baseY - lat;

  console.log('geo is ' + geoX, geoY);

  let pX = ( 100 / xRange ) * geoX;
  let pY = ( 100 / yRange ) * geoY;

  console.log('percent is ' + pX, pY);

  let x = ( C.width / 100 ) * pX;
  let y = ( C.height / 100 ) * pY;

  console.log('draw on ' + x, y);

  return new Vector(x, y);
}