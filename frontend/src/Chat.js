import './style/App.scss';
import 'classnames'
import classNames from 'classnames';
import { useRef, useCallback, useState, useEffect } from 'react';

function NewMessageTextArea(props) {
  const maxChars = 255;

  const [isCtrlDown, setIsCtrlDown] = useState(false)
  const [isEnterDown, setIsEnterDown] = useState(false)
  const onKeyDown = (event) => {
    switch (event.keyCode) {
      case 13:
        // enter
        setIsEnterDown(true)
        break;
      
      case 17:
        // ctrl
        setIsCtrlDown(true)
        break;
      
      default:
        break;
    }

    if (isCtrlDown && isEnterDown) {
      if (props.onSubmit != null)
        props.onSubmit()
    }
  }

  const onKeyUp = (event) => {
    switch (event.keyCode) {
      case 13:
        // enter
        setIsEnterDown(false)
        break;
      
      case 17:
        // ctrl
        setIsCtrlDown(false)
        break;
      
      default:
        break;
    }
  }

  const { onSubmitCallback } = props
  useEffect(() => {
    if (isCtrlDown && isEnterDown) {
      if (onSubmitCallback != null) {
        setIsEnterDown(false)
        onSubmitCallback()
      }
    }
  }, [isCtrlDown, isEnterDown, onSubmitCallback])

  return (
    <div className="row new-message-row">
      <div className="col new-message-col">
        <textarea ref={props.textAreaRef} value={props.value} placeholder="Scrivi un messaggio..." onChange={(event) => {
          let newValue = event.target.value.substring(0, maxChars)
          props.setValue(newValue)
        }} onKeyDown={onKeyDown} onKeyUp={onKeyUp}></textarea>
        <span className="counter">{props.value.length}/{maxChars}</span>
      </div>
    </div>
  )
}

function Message({message, currentUser, shouldFocus=false}) {
  let ref = useRef()
  useEffect(() => {
    if (shouldFocus) {
      ref.current.scrollIntoView()
    }
  }, [shouldFocus])

  return (
    <div className={classNames(
      'row',
      'message-row',
      {'own': message.user.username === currentUser}
    )}>
      <div className="col-9 message-col" ref={ref}>
        <div className="row">
          <div className="col user">
            <span>{message.user.username}</span>
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
  const currentUser = 'Giovanni'

  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
    const url = 'http://localhost:8000/message/'

    try {
      const response = await fetch(url)
      const json = await response.json()
      console.log(json)
      const messages = []
      json.forEach((message) => {
        messages.push(message)
      })

      setMessages(messages)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const [newMessageText, setNewMessageText] = useState('')

  const newMessageTextAreaRef = useRef()
  const messageListRef = useRef()

  const onSubmitCallback = useCallback((event) => {
    if (newMessageText.trim() === '')
        return

    // let msg = createMessageData(
    //   Math.floor(Math.random() * 99999999),
    //   currentUser,
    //   newMessageText,
    // )
    // let newMessages = messages.concat(msg)
    // setMessages(newMessages)
    
    setNewMessageText('')
    newMessageTextAreaRef.current.focus()
  }, [messages, newMessageText])

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
              messages.map((message, i) => {
                return (
                  <Message key={message.url} message={message}  currentUser={currentUser} shouldFocus={i === messages.length - 1} />
                )
              })
            }
          </div>
        </div>
        <NewMessageTextArea textAreaRef={newMessageTextAreaRef} value={newMessageText} setValue={setNewMessageText} onSubmitCallback={onSubmitCallback} />
        <div className="row send-message-row">
          <div className="col send-message-col">
            <button className="btn" onClick={onSubmitCallback} disabled={newMessageText.trim() === ''}>Invia</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat