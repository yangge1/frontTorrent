var WebTorrent = require('webtorrent')
const sha1 = require('simple-sha1')
var client = new WebTorrent()
var axios=require('axios');
var bencode=require('bencode');
var fs=require('fs');
var jsn=require('circular-json');
var config={
    skip:1,
    continue2:true,
    faildT:[],
    x:0,
    length:0,
    interval:0,
    intervals:1
}
var torrentIds=[
//    'magnet:?xt=urn:btih:fce8058186c7ae314563a87a2c0239c93d77e250',
//     'magnet:?xt=urn:btih:52F00B76BC3D0E85ADE9FCFAE7DC2CDEF15118BE',
//      'AA7A926FDDD7A1F9399B95E2307C7497158466CF',
//     'magnet:?xt=urn:btih:C8ABE375A2D9BDA2A840AFD3FDF6DA9DE20881DB',
//     'magnet:?xt=urn:btih:7CC89F791C9AEE70E2F17159916805DE2E077C14',
//     'magnet:?xt=urn:btih:AFDBCDF521A4421C69A33956910F33A8D2F64CE4',
//    'magnet:?xt=urn:btih:D43BD18E8F628FFA45C9209BB376285FA73F02B0',
//    'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent',
//     'magnet:?xt=urn:btih:D0A6E2475C497C3161E8DFB0305DFD705EB07992',
//     'magnet:?xt=urn:btih:518A99DC04F2BC3A5D845A5B9B61DCAC4633881'

];
// axios.get('http://yxysq.com:8888/api/getHash?skip=1&limit=100',function(err,res,body){
//     console.log(res.data,33333333333)
//     console.log(body,444444444444);
// })

//axios.post('http://yxysq.com:8888/api/torrent/addList',{body:[{name:'123',hash:'234',size:123}]})
var metadata=[],simpleMeta=[];
start();
function start(){
    config.intervals=setInterval(function(){
        magnetTotorrent()
    },100)
}
function magnetTotorrent(){
  // if(!config.continue2) return;

    var torrent=torrentIds.shift();
    if(!torrent){
        if(config.interval){
            clearInterval(config.intervals)
        }
        config.continue2=false;
        config.skip++;
       return getMagnet();
    }
    config.x++;
    parseT(torrent)
}
function getMagnet(){
    axios.get('http://yxysq.com:8888/api/getHash?skip='+config.skip+'&limit=100').then(function(res){
        //console.log(res.data)
        var data=res.data
        
        if(data.data.length<1){
            console.error('data.data is empty');
            return;
        }
        config.length+=data.data.length;
        console.log(config.length,'proceing')
        if(data.data.length<100){
            console.log(data.data.length,'finished')
            config.interval=1;
          //  process.exit();
        }
    torrentIds=data.data;
    config.continue2=true;
    config.x=0;
    magnetTotorrent();
}).catch(function (err) {
    if(err) {
        console.error(err);
        return;
    }
  })
}
function parseT(tort){
    var s=config.x;

    var timeX=setTimeout(function(){
       

        client.remove(tort.hash,function(s){
            config.continue2=true;
            config.faildT.push(tort.hash);
        })
    },1000)
    config.continue2=false;
    client.add(tort.hash,{ path: './path' }, function (torrent) {
        console.log(torrent)
        clearTimeout(timeX);
        deselected(torrent);
        parseTorrent(torrent)
config.continue2=true;
      })
}
client.on('error', function (err) {
    console.error(err);
})
function parseTorrent(torrent){
    
    // if(metadata.length>=1){
    //     console.log('remote connect',1111111111111111111)
    //     axios.post('http://yxysq.com:8888/api/torrent/addDetail',metadata.splice(0,100))
    // }
    // if(simpleMeta.length>=1){
    //     console.log('remote connect',22222222222222222)
    //     axios.post('http://yxysq.com:8888/api/torrent/addList',simpleMeta.splice(0,100))
    // }
    var files=[],wires=[];
    var infoHash=torrent.infoHash
    var createDate=torrent['creation date'];
    if(createDate){
        console.log(new Date(torrent['creation date']*1000))
    }else{
        createDate=new Date();
    }
    torrent.files.forEach(function(file){
        files.push({name:file.name,size:file.length,path:file.path})
    })
    torrent.wires.forEach(function(wire){
        wires.push({address:wire.remoteAddress,port:wire.remotePort})
    })
    simpleMeta.push({
        'hash':infoHash,
        name:torrent.name,
        size:parseUnit(torrent.length)
    });

    metadata.push({
        'hash':infoHash,
        name:torrent.name,
        wires:wires,
        magnet:torrent.magnetURI,
        createDate:createDate,
        num:files.length,
        size:parseUnit(torrent.length),
        path:torrent.path,
        files:files
    })

    if(metadata.length>=1){
        console.log('remote connect',1111111111111111111)
        axios.post('http://yxysq.com:8888/api/torrent/addDetail',metadata.splice(0,100))
    }
    if(simpleMeta.length>=1){
        console.log('remote connect',22222222222222222)
        axios.post('http://yxysq.com:8888/api/torrent/addList',simpleMeta.splice(0,100))
    }
}
function parseUnit(size){
    var units=['B','KB','MB','GB','TB'];
    var value=0;
    var showT='';
    for(var x=units.length-1; x>=0;x--){
        value=size/Math.pow(1024,x);
        if(value>=1){
           return showT=value.toFixed(2)+units[x]
        }
    }
    if(!showT){
       return showT=value+'B';
    }
}
function deselected(torrent){
    torrent.deselect(0, torrent.pieces.length - 1, false)

  // Add selections (individual files)
  for (let i = 0; i < torrent._selections.length; i++) {
    const file = torrent.files[i]
    if (selections[i]) {
      file.select()
    } else {
      console.log('deselecting file ' + i + ' of torrent ' + torrent.name)
      file.deselect()
    }
  }
}
