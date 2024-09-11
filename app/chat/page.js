'use client'
import { useState } from "react";
import { Box, Stack, Typography, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Footer from "../components/Footer";
import "@/app/css/Chat.css";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi, I'm your personal AI Wingman, how can I assist you today?`,
    }
  ])

  const [message, setMessage] = useState('')

  const sendMessage = async() => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content: ""},
    ])
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
    <>
      <div className="main-ctr">
        {/* <Typography variant="h6">Note: Message the AI Wingman, "can we get a little freaky..."</Typography> */}
        <Stack
          direction={"column"}
          width="80%"
          height="70%"
          className="chatbot-ctr"
          top={"-1vh"}
          // border="1px solid black"
          borderRadius={3}
          p={5}
          m={5}
          spacing={3}
          position={"absolute"} 
              // bgcolor="white"
              > 
              <h6 className="note">Note: Message the AI Wingman, "can we get a little freaky..." to turn on the erotic mode.</h6>
            <Stack
              direction={"column"} 
              spacing={2}
              flexGrow={1}
              overflow="auto"
              maxHeight="70vh"
            >
              {messages.map((message, index) => (
                <Box 
                key={index} 
                display="flex" 
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
                >
                  <Box
                    bgcolor={
                      message.role === 'assistant' ? 'rgb(8, 73, 201)' : 'rgb(110, 26, 81)'
                    }
                    position={"relative"}
                    color="white"
                    borderRadius={10}
                    p={2}
                    fontSize={12}
                    mr={5}
                    maxWidth={700}
                    >
                    {message.content}
                  </Box>
                </Box>
              ))}
            </Stack>
            <Stack direction={"row"} spacing={2} >
              <TextField 
                color="secondary"  
                label="Message"  
                fullWidth 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}  
                
                />
              <Button bgcolor="secondary" size="large" variant="contained" endIcon={<SendIcon />} onClick={sendMessage}>Send</Button>
            </Stack>
          </Stack>
        <Footer />
      </div>
    </>
  )
} 
