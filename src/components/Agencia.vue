
<template>
  <v-layout align-start>
  <v-flex>
    <v-data-table
      :headers="headers"
      :items="agencias"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.estado="{ item }">
        <v-card-text v-if="item.estado" class="blue--text">Activo</v-card-text>
        <v-card-text v-if="!item.estado" class="red--text">Inactivo</v-card-text>
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Agencia</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Busqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" @click="limpiar" v-on="on">Nueva Agencia</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="nombre" label="Nombre o Razón Social"></v-text-field>
                        </v-col>
                         <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="rfc" label="RFC"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="email" label="E-mail"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="representante" label="Nombre del representante Legal"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="folio" label="Folio"></v-text-field>
                        </v-col>
                        
              

                        <v-col cols="12" sm="6" md="12" v-show="valida">
                          <div class="red--tex" v-for="v in validaMensaje" :key="v" v-text="v">
                      
                          </div>   
                        </v-col>
                                       
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                   <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="adModal" max-width="290">
            <v-card>
              <v-card-title class="headline" v-if="adAccion==1">
                  Activar Item
              </v-card-title>
              <v-card-title class="headline" v-if="adAccion==2">
                  Desactivar Item
              </v-card-title>

              <v-card-text>
                  Estas a punto de <span v-if="adAccion==1">Activar</span>
                  <span v-if="adAccion==2">Desactivar</span> la Agencia {{adNombre}}
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="activarDesactivarCerrar()" color="green" small>
                  Cancelar
                </v-btn>
                 <v-btn v-if="adAccion==1" @click="activar()" color="blue" small>
                  Activar
                </v-btn>
                <v-btn v-if="adAccion==2" @click="desactivar()" color="red" small>
                  Desactivar
                </v-btn>

              </v-card-actions>

            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
        <template v-if="item.estado">
        <v-icon
          small
          @click="activarDesactivarMostrar(2,item)"
        >
          block
        </v-icon>
        </template>
          <template v-else>
        <v-icon
          small
          @click="activarDesactivarMostrar(1,item)"
        >
          check
        </v-icon>
        </template>
        
     
        

      </template>

          <template v-slot:item.pdf="{ item }">
        <v-icon
          
          class="mr-2"
          @click="download(item)"
        >
          save_alt
        </v-icon>
      </template>

     
        
      <template v-slot:no-data>
        <v-btn color="primary" @click="listar()">Resetear</v-btn>
      </template>
    </v-data-table>
  </v-flex>
  </v-layout>
</template>
<script>
'use strict'
import axios from 'axios';
import fileDownload from 'js-file-download'
import 'font-awesome/css/font-awesome.min.css' // Ensure you are using css-loader
import fs from 'fs'

  export default {
     icons: {
    iconfont: 'fa4',
  },
    data(){
      return{
                  dialog: false,
                  search: '',
                  agencias:[],
                headers: [
               { text: 'Actions', value: 'action', sortable: false},
              { text: 'Folio', value: 'folio', sortable: false},
               { text: 'Nombre', value: 'nombre', sortable:true},
               { text: 'RFC', value: 'rfc', sortable:true},
               { text: 'Representante', value: 'representante', sortable:true},
               { text: 'E-Mail', value: 'email', sortable:true},
               { text: 'Direccion', value: 'direccion', sortable:true},
              
            ],
            editedIndex: -1,
            _id:'',
            nombre:'',
            rfc:'',
            representante:'',
            folio:'',
            direccion:'',
            email:'',
            valida:0,
            validaMensaje:[],
            adModal:0,
            adAccion:0,
            adNombre:'',
               adjunto:[],
        archivo:'',
            adId:''
      }
    },
          computed: {
          formTitle () {
            return this.editedIndex === -1 ? 'Nueva Agencia' : 'Editar Agencia'
          }
        },

        watch: {
          dialog (val) {
            val || this.close()
          }
        },

        created () {
          this.listar()
        },

        methods: {

      

          validar(){
            this.valida=0;
            this.validaMensaje=[];
            if(this.nombre.length<1){
              this.validaMensaje.push('El nombre es obligatorio');
            }
            if(this.rfc.length<1){
              this.validaMensaje.push('El RFC es obligatorio');
            }
            if(this.representante.length<1){
              this.validaMensaje.push('El representante es obligatorio');
            }
            
            if(this.folio.length<1){
              this.validaMensaje.push('El folio es obligatorio');
            }
            return this.valida;
          },

          limpiar(){
            this._id='',
            this.nombre='',
            this.rfc='', 
            this.representante='',
            this.email='',
            this.direccion='',
            this.folio='',
            this.validaMensaje=[],
            this.editedIndex=-1;
          },
          guardar(){
            let me=this;
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
         

             if(this.editedIndex >-1 ){    
                axios.put('agencia/update',{'_id':this._id,'folio':this.folio,'rfc':this.rfc,'nombre':this.nombre,'representante':this.representante,'direccion':this.direccion,'email':this.email},configuracion)
               .then(function(response){
                 me.limpiar();
                 me.close();
                 me.listar();

               })
               .catch(function(error){
                 console.log(error)
               });
             }else{
                
                axios.post('agencia/add',{'nombre':this.nombre,'rfc':this.rfc,'representante':this.representante,'folio':this.folio,'direccion':this.direccion,'email':this.email},configuracion)
               .then(function(response){
                 me.limpiar();
                 me.close();
                 me.listar();
               
               }).catch(function(error){
                 console.log(error)
               });
               }
               
               
             
          },
          listar(){
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            let me=this;
            axios.get('agencia/list',configuracion).then(function (response){
            me.agencias=response.data;
            }).catch(function(error){
              console.log(error)
            })
          },

       

          editItem (item) {
            this._id=item._id;
            this.nombre=item.nombre;
            this.rfc=item.rfc;
            this.representante=item.representante;
            this.folio=item.folio
            this.direccion=item.direccion
            this.email=item.email
            this.editedIndex=1;
            
            this.dialog = true
          },

        activarDesactivarMostrar(accion,item){
          this.adModal=1;
          this.adNombre=item.nombre;
          this.adId=item._id;
          if(accion==1){
            this.adAccion=1
          }else if(accion==2){
            this.adAccion=2
          }else{
            this.adMmodal=0;
          }
        },
        activar(){
          let me=this;
           let header={"Token":this.$store.state.token};
           let configuracion= {headers: header}
           axios.put('agencia/activate',{'_id':this.adId},configuracion)
               .then(function(response){
                 me.adModal=0,
                 me.adAccion=0,
                 me.adNombre='',
                 me.adId='',
                 me.listar();
               }).catch(function(error){
                 console.log(error)
               });
        },

        desactivar(){
          let me=this;
           let header={"Token":this.$store.state.token};
           let configuracion= {headers: header}
           axios.put('agencia/deactivate',{'_id':this.adId},configuracion)
               .then(function(response){
                 me.adModal=0,
                 me.adAccion=0,
                 me.adNombre='',
                 me.adId='',
                 me.listar();
               }).catch(function(error){
                 console.log(error)
               });
        },
        activarDesactivarCerrar(){
          this.adModal=0;
        },

          close () {
            this.dialog = false
          },

         
        }
  }
</script>