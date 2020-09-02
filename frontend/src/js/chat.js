const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTempalte = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search.slice(1))

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled ?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message',(message) => {
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})


    
socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTempalte, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    const message = e.target.elements.message.value;

    $messageFormButton.setAttribute('disabled','disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()


    
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        if (error){
            return console.log(error)
        }
    })

})

$sendLocationButton.addEventListener('click',()=>{
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your broser.')
    }
    $sendLocationButton.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {latitude: position.coords.latitude, 
                                     longitude: position.coords.longitude}, () => {
                                         $sendLocationButton.removeAttribute('disabled')
                                         console.log('Location shared!')
                                     });
    })
})
//console.log("emitting join to: "+room.t+", username: "+username)
socket.emit('join', {username, room: room.toLowerCase()}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})