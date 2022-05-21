import React, {useState, useEffect} from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import client from './api/feathers';
import './App.css'

const messagesService = client.service('messages');
const usersService = client.service('users');

const App = () => {
  const [login, setLogin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    client.authenticate().catch(() => {
      setLogin(null);
    });

    client.on('authenticated', loginResult => {
      Promise.all([
        messagesService.find({
          query: {
            $sort: {createdAt: -1},
            $limit: 25,
          },
        }),
        usersService.find(),
      ]).then(([messagePage, userPage]) => {
        const messagesResult = messagePage.data.reverse();
        const usersResult = userPage.data;

        setLogin(loginResult);
        setMessages(messagesResult);
        setUsers(usersResult);
      });
    });

    client.on('logout', () => {
      setLogin(null);
      setMessages([]);
      setUsers([]);
    });

    messagesService.on('created', message => {
        setMessages(currentMessages => currentMessages.concat(message));
        console.log('message sent');
      }
    );

    usersService.on('created', user =>
      setUsers(currentUsers => currentUsers.concat(user))
    );
  }, []);

  if (login === undefined) {
    return (
      <main className="container text-center">
        <h1>Loading...</h1>
      </main>
    );
  } else if (login) {
    return <Chat messages={messages} users={users} login={login}/>;
  }

  return <Login/>;
};

export default App;
