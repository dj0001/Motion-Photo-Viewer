(function(){
var vid=document.createElement("video"), i=0, a;
  vid.style = 'height:100vh; object-fit:scale-down; scroll-snap-align:start'
  vid.controls=true;
  vid.onended= function(){i=(i+1)%a.length; vid.src=a[i]; vid.play()}
  if ('mediaSession' in navigator) navigator.mediaSession.setActionHandler('nexttrack', vid.onended);  //>5sec

(document.querySelector('#files')||document.body).addEventListener('click', function(){
 let b=[...document.querySelectorAll('#files a')]  //'a[href*=".mp4"]'
 if(!b.includes(event.target)) return
 event.preventDefault()
 if(!document.querySelector('video')) {
  (document.querySelector('ul')||document.body).append(vid)}
 document.querySelector('video').scrollIntoView()  //
 a=b.map(x => x.href)
 document.querySelector('video').src=event.target.href
})

/* following is motion-photo-viewer; rename .jpg to .mp4.jpg */
vid.onerror= function(e) {imgtoblob(vid.src).then(blob => {vid.src=URL.createObjectURL(blob);vid.play()})}

async function imgtoblob(img) 
{
 let response = await fetch(img);
 let data = await response.arrayBuffer()
 return buffertoblob(data);
}

function buffertoblob(data) {
 var array=new Uint8Array(data), start
 for (var i = 2; i < array.length; i++) {if (array[i+4]==0x66 && array[i+5]==0x74 && array[i+6]==0x79 && array[i+7]==0x70) {start=i; break}}  //ftyp
 var blob=new Blob([array.subarray(start||0, array.length)], {type:"video/mp4"});
  return blob;
}

const ls=location.search;  //?MV=MV...jpg
if(ls.startsWith("?MV=")) {vid.loop=true;document.body.append(vid); imgtoblob(ls.slice(4)).then(blob => vid.src=URL.createObjectURL(blob))}

/* following is optional */
const inp=document.querySelector('input[type=file]');
if(inp) inp.onchange= function(){document.body.append(vid); a=[...this.files].map(x => URL.createObjectURL(x)); vid.src=a[0]}

})()
