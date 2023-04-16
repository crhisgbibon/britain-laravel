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
  ['Haroldswick', 60.80678075284218, -0.8137147579227069],
  ['London', 51.50709385319816, -0.1277055175679454],
  ['Edinburgh', 55.95331925239274, -3.1883990781292946],
  ['Birmingham', 52.48617259045626, -1.8912674761599197],
  ['Belfast', 54.59756154069731, -5.930240420051534],
  ['Cardiff', 51.484475928272424, -3.1681565093371336],
  ['Manchester', 53.48093090697318, -2.242554111967525],

  ['New York', 40.74625829295725, -73.98744527835743],
  ['Tokyo', 35.687753008810226, 139.76905441341196],
  ['Dubai', 25.205837277804697, 55.26932364870619],
  ['Moscow', 55.756154869950535, 37.61838366573543],
  ['Buenos Aires', -34.607169168874876, -58.40158194759254],
  ['Lagos', 6.522671798623798, 3.3760591499526367],
  ['Perth', -31.951846995538265, 115.86062447268115],
  ['Athens', 37.98744832005829, 23.722448660699868],

  ['Kabul',34.575503,69.240073],
  ['Canberra',-35.282,149.128684],
  ['Brussels',50.85034,4.35171],
  ['Phnom Penh',11.544873,104.892167],
  ['Beijing',39.904211,116.407395],

  ['Bogotá',4.710989,-74.072092],
  ['Zagreb' ,45.815011,15.981919],
  ['Havana',23.05407,-82.345189],
  ['Prague',50.075538,14.4378],
  ['Copenhagen',55.676097,12.568337],

  ['Cairo',30.04442,31.235712],
  ['Tórshavn',62.007864,-6.790982],
  ['Paris',48.856614,2.352222],
  ['Berlin',52.520007,13.404954],
  ['Port-au-Prince',18.594395,-72.307433],

  ['Hong Kong',22.396428,114.109497],
  ['Budapest',47.497912,19.040235],
  ['Reykjavík',64.126521,-21.817439],
  ['New Delhi',28.613939,77.209021],
  ['Jakarta',-6.208763,106.845599],

  ['Tehran',35.689198,51.388974],
  ['Baghdad',33.312806,44.361488],
  ['Dublin',53.349805,-6.26031],
  ['Tel Aviv',32.0853,34.781768],
  ['Rome',41.902784,12.496366],

  ['Kuala Lumpur',3.139003,101.686855],
  ['Mexico City',19.432608,-99.133208],
  ['Monaco',43.737411,7.420816],
  ['Islamabad',33.729388,73.093146],
  ['Manila',14.599512,120.98422],
  ['Equator', 0.005222159273959539, 35.561303792390156],
];

const CONTAINER = document.getElementById('container');
const C = document.getElementById('c');
const CANVAS = C.getContext('2d');
const CW = 1010.33;
const CH = 927.15;

let levels = [
  [ CW, CH ],
  [ CW / 2, CH / 2 ],
  [ CW / 3, CH / 3 ],
  [ CW / 4, CH / 4 ],
  [ CW / 5, CH / 5 ],
  [ CW / 6, CH / 6 ],
  [ CW / 7, CH / 7 ],
  [ CW / 8, CH / 8 ],
  [ CW / 9, CH / 9 ],
  [ CW / 10, CH / 10 ],
  [ CW / 11, CH / 11 ],
  [ CW / 12, CH / 12 ],
  [ CW / 13, CH / 13 ],
  [ CW / 14, CH / 14 ],
  [ CW / 15, CH / 15 ],
  [ CW / 16, CH / 16 ],
  [ CW / 17, CH / 17 ],
  [ CW / 18, CH / 18 ],
  [ CW / 19, CH / 19 ],
  [ CW / 20, CH / 20 ],
];

let width = window.innerWidth,
    height = window.innerHeight,
    buffer = 1,
    lat, // n-s
    long, // e-w
    latLines = 142.118483,
    longLines = 359.5981466,
    lat0 = 83.63001,
    long0 = 169.1110266,
    x0 = 0,
    y0 = 0,
    north,
    south,
    east,
    west,
    zoom = 1,
    minZoom = 1,
    maxZoom = 20,
    fit = 1,
    offsetX = 0,
    offsetY = 0,
    dragging = false,
    start = new Vector(0, 0),
    end = new Vector(0, 0),
    geo = new Vector(0, 0);

const I = document.createElement('img');
I.onload = function () {
  Draw();
}
I.src = 'worldHigh.svg';

window.onkeydown = function(event)
{
  if(event.key === '=' || event.key === '+')
  {
    if(zoom > minZoom)
    {
      zoom--;
    }
  }

  if(event.key === '-' || event.key === '_')
  {
    if(zoom < maxZoom)
    {
      zoom++;
    }
  }

  if(event.key === ' ')
  {
    ResetView();
  }
  Draw();
}

window.onwheel = function(event)
{
  if(event.deltaY > 0)
  {
    if(zoom > minZoom)
    {
      zoom--;
    }
  }
  if(event.deltaY < 0)
  {
    if(zoom < maxZoom)
    {
      zoom++;
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

  start.x = x;
  start.y = y;
  dragging = true;

  Draw();
}

window.onmousemove = function(event)
{
  event.preventDefault();

  let rect = C.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  geo.x = x;
  geo.y = y;
  console.log('geo is ' + geo.x + ', ' + geo.y);
  GetLocation(geo.x, geo.y);

  if(!dragging) return;

  end.x = x;
  end.y = y;
  Drag();
  start.x = x;
  start.y = y;
  Draw();
}

function GetLocation(x, y)
{
  // x = x - offsetX;
  // y = y - offsetY;
  let latitude  = 0; // (φ)
  let longitude = 0; // (λ)

  let mapWidth  = CW;
  let mapHeight = CH;

  // get longitude value
  // let x = ( longitude + long0 ) * ( mapWidth / longLines );
  longitude = ( x / ( mapWidth / longLines ) ) - long0;
  if(longitude < -long0) longitude = -long0;
  if(longitude > (longLines-long0)) longitude = (longLines-long0);
  console.log('longitude is ' + longitude);

  let mercN = ( ( mapHeight / 2 ) * ( 2 * Math.PI ) ) / mapWidth;

  


  // convert from degrees to radians
  // let latRad = latitude * Math.PI / 180;

  // // get y value
  // let mercN = Math.log( Math.tan( ( Math.PI / 4 ) + ( latRad / 2 ) ) );
  // let y = ( mapHeight / 2 ) - ( mapWidth * mercN / ( 2 * Math.PI ) );
  
  // return {x: x, y: y};
  // let north = offsetY;
  // let south = offsetY + levels[zoom - 1][1];
  // let east = offsetX;
  // let west = offsetX + levels[zoom - 1][0];

  // console.log('north is ' + north);
  // console.log('south is ' + south);
  // console.log('east is ' + east);
  // console.log('west is ' + west);
}

window.onmouseup = function(event)
{
  event.preventDefault();
  let rect = C.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  end.x = x;
  end.y = y;
  Drag();
  dragging = false;
  Draw();
}

function Drag()
{
  let changeX = end.x - start.x;
  let changeY = end.y - start.y;

  offsetX -= (changeX / zoom);
  offsetY -= (changeY / zoom);
}

function ResetView()
{
  offsetX = 0;
  offsetY = 0;
  zoom = 1;
}

function Draw()
{
  width = window.innerWidth * buffer;
  height = window.innerHeight * buffer;

  lat = CH / latLines;
  long = CW / longLines;

  x0 = long * long0;
  y0 = lat * lat0;

  C.width = CW;
  C.height = CH;

  CONTAINER.style.width = width + 'px';
  CONTAINER.style.height = height + 'px';

  // if(CW < width) CONTAINER.style.width = CW + 'px';
  // else CONTAINER.style.width = width + 'px';
  // if(CH < height) CONTAINER.style.height = CH + 'px';
  // else CONTAINER.style.height = height + 'px';

  let ph = ( 100 / CH ) * height;
  let pw = ( 100 / CW ) * width;

  if(ph < pw)
  {
    fit = ph / 100;
    height = ( CH * fit );
    width = ( CW * fit );
  }
  else
  {
    fit = pw / 100;
    height = ( CH * fit );
    width = ( CW * fit );
  }

  if(offsetX < -50) offsetX = -50;
  // if(offsetX > (150 * zoom)) offsetX = (150 * zoom);

  if(offsetY < -50) offsetY = -50;
  // if(offsetY > (150 * zoom)) offsetY = (150 * zoom);

  CANVAS.clearRect(0, 0, CW, CH);
  CANVAS.drawImage(I, ( 0 + offsetX ) , ( 0 + offsetY ), ( CW / zoom ), ( CH / zoom ), 0, 0, CW, CH);

  // CANVAS.strokeStyle = 'black';
  // CANVAS.beginPath();
  // CANVAS.moveTo((CW/2 - offsetX)*zoom, (0 - offsetY)*zoom);
  // CANVAS.lineTo((CW/2 - offsetX)*zoom, (CH - offsetY)*zoom);
  // CANVAS.stroke();
  // CANVAS.moveTo((0 - offsetX)*zoom, (CH/2 - offsetY)*zoom);
  // CANVAS.lineTo((CW - offsetX)*zoom, (CH/2 - offsetY)*zoom);
  // CANVAS.stroke();

  // CANVAS.strokeStyle = 'rgba(150,0,0,0.05)';
  // for(let i = 0; i < latLines + 1; i++)
  // {
  //   CANVAS.beginPath();
  //   CANVAS.moveTo(0 - offsetX, (i * lat - offsetY)*zoom);
  //   CANVAS.lineTo((C.width - offsetX)*zoom, (i * lat - offsetY)*zoom);
  //   CANVAS.stroke();
  // }

  // for(let i = 0; i < longLines + 1; i++)
  // {
  //   CANVAS.beginPath();
  //   CANVAS.moveTo((i * long - offsetX)*zoom, 0 - offsetY);
  //   CANVAS.lineTo((i * long - offsetX)*zoom, (C.height - offsetY)*zoom);
  //   CANVAS.stroke();
  // }

  // CANVAS.fillStyle = 'red';
  // // let pos0 = MapPos(0, 0);
  // CANVAS.fillRect(((pos0.x-offsetX)*zoom)-2.5, ((pos0.y-offsetY)*zoom)-2.5, 5, 5);

  CANVAS.fillStyle = 'black';
  for(let i = 0; i < cities.length; i++)
  {
    let name = cities[i][0];
    let y = cities[i][1];
    let x = cities[i][2];

    let pos = MapPos(y, x);

    let xPos = ((pos.x - offsetX) * zoom) - 2.5;
    let yPos = ((pos.y - offsetY) * zoom) - 2.5;

    // console.log(name + ',' + xPos + ',' + yPos);

    CANVAS.fillRect(xPos, yPos, 5, 5);
    CANVAS.fillText(name, xPos, yPos);
  }
}

function MapPos(latitude, longitude)
{
  // latitude  = 41.145556; // (φ)
  // longitude = -73.995;   // (λ)

  let mapWidth  = CW;
  let mapHeight = CH;

  // get x value
  let x = ( longitude + long0 ) * ( mapWidth / longLines );

  // convert from degrees to radians
  let latRad = latitude * Math.PI / 180;

  // get y value
  let mercN = Math.log( Math.tan( ( Math.PI / 4 ) + ( latRad / 2 ) ) );
  let y = ( mapHeight / 2 ) - ( mapWidth * mercN / ( 2 * Math.PI ) );
  
  return {x: x, y: y};
}

window.addEventListener('resize', Draw);
window.addEventListener('orientationchange', Draw);