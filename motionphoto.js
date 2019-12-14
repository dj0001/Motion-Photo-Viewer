(function(){  //Copyright 2019 dj  ,License BSD 2-Clause

const inp=document.querySelector('input[type=file]'); if(inp) inp.onchange=handleFiles
function handleFiles(files) {files=this.files  //optional
for (let i = 0; i < files.length; i++) {
const reader = new FileReader();
reader.onload = function(evt) {
 var blob=buffertoblob(evt.target.result)
 blobtovid(blob,files[i].name)
 }
reader.readAsArrayBuffer(files[i])
}
}

const multiple=true; //edit here

var ls=location.search; if(ls.slice(0,4)=='?MV=') imgtoblob(ls.slice(4)).then(blob => blobtovid(blob))  //?MV=MV...jpg

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

function blobtovid(blob,fn) {
 if(document.querySelector('video') && !multiple) {document.querySelector('video').src=URL.createObjectURL(blob); return}
 const vid=document.createElement("video") ,ref=document.querySelector('ul')||document.body  //HFS2.4
 vid.loop = true; vid.preload = 'auto'; vid.controls = true
 vid.style = 'max-height:100vh'
 vid.title = fn||''
 try {blob=new File([blob], fn+'.mp4' ,{type:"video/mp4"})} catch (e) {console.log(e)}  //FF
 vid.src=URL.createObjectURL(blob);
 vid.currentTime=1  //hide Overlay Play button
 if('pictureInPictureEnabled' in document && !multiple && !ls) vid.onloadedmetadata = (e) => vid.requestPictureInPicture(); else  //
 ref.append(vid)
}

const ref=document.querySelector('#files')||document.body
ref.addEventListener('click', function(){
const img=event.target.getAttribute('href')||event.target.getAttribute('src')
if(event.target.tagName!='IMG' || !/(^|\/)MV.+\.jpg$/.test(img)) return  //motion photos beginns with MV  //edit here 'A' or 'IMG'
event.preventDefault() 
imgtoblob(img).then(blob => blobtovid(blob));
})
})()
