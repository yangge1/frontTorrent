//去重
var ss=db.getCollection('hashs').aggregate([
    { $group: { 
    _id: { firstField: "$hash"}, 
    uniqueIds: { $addToSet: "$_id" },
    count: { $sum: 1 } 
    }}, 
    { $match: { 
    count: { $gt: 1 } 
    }}
    ])
    ss._batch.forEach(function(it){
       it.uniqueIds.shift()
        db.getCollection('hashs').remove({_id:{$in:it.uniqueIds}})
       })
//聚合
db.getCollection('hashs').aggregate([
    { $group: { 
    _id: { firstField: "$hash"}, 
    uniqueIds: { $addToSet: "$_id" },
    count: { $sum: 1 } 
    }}, 
    { $match: { 
    count: { $gt: 1 } 
    }}
    ])