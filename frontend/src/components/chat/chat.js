import { useState } from "react"


export default function Chat(props) {
    const [messages, setMessages] = useState(['we'])
    const [newMessageText, setNewMessageText] = useState('')

    const onChange = (event) => {
        setNewMessageText(event.target.value)
    }

    const onSend = (event) => {
        const newMessages = messages.concat(newMessageText)
        setMessages(newMessages)
    }

    return (
        <div className="row">
            <div className="col">
                <div className="row">
                    <div className="col">
                        <textarea className="form-control" onChange={onChange} value={newMessageText}></textarea>
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col">
                        <button className="btn btn-primary" onClick={onSend}>Send</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <ul className="list-group">
                            {messages.map((message, index) => <li key={index} className="list-group-item">{message}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}