import React, {useEffect, useRef} from 'react';
import moment from 'moment';
import client from './feathers';

import Button from '@mui/material/Button';

const Chat = ({messages, users, login}) => {
  const chatRef = useRef(null);

  function sendMessage(ev) {
    const input = ev.target.querySelector('[name="text"]');
    const text = input.value.trim();

    if (text) {
      client
        .service('messages')
        .create({text})
        .then(() => {
          input.value = '';
        });
    }

    ev.preventDefault();
  }

  function scrollToBottom() {
    let chat = chatRef.current;
    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  }

  useEffect(() => {
    client.service('messages').on('created', scrollToBottom);
    scrollToBottom();

    return () => {
      client.service('messages').removeListener('created', scrollToBottom);
    };
  });

  return (
    <main className="flex flex-column" style={{height: "100vh", display: "flex", width: "100%"}}>
      <header className="title-bar flex flex-row flex-center">
        <div className="title-wrapper block center-element">
          <img
            className="logo"
            src="https://moonbeam.network/wp-content/uploads/2021/09/yuser-500.png"
            alt="Yuser Logo"
          />
        </div>
      </header>

      <div className="flex flex-row flex-1 clear">
        <aside className="sidebar col col-3 flex flex-column flex-space-between">
          <header className="flex flex-row flex-center">
            <h4 className="font-300 text-center">
              <span className="font-600 online-count">{users.length}</span>{' '}
              Users in chat
            </h4>
          </header>

          <ul className="flex flex-column flex-1 list-unstyled">
            {users.map((user, index) => (
              <li key={index}>
                <img src={user.avatar} alt={user.email} className="avatar"/>
                <span className="absolute username">{user.email}</span>
              </li>
            ))}
          </ul>

          <footer className="flex flex-row flex-center">
            <Button onClick={() => client.logout()} variant="outlined">Logout</Button>
          </footer>
        </aside>

        <div className="flex flex-column col col-9">
          <main className="chat flex flex-column flex-1 clear" ref={chatRef}>
            {messages.map((message, index) => (

              <div key={index} className="message flex flex-row">
                {
                  message.user.email === login.user.email ?
                    <div style={{marginLeft: "auto", marginRight: "0"}}>
                    </div> : <div></div>
                }
                <img
                  src={message.user.avatar}
                  alt={message.user.email}
                  className="avatar"
                />

                <div className="message-wrapper">
                  <p className="message-header">
                    <span className="username font-600">
                      {message.user.email}
                    </span>
                    <span className="sent-date font-300">
                       on {moment(message.createdAt).format('MMM Do, hh:mm:ss')}
                    </span>
                  </p>
                  <p className="message-content font-300">{message.text}</p>
                </div>
              </div>
            ))}
          </main>

          <form
            onSubmit={sendMessage.bind(this)}
            className="flex flex-row flex-space-between"
            id="send-message"
          >
            <input type="text" name="text" className="flex flex-1"/>
            <Button variant="contained" type="submit">Send</Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Chat;
