const socket=io();

new Vue({
    el:'#cont',
    created(){
        socket.on("matado",function(msg){
            console.log(msg)
        })
    },
    data:{
        procesos:[
            {
                pdi:1,
                nombre:"n",
                usuario:"uer",
                estado:"est",
                ram:"10"
            }
        ]
    },
    methods:{
        terminarproceso(){
            console.log("hola")
            socket.emit('matar',"proceso")
        }
    }
})