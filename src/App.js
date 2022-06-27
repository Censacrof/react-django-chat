import './style/App.scss';
import 'classnames'
import classNames from 'classnames';
import { useRef, useCallback, useState } from 'react';

function NewMessageTextArea(props) {
  const maxChars = 255;

  return (
    <div className="row new-message-row">
      <div className="col new-message-col">
        <textarea ref={props.textAreaRef} value={props.value} placeholder="Scrivi un messaggio..." onChange={(event) => {
          let newValue = event.target.value.substring(0, maxChars)
          props.setValue(newValue)
        }}></textarea>
        <span className="counter">{props.value.length}/{maxChars}</span>
      </div>
    </div>
  )
}

function Message({message, currentSender, innerRef}) {
  return (
    <div className={classNames(
      'row',
      'message-row',
      {'own': message.sender == currentSender}
    )}>
      <div ref={innerRef} className="col-9 message-col">
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
  const currentSender = 'Giovanni'

  const createMessageData = (id, sender, text) => {
    return {id: id, sender: sender, text: text, date: '23 aprile 2022 | 10:53'}
  }

  const [messages, setMessages] = useState([
    createMessageData(0, 'Aldo', 'Vaffangulooooo!'),
    createMessageData(1, 'Giovanni', 'We sta calmino eh'),
    createMessageData(2, 'Giacomo', 'Ma che ohhhhh'),
  ])

  const [newMessageText, setNewMessageText] = useState('')

  const newMessageTextAreaRef = useRef()
  const messageListRef = useRef()

  const sendMessageButtonClick = useCallback((event) => {
    let msg = createMessageData(
      Math.floor(Math.random() * 99999999),
      currentSender,
      newMessageText,
    )
    let newMessages = messages.concat(msg)
    
    setNewMessageText('')
    setMessages(newMessages)
    newMessageTextAreaRef.current.focus()
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight
  })

  return (
    <div className="row chat">
      <div className="col">
        <div className="header row">
          <div className="col">
            <span>Prosalute</span>
          </div>
        </div>
        <div className="row message-list-row">
          <div ref={messageListRef} className="col message-list-col">
            {
              messages.map((message) => {
                return (
                  <Message key={message.id} message={message}  currentSender={currentSender} />
                )
              })
            }
          </div>
        </div>
        <NewMessageTextArea textAreaRef={newMessageTextAreaRef} value={newMessageText} setValue={setNewMessageText}/>
        <div className="row send-message-row">
          <div className="col send-message-col">
            <button onClick={sendMessageButtonClick}>Invia</button>
          </div>
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
