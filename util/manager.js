const fs = require("fs")

async function writeInstanceFile(path, object){
    return new Promise((resolve, reject)=>{
        fs.promises.writeFile(path, JSON.stringify(object), {encoding: 'utf-8'})
            .then((value)=>{
                resolve(value)
            })
            .catch((err)=>{
                reject(err)
            })
    })
}

async function getDataFromFile(path){
    return new Promise((resolve, reject)=>{
        fs.promises.readFile(path, {encoding: 'utf-8'})
        .then((data)=>{
            if(data){
                resolve(JSON.parse(data));
            }else{
                resolve([]);
            }
        })
        .catch((err)=>{
            console.log("fail to get data in path: " + path);
            reject(err)
        })
    })
}

function getLimitedData(limit, data){
    if(limit){
        let limitedData = data.slice(0, (limit + 1));
        console.log("the request has a limit: " + limit)
        return limitedData
    }else{
        console.log("the request has no limit")
        return data
    }
}

async function getInstanceById(collection, id){
    return new Promise((resolve, reject)=>{
        const dataFound = collection.find((data)=>data.id == id);
        if(dataFound){
            console.log("instance returned...")
            resolve(dataFound)
        }
        else{
            console.log("user not found with the id: " + id)
            reject(404)
        }
    })
}

async function createInstance({path, collection, body, id, objectValid, notDuplicated}){
    return new Promise((resolve, reject)=>{
        if(objectValid){
            if(notDuplicated){
                collection.push({id: id, ...body});
                writeInstanceFile(path, collection)
                .then((value)=>{
                    console.log("the instance has been created, answer: " + value);
                    resolve()
                })
                .catch((err)=>{
                    console.log("an error has ocurred: " + err)
                    reject(500)
                })
            }else{
                console.log("this instance is duplicated, try another value")
                reject(409)
            }
        }else{
            console.log("there's not enough data to create a instance or data is not valid" )
            reject(409)
        }
    })
}

async function updateInstance({collection, id, path, updatedData, notDuplicated}){
    new Promise((resolve, reject)=>{
        if(updatedData){
            //CHEKCS the email
            if(notDuplicated){
                const dataFound = collection.find((data)=>data.id == id)
                if(dataFound){
                    collection = collection.map((data)=>{
                        if(data.id == id){
                            return {id: data.id, ...updatedData};
                        }else{
                            return data;
                        }
                    });    
                    writeInstanceFile(path, collection)
                        .then(()=>{
                            console.log("the instance has been updated");
                            resolve()
                        })
                        .catch((err)=>{
                            console.log("error in the file")
                            reject(500)
                        })
                }else{
                    console.log("instance not found to update the info")
                    reject(404);
                }
            }else{
                console.log("there's an element with the same data")
                reject(409)
            }
            
        }else{
            console.log("there's not enough data in the request to update the collection")
            reject(409)
        }
    })
}

async function deleteInstances({collection, path, id, deleteAll}){
    return new Promise((resolve, reject)=>{
        if(id && !isNaN(id)){
            if(collection.find((data)=>data.id == id)){
                collection = collection.map((data)=>!(data.id == id));
                writeInstanceFile(path, collection)
                    .then(()=>{
                        console.log("the element has been deleted")
                        resolve();
                    })
                    .catch((err)=>{
                        console.log("error in the file")
                        reject(500);
                    })
                
            }else{
                console.log("instance not found to be deleted")
                reject(404)
            }
        }else if(deleteAll){
            if(deleteAll){
                collection = [];
                writeInstanceFile(path, collection)
                .then(()=>{
                    console.log("all elements has been deleted")
                    resolve()
                })
                .catch((err)=>{
                    console.log("error in operation")
                    reject(500)
                })
            }else{
                reject(418)
            }
        }
        else{
            console.log("the delete has no input to know what to do")
            reject(418)
        }
    })
}

module.exports = {
    writeInstanceFile,
    getDataFromFile,
    getLimitedData,
    getInstanceById,
    createInstance,
    updateInstance,
    deleteInstances
}