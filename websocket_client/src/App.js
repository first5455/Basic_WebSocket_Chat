import './App.css'
import React, { useEffect, useState } from 'react'
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'

const SOCKET_URL = 'http://localhost:8080/ws-message'
let stompClient

function App() {
    const [userName,setUserName] = useState('')
    const [status, setStatus] = useState('Disconnected')
    const [message, setMessage] = useState([])
    const [typeMessage, setTypeMessage] = useState('')
    const [isRender, setIsRender] = useState(false)

    let connect = () => {
        const socket = new SockJS(SOCKET_URL)
        stompClient = Stomp.over(socket)
        stompClient.connect({}, onConnect)
    }

    let disconnect = () => {
        stompClient.disconnect()
        setStatus('Disconnected')
    }

    let sendMessage = (msg) => {
        if (stompClient != null) {
            stompClient.send('/app/send', {}, JSON.stringify({'author': userName, 'message': msg}))
        }
        setTypeMessage('')
    }

    let onConnect = async () => {
        await stompClient.subscribe('/topic/message', onMessageReceived)
        setStatus('Connected')
    }

    let onMessageReceived = async (payload) => {
        var msg = await JSON.parse(payload.body).message
        var user = await JSON.parse(payload.body).author
        var newMessage = message
        await newMessage.push(
            <div>
                <h2>{user}</h2>
                <p>{msg}</p>
            </div>
        )
        setMessage(newMessage)
        setIsRender(true)
    }

    useEffect(()=>{
        if(isRender === true){
            setIsRender(false)
        }
    },[isRender])

    return (
        <div>
            <h1>NickName : {userName}</h1>
            <input type={'text'} value={userName} onInput={event => {setUserName(event.target.value)}} />
            <p>{status}</p>
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
            <div>{message}</div>
            <input type={'text'} value={typeMessage} onInput={event => {
                setTypeMessage(event.target.value)
            }}
                   onKeyDown={event => {
                       if(event.key === 'Enter') {
                           sendMessage(typeMessage)
                       }
                   } }
            />
            <button key={'b1'} onClick={() => {
                sendMessage(typeMessage)
            }}>Sent
            </button>

        </div>
    )
}

export default App
