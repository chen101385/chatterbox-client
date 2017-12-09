class App {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.init();
    this.fetch();
    this.roomNames = [];
    this.currentMessages = [];
    // setInterval(() => this.fetch(), 5000);
    
  }
  
  init() {
    $(document).ready(function() {
      $(document).on('click', '.username', app.handleUsernameClick);
      // $('.submit').click(app.handleSubmit);
      $(document).on('click', '.clear', app.clearMessages);
      $(document).on('click', '.submit', app.handleSubmit);
      $(document).on('click', '.addroom', app.addRoom);
      $('#rooms').on('change', '#roomSelect', function() {
      });
      // $('#main').on('click', '.room', function() {
      //   app.clearMessages();
      //   let roomData = _.filter(currentMessages, function(message) {
      //     message.roomname === $(this).val();
      //   });
      //   app.renderData(roomData);   
      // });
      /*
      $('#main').on('click', '.room', app.changeRoom);
       on click/select of roomname, filter data to only show messages match roomname  
      */
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
  
  fetch() {
    $.ajax({
  // This is the url you should use to communicate with the parse API server.
      url: `${this.server}?order=-updatedAt`,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message fetched');
        // let safeArr = [];
        // // data.results.forEach((message) => safeArr.push(xssEscape(message)));
        // safeArr.forEach((message) => app.currentMessages.push(message));
        app.renderData(data);
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
  
  renderData(data) {
    for (var i = 0; i < data.results.length; i++) {          
      app.renderMessage(xssEscape(data.results[i]));  
    }
  }
  
  renderMessage(message) {
    $('#chats').append(`<div class="messages"><a href="#" class="username">${message.username}</a>: ${message.text}</div>`);
  }
  
  renderRoom(roomName) {
    $('#roomSelect').prepend(`<option value="${roomName}"> ${roomName} </option>`);
  }
  
  handleUsernameClick() {
    console.log('clicked');
  }
  
  handleSubmit() {
    let username = window.location.search.slice(10);
    let message = $('#message').val();
    var obj = {};
    
    obj.text = message;
    obj.username = username;
    app.send(obj);    
  }
  addRoom() {
    //retrieve value from the input field
      //check value against array of existing values
        //if non-existent, then push to array;
          //array values reflect <option> values in HTML
    let inputRoomName = $('#message').val();
    console.log(inputRoomName);
    if (inputRoomName.length && app.roomNames.indexOf(inputRoomName) === -1) {
      app.roomNames.push(inputRoomName);
      console.log(app.roomNames);
      $('#roomSelect').prepend(`<option class="room" value="${inputRoomName}"> ${inputRoomName} </option>`);
    } else {
      alert('Room already exists!');
    }  
  }
}
var app = new App();

