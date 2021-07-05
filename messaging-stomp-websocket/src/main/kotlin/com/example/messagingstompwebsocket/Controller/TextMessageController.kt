package com.example.messagingstompwebsocket.Controller

import com.example.messagingstompwebsocket.Model.TextMessageObj
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class TextMessageController(var template: SimpMessagingTemplate) {

    @PostMapping("/sendapi")
    fun sendMessage(@RequestBody textMessageObj: TextMessageObj): ResponseEntity<TextMessageObj> {
        template.convertAndSend("/topic/message", textMessageObj)
        return ResponseEntity<TextMessageObj>(textMessageObj, HttpStatus.OK)
    }

    @MessageMapping("/send")
    @SendTo("/topic/message")
    fun receiveMessage(@Payload textMessageObj: TextMessageObj): TextMessageObj {
        return textMessageObj
    }
}