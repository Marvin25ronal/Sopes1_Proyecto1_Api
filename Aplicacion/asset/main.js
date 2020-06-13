const socket=io();

var vm=new Vue({
    el:'#cont',
    created(){
        socket.on("proc",(msg)=>{
            console.log(msg);
            datosP = JSON.parse(msg);


            mj = datosP.proc;
            for (var a = 0; a < mj.length; a++) {
                mj[a].pid = parseInt(mj[a].pid);
                mj[a].ppid = parseInt(mj[a].ppid);
                //mj[a].vmsize = parseInt(mj[a].vmsize);
            }

            var len = mj.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - 1; j++) {
                    if (mj[j].pid > mj[j + 1].pid) {
                        var tmp = mj[j];
                        mj[j] = mj[j + 1];
                        mj[j + 1] = tmp;
                    }
                }
            }
            
            this.procesos = mj;
            
        })
        socket.on("datos",(msg)=>{

            console.log(msg);
            objJSON=JSON.parse(msg);
            this.cpu=objJSON.cpu;
            this.memoriadisponible=objJSON.memavailible/1000000;
            this.memoriatotal=objJSON.memtotal/1000000;
            this.memorialibre=objJSON.memfree/1000000;
            if(this.arraycpu.length==5){
                this.arraycpu[0]=this.arraycpu[1];
                this.arraycpu[1]=this.arraycpu[2];
                this.arraycpu[3]=this.arraycpu[4];
                this.arraycpu[5]=this.cpu;
            }else{
                this.arraycpu.push(this.cpu);
            }
            if(this.arraymemoriadisponible.length==6){
                for(let i=0;i<this.arraymemoriadisponible.length-1;i++){
                    this.arraymemoriadisponible[i]=this.arraymemoriadisponible[i+1];
                }
                this.arraymemoriadisponible[this.arraymemoriadisponible.length-1]=this.memoriadisponible;
            }else{
                this.arraymemoriadisponible.push(this.memoriadisponible)
            }

            if(this.arraymemorialibre.length==6){
                for(let i=0;i<this.arraymemoriadisponible.length-1;i++){
                    this.arraymemorialibre[i]=this.arraymemorialibre[i+1];
                }
                this.arraymemorialibre[this.arraymemorialibre.length-1]=this.memorialibre;
            }else{
                this.arraymemorialibre.push(this.memorialibre)
            }
           
        })
        
    },
    data:{
        objJSON:'hola',
        cpu:0,
        arraycpu:[],
        memoriadisponible:0,
        arraymemoriadisponible:[],
        memoriatotal:0,
        memorialibre:0,
        arraymemorialibre:[],
        arbol:[],
        procesos:[
         
        ]
    },
    methods:{
        terminarproceso(){
            //console.log("hola")
            socket.emit('matar',"proceso")
        },
        refrescarproceso(){
            //this.cpu=5;
            console.log("mandando datos")
            socket.emit('getdatos',"datos")
        },
        pedirtabla(){
            console.log("pidiendo tabla")
            socket.emit('getproc','proc')
        }
       
    }
})