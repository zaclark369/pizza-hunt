let db;

const request = indexedDB.open('pizza_hunt', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_pizza', { auto_increment: true});
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.online) {
        // fill this out later
        // uploadPizza();
    }
};

request.onerror = function(event) {
    // log error
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    const pizzaObjectStore = transaction.objectStore('new_pizza');

    pizzaObjectStore.add(record);
}

function uploadPizza() {
    const transaction = db.transaction(['new_pizza'], 'readwrite')

    const pizzaObjectStore = transaction.objectStore('new_pizza');

    const getAll = pizzaObjectStore.getAll();

    // more will come here
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
          fetch('/api/pizzas', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
    
              const transaction = db.transaction(['new_pizza'], 'readwrite');
              const pizzaObjectStore = transaction.objectStore('new_pizza');
                pizzaObjectStore.clear();

                alert('All saved pizza have been submitted!')
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

// listen for app comingonline
window.addEventListener('online', uploadPizza);