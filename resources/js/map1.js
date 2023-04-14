'use strict';

class Vector
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}

const C = document.getElementById('c');
const CANVAS = C.getContext('2d');
const CH = 1250;
const CW = 800;

let width = window.innerWidth;
let height = window.innerHeight;

let w = 800;
let h = 1250;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let startPos = new Vector();
let endPos = new Vector();

const I = document.createElement('img');
I.onload = function () {
  Draw();
}
I.src = 'uk.svg';

document.onkeydown = function(event)
{
  if(event.key === '=' || event.key === '+')
  {
    if(scale > 0.05)
    {
      scale -= 0.05;
      scale = Math.round(scale * 100) / 100;
    }
  }

  if(event.key === '-' || event.key === '_')
  {
    if(scale < 10)
    {
      scale += 0.05;
      scale = Math.round(scale * 100) / 100;
    }
  }
  console.log(scale);
  Draw();
}

document.onwheel = function(event)
{
  if(event.deltaY > 0)
  {
    if(scale > 0)
    {
      scale -= 0.05;
      scale = Math.round(scale * 100) / 100;
      offsetX += (55 / scale);
      offsetY += (45 / scale);
    }
  }
  if(event.deltaY < 0)
  {
    if(scale < 10)
    {
      scale += 0.05;
      scale = Math.round(scale * 100) / 100;
      offsetX -= (55 / scale);
      offsetY -= (45 / scale);
    }
  }
  console.log(scale);
  console.log(offsetX);
  console.log(offsetY);
  Draw();
}

C.onmousedown = function(event)
{
  event.preventDefault();
  let rect = C.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  startPos.x = x;
  startPos.y = y;
  dragging = true;

  console.log(startPos);
  console.log(dragging);
  Draw();
}

C.onmousemove = function(event)
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

C.onmouseup = function(event)
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
  let ph = ( 100 / CH ) * height;
  let pw = ( 100 / CW ) * width;
  console.log('height % is ' + ph, 'width % is ' + pw);

  if(ph < pw)
  {
    scale = ph / 100;
  }
  else
  {
    scale = pw / 100;
  }

  console.log('ch is ' + CH);
  console.log('cw is ' + CW);
  console.log('height is ' + height);
  console.log('width is ' + width);
  console.log('h is ' + h);
  console.log('w is ' + w);
  console.log('scale is ' + scale);

  C.width = CW;
  C.height = CH;
  CANVAS.clearRect(0, 0, w, h);
  CANVAS.drawImage(I, 0, 0, w, h, 0, 0, w * scale, h * scale);
}