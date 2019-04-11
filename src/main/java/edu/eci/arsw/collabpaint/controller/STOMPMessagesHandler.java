/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.collabpaint.controller;

import edu.eci.arsw.collabpaint.model.Point;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 *
 * @author 2108263
 */
@Controller
public class STOMPMessagesHandler {
    @Autowired
    SimpMessagingTemplate msgt;
    
    private ConcurrentHashMap<String, ConcurrentLinkedQueue> polygon = new ConcurrentHashMap<>();
    
    @MessageMapping("/newpoint.{numdibujo}")    
    public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:"+pt);
        
        msgt.convertAndSend("/topic/newpoint"+numdibujo, pt);
        if(!polygon.containsKey(numdibujo)){
            System.out.println("Nuevo poligono en construccion");
            polygon.put(numdibujo, new ConcurrentLinkedQueue<Point>());
            polygon.get(numdibujo).add(pt);
        }else{
            polygon.get(numdibujo).add(pt);
            if(polygon.get(numdibujo).size() >= 3){
                System.out.println("ultimo punto para generar polygono:"+pt);
                msgt.convertAndSend("/topic/newpolygon." + numdibujo, polygon.get(numdibujo));
            }
        }
        
    }
}

