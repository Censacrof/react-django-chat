import './style/App.scss'
import Login from './Login';
import Chat from './Chat'
import 'classnames'
import Api from './Api';
import { useState } from 'react';

function App() {
  const api = new Api()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  api.onLogin(() => setIsLoggedIn(true))

  return (
    <div className="App container">
      {isLoggedIn 
        ? (<Chat />)
        : (<Login api={api} />)
      }
    </div>
  );
}

export default App;
