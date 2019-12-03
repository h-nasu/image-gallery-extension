
export default function vuexIndexedDBPlugin(dbname, dbversion) {
  return (store) => {

    if (!window.indexedDB) {
      return
    }

    var db
    var openRequest = window.indexedDB.open(dbname, dbversion)

    const getObjectStore = (storeName) => {
      let transaction = db.transaction([storeName], "readwrite")
      transaction.onerror = () => {
        console.log('transaction error')
      }
      return transaction.objectStore(storeName)
    }

    openRequest.onerror = () => {
      console.log('Can not open db')
    }
    openRequest.onsuccess = (event) => {
      console.log('Open db')
      db = event.target.result

      for (let keyState in store.state) {
        if (db.objectStoreNames.contains(keyState)) {
          const mutationType = `${keyState}/initFromIndexedDB`
          if (store._mutations && store._mutations[mutationType]) {
            getObjectStore(keyState).getAll().onsuccess = function(event) {
              store.commit(mutationType, event.target.result)
            }
          }
        }
      }
    }

    openRequest.onupgradeneeded = (event) => {
      console.log('Upgrade db')
      db = event.target.result

      // all stores
      for (let keyState in store.state) {
        if (!db.objectStoreNames.contains(keyState)) {
          let objectStore = db.createObjectStore(keyState, { keyPath: 'id', autoIncrement : true })
          console.log('Create DB store '+keyState)

          let state = store.state[keyState]
          if (state.schema) {
            if (state.schema.indexes) {
              state.schema.indexes.forEach((index) => {
                objectStore.createIndex(index.name, index.name, index.options)
              })
            }
            if (state.schema.defaultData) {
              let defaultData = state.schema.defaultData
              defaultData.forEach((data) => {
                let request = objectStore.add(data)
                request.onerror = () => {
                  console.log('Data add error for '+ keyState)
                }
                request.onsuccess = (event) => {
                  console.log('Data added to '+ keyState)
                  data.id = event.target.result
                  store.commit(`${keyState}/addedToIndexedDB`, data)
                }
              })
            }
          }


          // check for index
          //objectStore.createIndex("name", "name", { unique: false });

          /*

  var transaction = db.transaction(["customers"], "readwrite");
  var objectStore = transaction.objectStore("customers");
  var request = objectStore.add(customer);
    request.onsuccess = function(event) {
      // event.target.result === customer.ssn;
    };


    var request = db.transaction(["customers"], "readwrite")
                  .objectStore("customers")
                  .delete("444-44-4444");
  request.onsuccess = function(event) {
    // It's gone!
  };


  var request = objectStore.get("444-44-4444");
  request.onsuccess = function(event) {
    // Do something with the request.result!
    console.log("Name for SSN 444-44-4444 is " + request.result.name);

    var data = event.target.result;

    // update the value(s) in the object that you want to change
    data.age = 42;

    // Put this updated object back into the database.
    var requestUpdate = objectStore.put(data);
    requestUpdate.onsuccess =

  };

  objectStore.getAll().onsuccess = function(event) {

          */




        }
      }

    }



    store.subscribe((mutation, state) => {
      console.log(mutation)
      console.log(state)

      let objectStore
      let request

      let typeArr = mutation.type.split('/')
      let action = typeArr.pop()
      let storeName = typeArr[0]
      let data = mutation.payload

      switch (action) {
        case 'addToIndexedDB':
          objectStore = getObjectStore(storeName)
          request = objectStore.add(data)
          request.onerror = () => {
            console.log('Data add error for '+ storeName)
          }
          request.onsuccess = (event) => {
            console.log('Data added to '+ storeName)
            data.id = event.target.result
            store.commit(`${storeName}/addedToIndexedDB`, data)
          }
          break;
        case 'editFromIndexedDB':
          objectStore = getObjectStore(storeName)
          if (data.object && data.params) {
            request = objectStore.get(data.object.id);
            request.onsuccess = (event) => {
              // Do something with the request.result!
              console.log("IndexedDB edit " + storeName + ' ' + data.object.id);

              let dbData = event.target.result;

              for (let key in data.params) {
                dbData[key] = data.params[key]
              }

              // Put this updated object back into the database.
              let requestUpdate = objectStore.put(dbData);
            }
          }
          break;

        default:

      }

    })
  }

}







