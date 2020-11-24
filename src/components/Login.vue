<template>
    
    <v-layout justify-center>
       
        <v-flex xs12 sm8 md6 lg5 x14>
              <v-flex xs12>
       <v-img
                      class="white--text align-end"
                      height="160px"
                      src="https://i.ibb.co/c1t6rr0/sam-login.png"
                    >
                    </v-img>
   <br><br>
      </v-flex>

            <v-card> 
                
                <v-toolbar class="blue-grey lighten-3">
                       
                <v-toolbar-title>
                    Acceso al Sistema
                </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="email" type="email" autofocus color="accent" label="Email" required></v-text-field>
                    <v-text-field v-model="password" type="password" autofocus color="accent" label="Password" required></v-text-field>
                </v-card-text>
               
                   

                  
                <v-card-actions class="px-3 pb3">
                    <v-flex text-xs-right>
                        <v-btn @click="ingresar" color="primary">Ingresar</v-btn>
                    </v-flex>
                </v-card-actions>

               
                   <v-card-actions class="px-3 pb3">
                    <v-flex text-xs-right>
                       
                        <a href="solicitud.docx" download="formato"> <v-btn text small color="primary">Formato de Solicitud de Cuenta</v-btn></a>
                    </v-flex>
                     <v-flex text-xs-right>
                       
                        <a href="plantilla.csv" download="plantilla.csv"> <v-btn text small color="primary">Plantilla para carga de pasajeros</v-btn></a>
                    </v-flex>
                </v-card-actions>      
            </v-card>
            
        </v-flex>   
        
        
       
      
  
    </v-layout>
        
    
    
  
</template>


    


<script>
import axios from 'axios'
import swal from 'sweetalert'
export default {
    data(){
        return{
            email:'',
            password:'',
            errorM: '',
            snackbar: false,
        }
    },
    methods:{
        ingresar(){
            axios.post('usuario/login',{email:this.email,password:this.password}).
            then(respuesta =>{
                return respuesta.data
            })
            .then(data =>{
                this.$store.dispatch("guardarToken",data.tokenReturn);
                this.$router.push({name:'home'})
            })
            .catch(error =>{
                console.log(error);
               this.errorM=null;
               if(error.response.status==404){
                  swal(
                      "Error",
                      "El usuario no existe, favor de verificar sus datos",
                      "error"
                  )
               }else{
                   this.errorM="Ocurrio un error con el servidor"
               }
            })
        }
    }
}
</script>