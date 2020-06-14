const socket=io();

var vm=new Vue({
    el:'#cont',
    created(){
        socket.on("proc",(msg)=>{
            console.log(msg);
            datosP = JSON.parse(msg);

            var usr = datosP.users;
            var nus = []; 
            var idus = [];

            var mtotal = datosP.memtotal;

            for(var a = 0; a < usr.length; a++){
                nus.push(usr[a].us);
                idus.push(usr[a].id);
            }

       

           

            mj = datosP.proc;
            for (var a = 0; a < mj.length; a++) {
                mj[a].pid = parseInt(mj[a].pid);
                mj[a].ppid = parseInt(mj[a].ppid);
                mj[a].vmsize = parseInt(mj[a].vmsize);
                mj[a].uid = parseInt(mj[a].uid);


                mj[a].porcentaje = Math.trunc( (mj[a].vmsize  / mtotal) * 10000);

                mj[a].porcentaje = mj[a].porcentaje / 100;
                var n = idus.indexOf(mj[a].uid);
                if( n == -1){
                    mj[a].nus = "--";
                }else{
                    mj[a].nus = nus[n];
                }
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
            this.contarprocesos(mj)
            this.procesos = mj;
            
        })
        socket.on("datos",(msg)=>{

            console.log(msg);
            objJSON=JSON.parse(msg);
            this.cpu=objJSON.cpu;

            var ndiv = 1024;

            this.memoriadisponible=objJSON.memavailible/ndiv;
            this.memoriatotal=objJSON.memtotal/ndiv;
            this.memorialibre=objJSON.memfree/ndiv;
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
            this.porcentajeram=((this.memoriatotal-this.memorialibre) / this.memoriatotal)*100
            if(this.arrayram.length==6){
                for(let i=0;i<this.arrayram.length-1;i++){
                    this.arrayram[i]=this.arrayram[i+1];
                }
                this.arrayram[this.arrayram.length-1]=this.porcentajeram
            }else{
                this.arrayram.push(this.porcentajeram)
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
        arrayram:[],
        porcentajeram:0,
        procexe:0,
        procsleep:0,
        proczombie:0,
        proctotal:0,
        procstoped:0,
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
        },
        killprocess(msg){
            console.log("Matando "+msg)
            socket.emit('kill',msg);
        },
        contarprocesos(pr){
            this.procsleep=0;
            this.procexe=0;
            this.procstoped=0;
            this.proctotal=0;
            this.proczombie=0;
            for(let i=0;i<pr.length;i++){
                if(pr[i].state=="S (sleeping)"){
                    this.procsleep++;
                }else if(pr[i].state=="R (running)"){
                    this.procexe++;
                }else if(pr[i].state=="I (idle)"){
                    this.procstoped++;
                }else if(pr[i].state=="Z (zombie)"){
                    this.proczombie++;
                }
            }
            this.proctotal=this.procsleep+this.procexe+this.procstoped+this.proczombie
        }
       
    }
})