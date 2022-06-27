import './style/App.scss';
import 'classnames'
import classNames from 'classnames';

function Message({message}) {
  return (
    <div className={classNames(
      'row',
      'message-row',
      {'own': message.own}
    )}>
      <div className="col-9 message-col">
        <div className="row">
          <div className="col sender">
            <span>{message.sender}</span>
          </div>
        </div>
        <div className="row">
          <div className="col text">
            <span>{message.text}</span>
          </div>
        </div>
        <div className="row">
          <div className="col date">
            <span>{message.date}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Chat() {
  const createMessageData = (id, sender, text, own) => {
    return {id: id, sender: sender, text: text, date: '23 aprile 2022 | 10:53', own: own}
  }

  const messages = [
    createMessageData(0, 'Aldo', 'Vaffangulooooo!', false),
    createMessageData(1, 'Giovanni', 'We sta calmino eh', true),
    createMessageData(2, 'Giacomo', 'Ma che ohhhhh', false),
  ]

  return (
    <div className="row chat">
      <div className="col">
        <div className="header row">
          <div className="col">
            <span>Prosalute</span>
          </div>
        </div>
        <div className="message-list">
          {
            messages.map((message) => {
              return (
                <Message key={message.id} message={message} />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="App container">
      <Chat />
    </div>
  );
}

export default App;
