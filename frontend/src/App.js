import './style/App.scss'
import Login from './Login';
import Chat from './Chat'
import 'classnames'
import { getApiInstance } from './Api';
import { useState } from 'react';

function App() {
  const api = getApiInstance()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  api.onLogin(() => {
    setIsLoggedIn(true)
    console.log(api)
  })

  return (
    <div className="App container">
      {isLoggedIn 
        ? (<Chat />)
        : (<Login />)
      }
    </div>
  );
}

export default App;
