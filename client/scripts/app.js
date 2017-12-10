class App {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.init();
    this.roomNames = [];
    this.currentMessages = [];
    this.friends = [];
    // setInterval(() => this.fetch(), 5000);
    
  }
  
  init() {
    $(document).ready(function() {
      $(document).on('click', '.username', app.handleUsernameClick);
      // $('.submit').click(app.handleSubmit);
      $(document).on('click', '.refresh', app.refreshData);
      $(document).on('click', '.submit', app.handleSubmit);
      $(document).on('click', '.addroom', app.addInputRoom);
      $('#rooms').on('change', '#roomSelect', function() {
        let $roomName = $('#rooms #roomSelect').val();
        app.clearMessages();
        app.fetch({order: '-updatedAt', where: {roomname: $roomName}});  
      }); 
      app.fetch();
      app.fetch({order: '-updatedAt'}, app.renderRoom); 
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
  
  // clears all the children on chats div
  clearMessages() {
    $('#chats').empty();
  }
  
  refreshData() {
    app.clearMessages();
    app.fetch();
  }
  
  // takes in data parameter and sends escaped results to rendermessage
  renderData(data) {
    console.log(data);
    for (var i = 0; i < data.results.length; i++) {      
      app.renderMessage(xssEscape(data.results[i]));
      if (app.roomNames.indexOf(data.results[i].roomname) === -1) {
        app.roomNames.push(data.results[i].roomname);
      }
    }
  }
  
  renderRoom() {
    let inputRoomName = $('#message').val();
    // iterate through roomnames array to append to room selector
    for (var i = 0; i < app.roomNames.length; i++) {
      let cleanName = xssEscape(app.roomNames[i]);
      $('#roomSelect').append(`<option class="room" value="${cleanName}"> ${cleanName} </option>`);  
    }
  }
  
  renderMessage(message) {
    $('#chats').append(`<div class="messages ${message.username}"><a href="#" class="username ${message.username}">${message.username}</a>: ${message.text}</div>`);
    // bolds titles that are in the friends array
    if (app.friends.indexOf(message.username) !== -1) {
      $(`.${message.username}`).css({'font-weight': 'bold'});
    }
  }
  
  handleUsernameClick(event) {
    event.preventDefault();
    // when called pushes clicked name into array
    app.friends.push($(event.currentTarget).text());
    app.fetch();
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
      app.renderRoom(inputRoomName);
    } else {
      alert('Room already exists!');
    }
  }
}
var app = new App();

