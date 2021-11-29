
// const currentOrders = document.querySelector('#curr-orders')
const paidOrders = document.querySelector('#paid-orders')

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
    `<div class= "card">
    <p>${order.notes}</p>
    <h3>${dateDisplayText}</h3>
    </div>`
    return orderElem
}

function getPaidOrders() {
    console.log('axios command');
    axios.get('http://localhost:4004/orders')
    .then(res => {
        for(let i = 0; i < res.data.length; i++) {
            const order = res.data[i]
            const newOrderElem = makeOrderCard(order)
            paidOrders.innerHTML += newOrderElem
        }
    })
    .catch(err => console.log(error, 'error getting paid orders'))    
}

getPaidOrders();
