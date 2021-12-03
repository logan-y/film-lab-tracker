///****TIMER****///

class Timer {
  constructor(root, label) {
    root.innerHTML = Timer.getHTML(label);
    
    this.el = {
        minutes: root.querySelector(".timer__part--minutes"),
        seconds: root.querySelector(".timer__part--seconds"),
        control: root.querySelector(".timer__btn--control"),
        reset: root.querySelector(".timer__btn--reset")
      };

      
      this.interval = null;
      this.remainingSeconds = 0;
      
      this.el.control.addEventListener("click", () => {
        if (this.interval === null) {
          this.start();
        } else {
          this.stop();
        }
      });
      
      
      this.el.reset.addEventListener("click", () => {
        const inputMinutes = prompt("Enter number of minutes:");
  
        if (inputMinutes < 60) {
          this.stop();
          this.remainingSeconds = inputMinutes * 60;
          this.updateInterfaceTime();
        }
      });
    }
    
    updateInterfaceTime() {
      const minutes = Math.floor(this.remainingSeconds / 60);
      const seconds = this.remainingSeconds % 60;
      
      this.el.minutes.textContent = minutes.toString().padStart(2, "0");//put two characters even if input is less than 10min
      this.el.seconds.textContent = seconds.toString().padStart(2, "0");
    }
    
    updateInterfaceControls() {
      if (this.interval === null) {
        this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
        this.el.control.classList.add("timer__btn--start");
        this.el.control.classList.remove("timer__btn--stop");
      } else {
        this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
        this.el.control.classList.add("timer__btn--stop");
        this.el.control.classList.remove("timer__btn--start");
      }
    }
  
    start() {
      if (this.remainingSeconds === 0) return;
      
      this.interval = setInterval(() => {
        this.remainingSeconds--;
        this.updateInterfaceTime();
        
        if (this.remainingSeconds === 0) {
          this.stop();
        }
      }, 1000);
      
      this.updateInterfaceControls();
    }
    
    stop() {
      clearInterval(this.interval);
      
      this.interval = null;
      
      this.updateInterfaceControls();
    }
  
    static getHTML(str) {
      return `
      <span class="timer__part timer__part--minutes">00</span>
      <span class="timer__part">:</span>
      <span class="timer__part timer__part--seconds">00</span>
      <button type="button" class="timer__btn timer__btn--control timer__btn--start">
                  <span class="material-icons">play_arrow</span>
              </button>
              <button type="button" class="timer__btn timer__btn--reset">
                  <span class="material-icons">timer</span>
                  </button><br>
                  <span class="timer__part">${str}</span>
          `;
        }
      }
///****CREATE TIMERS****///
new Timer(document.getElementById("rinse"), " Rinse Timer");
new Timer(document.getElementById("dev"), " Developer Timer");
new Timer(document.getElementById("fixer"), " Fixer Timer");
new Timer(document.getElementById("soak"), " Soak Timer");
new Timer(document.getElementById("stbl"), " Stabilizer Timer");

///****ORDER FORM****///
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
///****CREATE ORDER CARDS****///
function makeOrderCard(order) {
    const dateDisplayText = createDisplayDate(order.date)
    console.log(order);
    const orderElem = 
    `<div class= "card" id="order-${order.order_id}">
    <h3>Order no. ${order.order_id}</h3>
    <h3>Client: ${order.client_name}</h3>
    <h4>Email: ${order.email}
    <h4>Date Received: ${dateDisplayText}</h4>
    <h4>Film delivered: ${order.brand_name} ${order.film_name}</h4>
    <p>Notes: ${order.notes}</p>
    <h3>Paid? ${!order.paid  ? `<button class = "payBtn" onclick='markPaid(${order.order_id})'>Mark Paid</button>` : ' Yes'}</h3>
    </div>`
    return orderElem
}

///****READ ORDERS****///
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

///****CREATE ORDER****///
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
            const newOrderElem = makeOrderCard(order)
            if(order.paid){
                paidOrders.innerHTML += newOrderElem
            } else {
                currentOrders.innerHTML += newOrderElem
            }
        })
        .catch(errCallback);
})

///****UPDATE ORDER****///
function markPaid(id) {
    const selector = `#order-${id}`
    const elemToRemove = document.querySelector(selector)
    elemToRemove.remove()
    axios.put(baseURL, {order_id: id})
    .then(res => {
        const order = res.data[0]
        const newOrderElem = makeOrderCard(order)
        paidOrders.innerHTML += newOrderElem
        console.log(newOrderElem)
    })
}

getOrders();
