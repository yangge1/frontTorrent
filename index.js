var WebTorrent = require('webtorrent')
const sha1 = require('simple-sha1')
var client = new WebTorrent()
var axios=require('axios');
var bencode=require('bencode');
var fs=require('fs');
var jsn=require('circular-json');
var _=require('underscore');
// app.use(bodyPaser.urlencoded({ extended: false ,limit: '2mb'}));
// app.use(bodyPaser.json({limit: '2mb'}));
var config={
    skip:1,
    continue2:true,
    faildT:[],
    x:0,
    length:0,
    interval:0,
    intervals:1
}
// app.get('/api/torrent/listCount',function(req,res){
//     console.log('connection')
//     res.send('hello world');
// })
var torrentIds=[
    // 'magnet:?xt=urn:btih:DC3E8A7E4B995116449D616583627F1D486AC6D1',
    // 'magnet:?xt=urn:btih:C7E8FCD4DEF3D34CDC1C959A96ACA303C582E7B8',
    // 'magnet:?xt=urn:btih:93C20335E2C896FB0C34F84240F749A09AA7E59D',
    // 'magnet:?xt=urn:btih:8029F978BE46675D5963852CA74F152F8E62FA98'
    // {hash:'magnet:?xt=urn:btih:70bf8d57726d9d1695a36a45079d737485c4118f'}
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
//start();
// _.each(torrentIds,function(li,ind){
//     client.add(li,{ path: './path' }, function (torrent) {
//         console.log(torrent.infoHash,'success success')
//         deselected(torrent);
//         parseTorrent(torrent)
//       //  diffList.splice(ind,1)
//       })
// })
test()
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
async function test(){
    var torrent=torrentIds.shift();
   // let list=await axios.get('http://yxysq.com:8888/api/torrent/getListByDup');
    let list=await axios.get('http://yxysq.com:8888/api/getHashByDup');
    let detail=await axios.get('http://yxysq.com:8888/api/torrent/getDetailByDup');
    let listH=list.data.data;
    let detailH=detail.data.data;
    console.log(listH,33333333333);
    console.log(detailH,4444444444444444444)
   let diffList= _.difference(listH,detailH)
    if(!_.isEmpty(diffList)){
        console.log(diffList,'length:',diffList.length)
        torrentIds=diffList;
        setInterval(function(){
            console.log(diffList,'length:',diffList.length)
            console.log(config.faildT,'config.faildT.length:',config.faildT.length)
        },60*1000)
        let testT=setInterval(function(){
            let li=diffList.shift();
            if(!li){
                clearInterval(testT);
                return;
            }
            var timeX=setTimeout(function(){
       

        client.remove(li,function(s){
            config.faildT.push(li);
            diffList.splice(diffList.indexOf(li),1)
        })
    },60*1000)
    client.add(li,{ path: './path' }, function (torrent) {
        console.log(torrent.infoHash,'success success')
        clearTimeout(timeX);
        deselected(torrent);
        parseTorrent(torrent)
      })
        },100)
        
    }
    console.log(diffList,55555555555)
  //  parseT(torrent)
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
function parseT(tort,diffList){
    var s=config.x;
    tort= _.isObject(tort)?tort.hash:tort;
    var timeX=setTimeout(function(){
       

        client.remove(tort,function(s){
            config.continue2=true;
            config.faildT.push(tort);
        })
    },60*1000)
    config.continue2=false;
    client.add(tort,{ path: './path' }, function (torrent) {
        console.log(torrent.infoHash,'success success')
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
        axios.post('http://yxysq.com:8888/api/torrent/addDetail',metadata.splice(0,100))
    }
    if(simpleMeta.length>=1){
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