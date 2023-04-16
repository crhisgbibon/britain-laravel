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
const LOCATION = document.getElementById('location');
const C = document.getElementById('c');
const CANVAS = C.getContext('2d');
const CW = 1010.33;
const CH = 927.15;

let width = window.innerWidth,
    height = window.innerHeight,
    vh = 0.975,
    buffer = 1,
    bufferX = 50,
    bufferY = 50,
    lat, // n-s
    long, // e-w
    latLines = 142.118483,
    longLines = 359.5981466,
    lat0 = 83.63001,
    long0 = 169.1110266,
    x0 = 0,
    y0 = 0,
    levelCount = 50,
    zoom = 1,
    minZoom = 1,
    maxZoom = levelCount,
    fit = 1,
    offsetX = 0,
    offsetY = 0,
    dragging = false,
    start = new Vector(0, 0),
    end   = new Vector(0, 0),
    geo   = new Vector(0, 0),
    map   = new Vector(0, 0);


let levels = [];
for(let i = 0; i < levelCount; i++)
{
  let n = i + 1;
  let l = [CW / n, CH / n]; // long, lat
  levels.push(l);
}

const I = document.createElement('img');
I.onload = function () {
  Draw(false, false);
}
I.src = 'worldHigh.svg';

window.onkeydown = function(event)
{
  if(event.key === 'g')
  {
    // console.log('zoom is ' + zoom);
    console.log('mapX is ' + map.x);
    console.log('mapY is ' + map.y);
    // console.log('geoX is ' + geo.x);
    // console.log('geoY is ' + geo.y);
    // console.log('levelX is ' + levels[zoom][0] / 2);
    // console.log('levelY is ' + levels[zoom][1] / 2);
    console.log('offsetX is ' + offsetX);
    console.log('offsetY is ' + offsetY);
    console.log('calc offsetX is ' + (map.x - levels[zoom][1]/2));
    console.log('calc offsetY is ' + (map.y - levels[zoom][0]/2));
    return;
  }

  let out = true;
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
      out = false;
    }
  }

  if(event.key === ' ')
  {
    ResetView();
  }
  Draw(true, out);
}

window.onwheel = function(event)
{
  let out = true;
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
      out = false;
    }
  }
  Draw(true, out);
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

  Draw(false, false);
}

window.onmousemove = function(event)
{
  event.preventDefault();

  let rect = C.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  GetLocation(x, y);
  map.x = x/zoom - bufferX + offsetX;
  map.y = y/zoom - bufferY + offsetY;
  // console.log(x, y);
  if(!dragging) return;

  end.x = x;
  end.y = y;
  Drag();
  start.x = x;
  start.y = y;
  Draw(false, false);
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
  Draw(false, false);
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

function Draw(zoomed, out)
{
  width = window.innerWidth * buffer;
  height = (window.innerHeight * vh) * buffer;

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

  if(offsetX < -bufferX) offsetX = -bufferX;
  // if(offsetX > (150 * zoom)) offsetX = (150 * zoom);

  if(offsetY < -bufferY) offsetY = -bufferY;
  // if(offsetY > (150 * zoom)) offsetY = (150 * zoom);

  if(zoomed)
  {
    // console.log(out);
    // console.log(geo);
    // console.log(zoom);
    // console.log(offsetX);
    // console.log(offsetY);
    if(out) // if zooming out, i.e. reducing zoom
    {
    }
    else
    {
      // map distance between 0 point after scroll and target
      // offsetX = map.x / zoom;
      // offsetY = map.y / zoom;
    }
  }

  CANVAS.clearRect(0, 0, CW, CH);
  CANVAS.drawImage(I, ( 0 + offsetX ) , ( 0 + offsetY ), ( CW / zoom ), ( CH / zoom ), 0, 0, CW, CH);

  CANVAS.strokeStyle = 'black';
  CANVAS.beginPath();
  CANVAS.moveTo((CW/2), (0));
  CANVAS.lineTo((CW/2), (CH));
  CANVAS.stroke();
  CANVAS.moveTo((0), (CH/2));
  CANVAS.lineTo((CW), (CH/2));
  CANVAS.stroke();

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

  let arcsize = zoom;
  let textsize = zoom;
  if(arcsize < 3) arcsize = 3;
  if(arcsize > 15) arcsize = 15;
  if(textsize < 8) textsize = 8;
  if(textsize > 24) textsize = 24;

  CANVAS.fillStyle = 'rgb(50,50,50)';
  CANVAS.font = textsize + "px Arial";
  CANVAS.textAlign = "start";
  CANVAS.textBaseline = 'middle';
  for(let i = 0; i < cities.length; i++)
  {
    let name = cities[i][0];
    let y = cities[i][1];
    let x = cities[i][2];

    let pos = MapPos(y, x);

    let xPos = ((pos.x - offsetX) * zoom) - 2.5;
    let yPos = ((pos.y - offsetY) * zoom) - 2.5;

    // console.log(name + ',' + xPos + ',' + yPos);

    CANVAS.beginPath();
    CANVAS.arc(xPos, yPos, arcsize, 0, 2 * Math.PI);
    CANVAS.fill();
    CANVAS.fillText(name, xPos + ( arcsize ), yPos);
  }
}

function MapPos(latitude, longitude)
{
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

function GetLocation(x, y)
{
  x = (x/zoom + offsetX);
  y = (y/zoom + offsetY);

  y = CH - y;
  let latitude  = 0; // (φ)
  let longitude = 0; // (λ)

  let mapWidth  = CW;
  let mapHeight = CH;

  longitude = ( x / ( mapWidth / longLines ) ) - long0;
  if(longitude < -long0) longitude = -long0;
  if(longitude > (longLines-long0)) longitude = (longLines-long0);
  // console.log('longitude is ' + longitude);

  let mercN = ( 2 * Math.PI ) * ( mapHeight / 2 - y ) / mapWidth;
  let latRad = 2 * ( Math.atan(Math.exp(mercN)) - ( Math.PI / 4 ) );
  latitude = latRad * 180 / Math.PI;
  latitude = -latitude;
  if(latitude < -90) latitude = -90;
  if(latitude > 90) latitude = 90;
  // console.log('latitude is ' + latitude);

  geo.x = longitude;
  geo.y = latitude;

  LOCATION.innerHTML = latitude.toFixed(5) + ' , ' + longitude.toFixed(5) + ', ' + zoom + 'x';

  return new Vector(latitude, longitude);
}

window.addEventListener('resize', Draw);
window.addEventListener('orientationchange', Draw);