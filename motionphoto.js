(function(){
var vid=document.createElement("video"), i=0, b;
  vid.style = 'height:100vh; object-fit:scale-down; scroll-snap-align:start'
  vid.controls=true;
  if ('mediaSession' in navigator) navigator.mediaSession.setActionHandler('nexttrack', vid.onended);  //>5sec

(document.querySelector('#files')||document.body).addEventListener('click', function(){
 b=[...document.querySelectorAll('#files img')]  //'a[href*=".mp4"]' '#files a'
 if(!b.includes(event.target)) return
 event.preventDefault()
 let img=event.target
 if(img.src) {let v=document.createElement("video"); v.loop=v.muted=v.autoplay=v.playsinline=true; v.width=img.width;v.height=img.height; v.poster=img.src;imgtoblob(img.src).then(blob => {v.src=blob;img.parentNode.insertBefore(v,img);img.parentNode.removeChild(img)});
  v.currentTime=1; v.onclick= () => {if(!v.controls) {v.paused?v.play():v.pause()}}  //
  return}  //
  vid.onended= function(){i=(i+1)%b.length; vid.src=b[i].href||b[i].src||b[i]; vid.play(); vid.title=vid.src};
  (document.querySelector('ul')||document.body).append(vid)
 vid.scrollIntoView()  //
 vid.src=img.href||img.src
})

/* following is motion-photo-viewer; rename .jpg to .mp4.jpg */
window.addEventListener('error', (e) => {e=e.target; if(e.tagName=='VIDEO') {imgtoblob(e.src).then(blob => {e.src=blob;e.play()})} }, true)

async function imgtoblob(img,o) 
{
 let response = await fetch(img);
 let data = await response.arrayBuffer()
 return URL.createObjectURL(buffertoblob(data,o));
}

function buffertoblob(data,o) {
 var array=new Uint8Array(data), start
 for (var i = 0; i < array.length; i++) {if (array[i+4]==0x66 && array[i+5]==0x74 && array[i+6]==0x79 && array[i+7]==0x70) {start=i; break}}  //ftyp
 if(start==undefined) {vid.poster=vid.src; return false}  //setTimeout(vid.onended,5000);
 var blob= o? new Blob([array.subarray(0,start)],{type:"image/jpg"}) : new Blob([array.subarray(start,array.length)],{type:"video/mp4"});
 return blob;
}

const ls=location.search;  //?MV=MV...jpg
if(ls.startsWith("?MV=")) {vid.loop=true;document.body.append(vid); imgtoblob(ls.slice(4)).then(blob => vid.src=blob)}

/* following is optional */
const inp=document.querySelector('input[type=file]');
if(inp) {inp.onchange= function(){document.body.append(vid); vid.src=URL.createObjectURL(inp.files[0])}
 vid.onended= function(){i=(i+1)%inp.files.length; vid.src=URL.createObjectURL(inp.files[i]); vid.play(); vid.title=inp.files[i].name+'.mp4'};
 var d=document.createElement("a"); document.body.appendChild(d);
 vid.onclick= () => {if(!vid.controls) imgtoblob(URL.createObjectURL(inp.files[i]),1).then(blob => {d.download=inp.files[i].name; d.href=blob;d.click()})}  //pic 
}
})()
