
const timePicker = document.querySelector('#time')
const datePicker = document.querySelector('#date')
const currentOrders = document.querySelector('#curr-orders')
const paidOrders = document.querySelector('#paid-orders')
const form = document.querySelector('#order-form')


const baseURL = `http://localhost:4004/orders`
const errCallback = err => console.log(err)

function resetFormValues() {
    timePicker.value = '07:00:00'
    datePicker.value =  date.toLocaleDateString('en-ca')
}

const possibleTimes = [ 
    {
        display: '2:00 PM', 
        server: '14:00:00'
    }, 
    {
        display: '2:30 PM', 
        server: '14:30:00'
    }, 
    {
        display: '3:00 PM', 
        server: '15:00:00'
    }
]

for (let i = 0; i < possibleTimes.length; i++) {
    let obj = possibleTimes[i]
    const newOption = document.createElement('option')
    newOption.setAttribute('value', obj.server)
    newOption.textContent = obj.display
    timePicker.appendChild(newOption)
}

function createDisplayDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const reqDate = new Date(date)
    const reqDateDisplay = reqDate.toLocaleDateString('en-US', options)
    const reqTime = reqDate.toLocaleTimeString('en-US')
    const timeDisplay = reqTime.slice(0, -6)
    const timeOfDay = reqTime.slice(-2)
    return `${reqDateDisplay} ${timeDisplay} ${timeOfDay}`
}

function makeOrderCard(order) {
    const dateDisplayText = createDisplayDate(order.date)
    console.log(dateDisplayText);
    const orderElem = 
    `<div class= "card" id="order-${order['order_id']}">
    <h3>${dateDisplayText}</h3>
    <h3>${order.client_name}</h3>
    <h4>${order.film_name}</h4>
    <p>Paid: ${!order.paid  ? `<button onclick='markPaid(${order.order_id})'>Mark Paid</button>` : 'yes'}</p>
    <p>${order.notes}</p>
    </div>`
    return orderElem
}

function getOrders() {
    axios.get(baseURL)
        .then(res => {
        for(let i = 0; i < res.data.length; i++) {
            const order = res.data[i]
            const newOrderElem = makeOrderCard(order)
            if(order.paid){
                paidOrders.innerHTML += newOrderElem
            } else {
                currentOrders.innerHTML += newOrderElem
            }
        }
    })
    .catch(errCallback)    
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    let dateTime = `${datePicker.value} ${timePicker.value}:00.00Z`
    let dateTimeObj = new Date(dateTime)
    let film = document.querySelector('#film')
    let notes = document.querySelector('#notes')
    let client = document.querySelector('#client')
    let bodyObj = {
        film: film.value,
        notes: notes.value,
        client: client.value,
        date: dateTimeObj
    }
    axios.post(baseURL, bodyObj)
        .then(res => {
            const order = res.data[0]
            console.log(res.data[0]);
            const newOrderElem = makeOrderCard(order)
            if(order.paid){
                paidOrders.innerHTML += newOrderElem
            } else {
                currentOrders.innerHTML += newOrderElem
            }
        })
        .catch(errCallback);
})

function markPaid(id) {
    const selector = `#order-${id}`
    const elemToRemove = document.querySelector(selector)
    elemToRemove.remove()
    axios.put(baseURL, {order_id: id})
    .then(res => {
        const order = res.data[0]
        const newOrderElem = makeOrderCard(order)
        paidOrders.innerHTML += newOrderElem
    })
}

getOrders();
