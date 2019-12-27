(function(){
var vid=document.createElement("video"), i=0, b;
  vid.style = 'height:100vh; object-fit:scale-down; scroll-snap-align:start'
  vid.controls=true;
  if ('mediaSession' in navigator) navigator.mediaSession.setActionHandler('nexttrack', vid.onended);  //>5sec

(document.querySelector('#files')||document.body).addEventListener('click', function(){
 b=[...document.querySelectorAll('#files a')]  //'a[href*=".mp4"]'
 if(!b.includes(event.target)) return
 event.preventDefault()
 if(!document.querySelector('video')) {
  vid.onended= function(){i=(i+1)%b.length; vid.src=b[i].href; vid.play(); vid.title=b[i].href};
  (document.querySelector('ul')||document.body).append(vid)}
  //else {vid.loop=true; const copy=vid.cloneNode(); document.body.append(copy)}; vid.loop=true  //;copy.play()  //multiple
 document.querySelector('video').scrollIntoView()  //
 a=b.map(x => x.href)
 document.querySelector('video').src=event.target.href
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
 vid.onended= function(){i=(i+1)%inp.files.length; vid.src=URL.createObjectURL(inp.files[i]); vid.play()};
 var d=document.createElement("a"); document.body.appendChild(d);
 vid.onclick= () => {if(!this.controls) imgtoblob(URL.createObjectURL(inp.files[i]),1).then(blob => {d.download=inp.files[i].name; d.href=blob;d.click()})}  //pic 
}
})()
