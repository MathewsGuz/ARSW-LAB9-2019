var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
            	var p=JSON.parse(eventbody.body);
//                addPointToCanvas(p);
                alert(p.x +" "+p.y); 
                
            });
        });

    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            
            //websocket connection
            connectAndSubscribe();
//            $(can).click(function (e){
//                var pt = new Point(getMousePosition(e).x,getMousePosition(e).y);
//                addPointToCanvas(pt);
//                stompClient.send("/topic/newpoint", {}, JSON.stringify(pt)); 
//            });
//            can.addEventListener('click', function(evt) {
//                var pt = getMousePosition(evt);
//                app.publishPoint(pt.x, pt.y);
//            });
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            var punto = JSON.stringify(pt);
            console.log(punto);
            stompClient.send("/topic/newpoint", {}, punto);
            addPointToCanvas(pt);
            
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();