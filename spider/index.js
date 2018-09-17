const spider = new (require('./spider'))
spider.on('ensureHash',async (hash, peerId,addr)=> {
    //console.log(`ensureHash::magnet:?xt=urn:btih:${hash.toString('hex').toUpperCase()}`)
    console.log(`magnet:?xt=urn:btih:${hash.toString('hex').toUpperCase()}`)
  //  database.push({'hash':hash.toString('hex').toUpperCase()});
    // if(database.length>=300){
    //     await Hash.insertMany(database.splice(0,100));
    //     console.log('success!!!')
    // }
})


//spider.on('unensureHash', (hash)=> console.log(`unensureHash::magnet:?xt=urn:btih:${hash}`))

spider.listen(6881)