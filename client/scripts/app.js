// YOUR CODE HERE:
class App {
  constructor() {
    this.init();
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
  }
  
  init() {
    $(document).ready(function() {
      $('#main').on('click', '.username', app.handleUsernameClick);
      $('.submit').on('submit', app.handleSubmit);  
    });
  }
  
  send(message) {
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
      },
      error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    }); 
  }
  
  fetch() {
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message fetched');
      },
      error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    }); 
  }
  
  clearMessages() {
    $('#chats').empty();
  }
  renderMessage(message) {
    $('#chats').append(`<div class="messages"><a href="#" class="username">${message.username}</a>: ${message.text}</div>`);
    console.log(`${message.text}`);
  }
  // var message = {
  // username: 'shawndrost',
  // text: 'trololo',
  // roomname: '4chan'
  //}
  renderRoom(roomName) {
    $('#roomSelect').prepend(`<option value="${roomName}"> ${roomName} </option>`);
  }
  
  handleUsernameClick() {
    console.log('clicked');
  }
  
  handleSubmit() {
    console.log('you reached me');
  }
  //add a friend upon clicking their username
    //add event handler on 'click'
      //jquery method to add friend name to a container
  
  
}

var app = new App;