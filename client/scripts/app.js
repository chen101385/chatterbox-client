class App {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.init();
    this.roomNames = [];
    this.currentMessages = [];
    // setInterval(() => this.fetch(), 5000);
    
  }
  
  init() {
    $(document).ready(function() {
      app.fetch();
      $(document).on('click', '.username', app.handleUsernameClick);
      // $('.submit').click(app.handleSubmit);
      $(document).on('click', '.clear', app.refreshData);
      $(document).on('click', '.submit', app.handleSubmit);
      $(document).on('click', '.addroom', app.addInputRoom);
      $('#rooms').on('change', '#roomSelect', function() {
        let $roomName = $('#rooms #roomSelect').val();
        app.renderRoom($roomName);  
      });
    });
  }
  
  send(message) {
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
        app.clearMessages();
        app.fetch();
      },
      error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    }); 
  }
  
  fetch(options = {order: '-updatedAt'}, callback = app.renderData) {
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?',
      type: 'GET',
      data: options,
      contentType: 'application/json',
      success: callback,
      error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    }); 
  }
  
  clearMessages() {
    $('#chats').empty();
  }
  
  refreshData() {
    app.clearMessages();
    app.fetch();
  }
  
  renderData(data) {
    for (var i = 0; i < data.results.length; i++) {      
      app.renderMessage(xssEscape(data.results[i]));
      if (app.roomNames.indexOf(data.results[i].roomname) === -1) {
        app.roomNames.push(data.results[i].roomname);
      }
    }
  }
  
  renderRoom(roomName) {
    app.clearMessages;
    app.fetch({order: '-updatedAt', where: {roomname: roomName}});
  }
  
  renderMessage(message) {
    $('#chats').append(`<div class="messages"><a href="#" class="username">${message.username}</a>: ${message.text}</div>`);
  }
  
  handleUsernameClick() {
    console.log('clicked');
  }
  
  handleSubmit() {
    let userData = {
      username: window.location.search.slice(10),
      text: $('#message').val(),
      roomname: $('#rooms #roomSelect').val()
    };
    app.send(userData);    
  }
  
  addInputRoom() {
    let inputRoomName = $('#message').val();
    if (inputRoomName.length && app.roomNames.indexOf(inputRoomName) === -1) {
      app.roomNames.push(inputRoomName);
      $('#roomSelect').append(`<option class="room" value="${inputRoomName}"> ${inputRoomName} </option>`);
    } else {
      alert('Room already exists!');
    }  
  }
  
  addCommunityRooms() {
    $('#roomSelect').empty();
    for (var i = 0; i < app.roomNames.length; i++) {
      console.log(app.roomNames[i]);
      $('#roomSelect').append(`<option class="room" value="${app.roomNames[i]}"> ${app.roomNames[i]} </option>`);
    }
  }
}
var app = new App();

