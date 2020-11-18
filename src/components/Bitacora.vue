<template>
  <v-layout align-start>
  <v-flex>
    <v-data-table
      :headers="headers"
      :items="cambiosGuardia"
      :search="search"
      class="elevation-1"
      v-if="verNuevo==0"
    >
      <template v-slot:item.estado="{ item }">
         <v-chip small class="ma-2" color="orange" text-color="white"  v-if="item.estado==0">
          <v-avatar left>
            <v-icon small>restore</v-icon>
          </v-avatar>
            En proceso
         </v-chip>

          <v-chip small class="ma-2" color="primary" text-color="white"  v-if="item.estado==1">
          <v-avatar left>
            <v-icon small>done</v-icon>
          </v-avatar>
            Aprobado por AMLS
         </v-chip>
         
         

          <v-chip small class="ma-2" color="red" text-color="white"  v-if="item.estado==2">
          <v-avatar left>
            <v-icon small>cancel</v-icon>
          </v-avatar>
            Anulado
         </v-chip>

          <v-chip small class="ma-2" color="success" text-color="white"  v-if="item.estado==3">
          <v-avatar left>
            <v-icon small>done_all</v-icon>
          </v-avatar>
            Aprobado por API
         </v-chip>

             <v-chip small class="ma-2" color="primary" text-color="white"  v-if="item.estado==4">
          <v-avatar left>
            <v-icon small>verified</v-icon>
          </v-avatar>
           Finalizado
         </v-chip>

      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Pase de Lista </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-if="verNuevo==0" v-model="search" append-icon="search" label="Busqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          
        
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                   
                   
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
                  Aprobar Item
              </v-card-title>
              <v-card-title class="headline" v-if="adAccion==2">
                  Anular Item
              </v-card-title>

              <v-card-text>
                  Estas a punto de 
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="activarDesactivarCerrar()" color="error" small>
                  Cancelar
                </v-btn>
                 <v-btn v-if="adAccion==1" @click="activar()" small color="primary">
                  Aprobar
                </v-btn>
                <v-btn v-if="adAccion==2" @click="desactivar()" small color="orange">
                  Anular
                </v-btn>

              </v-card-actions>

            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        
       

         <template v-if="item.estado==0">
        <v-icon
          small
          @click="activarDesactivarMostrar(1,item)"
        >
          check
        </v-icon>
          <v-icon
          small
          @click="activarDesactivarMostrar(2,item)"
        >
          block
        </v-icon>
        </template>
          <v-icon
        v-if="item.estado==3"
          small
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
         <v-icon
        v-if="item.estado==4"
          small
          class="mr-2"
          @click="editItem(item)"
        >
           search
        </v-icon>
       <template v-if="item.estado==1">
        <v-icon
          small
          @click="activarDesactivarMostrar(2,item)"
        >
          block
        </v-icon>
        </template>
          <template v-if="item.estado==2">
        <v-icon
          small
          @click="activarDesactivarMostrar(1,item)"
        >
          check
        </v-icon>
        </template>
      
       

      </template>
   
    <template v-slot:item.fecha="{ item }">
          {{  item.fecha.join(' al ')}}
      </template>

    

      <template v-slot:item.folio="{ item }">
          CG{{  item.folio}}
      </template>

        <template v-slot:item.hora_embarque="{ item }">
          {{  item.hora_embarque | moment("dddd Do MMMM YYYY, h:mm:ss a")}}
      </template>
      
        <template v-slot:item.px_total="{ item }">
          {{  item.pasajeros.length}}
      </template>
      

      <template v-slot:no-data>
        <v-btn color="primary" @click="listar()">Resetear</v-btn>
      </template>
    </v-data-table>

    <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
    
           
         
          
         
        

             <v-flex xs12 sm12 md12 lg12 xl12>
               <template>
                

                   <header>
                      <link
                        rel="stylesheet"
                        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                        crossorigin="anonymous"
                      />
                    </header>

                    <table class="table table-sm"> 
                             
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Nombre Completo</th>
                                  <th scope="col">Identificacion</th>
                                  <th scope="col">NSS</th>
                                  <th scope="col">Destino</th>
                                  <th scope="col">Estatus</th>
                             
                             
                                  
                                  
                                </tr>
                              </thead>
                              <tbody v-for="(det, index) in pasajeros" :key="det._id">
                                 <tr >   
                                          <td>{{index+1}}</td>
                                          <td>{{det.nombreCompleto}}</td>
                                          <td>{{det.identificacion}}</td>
                                          <td>{{det.nss}}</td>
                                          <td>{{det.destino}}</td>
                                          <td>
                                              <v-radio-group v-model="det.estado">
              
                  <v-radio v-if="operacion==='Embarque'" value="Embarcó">
                    <template v-slot:label>
                      <div><strong class="success--text">Embarcó</strong></div>
                    </template>
                  </v-radio>
                
                   <v-radio v-if="operacion=='Embarque'" value="No Embarcó">
                    <template v-slot:label>
                      <div><strong class="warning--text">No Embarcó</strong></div>
                    </template>
                  </v-radio>
                

                     <v-radio v-if="operacion==='Desembarque'" value="Desembarcó">
                    <template v-slot:label>
                      <div><strong class="success--text">Desembarco</strong></div>
                    </template>
                  </v-radio>
                
                   <v-radio v-if="operacion=='Desembarque'" value="No Desembarcó">
                    <template v-slot:label>
                      <div><strong class="warning--text">No Desembarco</strong></div>
                    </template>
                  </v-radio>
                
                  
                </v-radio-group>
                                          </td>
                                         
                                        
                                  </tr>
                                  
                              </tbody>
                             
                                
                            </table>

               </template>
            </v-flex>
             <v-flex xs12 sm2 md12 lg12 xl12>
            
             <v-btn class="ma-2"  @click.native="ocultarNuevo()" outlined color="red">Salir</v-btn>
<v-dialog v-model="modalHoraEmbarque" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="estado==3"
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Guardar
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Confirmar pase de lista</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                        <v-datetime-picker label="Fecha y Hora" locale="es" v-model="hora_embarque"> </v-datetime-picker>
              </v-col>
           
            
            </v-row>
          </v-container>
          <small>*ingresar la hora y fecha del embarque de pasajeros</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  color="blue darken-1" text @click="modalHoraEmbarque = false">Cerrar</v-btn>
          <v-btn  color="blue darken-1" text @click="guardar">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
              
             </v-flex>


        </v-layout>
    </v-container>

  </v-flex>


  </v-layout>

  
</template>
<script>
import axios from 'axios';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import 'font-awesome/css/font-awesome.min.css' // Ensure you are using css-loader
import swal from 'sweetalert'
  export default {
     icons: {
    iconfont: 'fa4',
  },
    data(){
      return{
                  dialog: false,
                  search: '',
                 cambiosGuardia:[],
                headers: [
               { text: 'Actions', value: 'action', sortable: false},
               { text: 'Usuario', value: 'usuario[0].nombre', sortable:true},
               { text: 'Folio', value: 'folio', sortable:true},
               { text: 'Origen', value: 'muelle', sortable:true},
               { text: 'E/D', value: 'operacion', sortable:true},
               { text: 'Fecha', value: 'fecha', sortable:false},
               { text: 'Embarcacion', value: 'embarcacion.nombre',sortable:false},
               { text: 'Estado', value: 'estado',sortable:true},
               { text: 'Total PX', value: 'px_total',sortable:true},
               { text: 'Pase de Lista', value: 'hora_embarque',sortable:true},
            ],  
            editedIndex: -1,
            _id:'',
            embarcacion:'',
            embarcaciones:[],
            modalHoraEmbarque:false,
            nombreCompleto:'',
            coleccionPrueba:[1,3,4,5],
            agencias:[],
            nombre:'',
            agencia2:'',
            cabeceraDetalles:[
               { text: '#', value: 'indice' },
              { text: 'Nombre Completo', value: 'nombreCompleto' },
              { text: 'RFC', value: 'rfc' },
              { text: 'Identificacion', value: 'identificacion' },
              { text: 'NSS', value: 'nss' },
              { text: 'Destino', value: 'destino' },
              { text: 'Embarque/Desembarque', value: 'estatus' },
              { text: 'Estatus', value: 'estado' },
           
            ],
            pasajeros:[],
            verNuevo:0,
            verDetallee:0,
            fecha:'',
            estado:'',
            detalles:'',
            operacion:'',
            estado:'',
            valida:0,
            validaMensaje:[],
            adModal:0,
            hora_embarque:'',
            adAccion:0,
            adNombre:'',
            adId:''
      }
    },
          computed: {
          formTitle () {
            return this.editedIndex === -1 ? 'Nueva Embarcacion' : 'Editar Embarcacion'
          }
        },

        watch: {
          dialog (val) {
            val || this.close()
          }
        },

        created () {
          this.listar();
          this.selectEmbarcaciones();
          this.selectAgencias();
        },

        methods: {
          mostrarNuevo(){
            this.verNuevo =1;
          },
          ocultarNuevo(){
            this.verNuevo =0
            this.limpiar()
          },

          eliminarPasajero(arr,item){ 
            let i=arr.indexOf(item);
            if(i!= -1){
              arr.splice(i,1);
            }
          },

          selectEmbarcaciones(){
            let me = this;
            let embarcacionArray=[];
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            axios.get('embarcacion/list',configuracion).then((response)=>{
              embarcacionArray=response.data;
              embarcacionArray.map(function(x){
                me.embarcaciones.push({text:x.nombre, value:x._id})
              });
            }).catch(function(error){
              console.log(error);
            })
          },

       
           selectAgencias(){
            let me = this;
            let agencaiArray=[];
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            axios.get('agencia/list',configuracion).then((response)=>{
              agencaiArray=response.data;
              agencaiArray.map(function(x){
                me.agencias.push({text:x.nombre, value:x._id})
              });
            }).catch(function(error){
              console.log(error);
            })
          },


          validar(){
            this.valida=0;
            this.validaMensaje=[];
            if(!this.rol){
              this.validaMensaje.push('El rol es obligatorio');
            }
            if(this.empresa.length<1 || this.empresa.length>30){
              this.validaMensaje.push('El nombre de la empresa debe tener entre 1 y 30 caracteres');
            }
            if(this.nombre.length<1 || this.nombre.length>50){
              this.validaMensaje.push('El nombre del usuario debe tener entre 1 y 50 caracteres');
            }
             if(this.email.length<1 || this.email.length>50){
              this.validaMensaje.push('El email debe tener entre 1 y 50 caracteres');
            }
             if(this.password.length<1 || this.password.length>64){
              this.validaMensaje.push('El password debe tener entre 1 y 64 pasajeros');
            }
           

           
           
            if(this.validaMensaje.length){
              this.valida=1;
            }
            return this.valida;
          },

          agregarDetalle(){
            this.pasajeros.push(
              {
                nombreCompleto: '',
                identificacion: '',
                libretaMar: '',
                destino:''
              }
            )
          },
          limpiar(){
            this._id=''
            this.usuario='',
            this.agencia='',
            this.fecha='',

            this.pasajeros=[],
          
            this.valida=0,
            this.validaMensaje=[],
            this.editedIndex=-1;
            this.verDetallee=0;
          },
          guardar(){
            let me=this;
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
          
           
              if(this.editedIndex >-1 ){
              
                axios.put('cambioGuardia/updatePassengers',
                {
                    '_id':this._id,

                    'pasajeros':this.pasajeros,
                    'hora_embarque':this.hora_embarque
                   
                    
               },configuracion)
               .then(function(response){
                  swal(
          "Lista de Pasajeros",
          "La lista de pasajeros ha sido agregada",
          "success"
        )
                    me.close();
                    me.ocultarNuevo();
                    me.listar();
               }).catch(function(error){
                 console.log(error)
               });
              }else{
                axios.post('cambioGuardia/add',
                {
                  
                    'embarcacion':this.embarcacion,
                    'usuario':this.$store.state.usuario._id,
                    'detalles':this.detalles,
                    'agencia':this.agencia,
                    'fecha':this.fecha,
                    'pasajeros':this.pasajeros,
                    'detalles':this.detalles
                    
               },configuracion)
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
            axios.get('cambioGuardia/listBitacora',configuracion).then(function (response){
            me.cambiosGuardia=response.data;
           
            }).catch(function(error){
              console.log(error)
            })
          },

          listarDetalles(id){
            let me=this;
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            axios.get('cambioGuardia/query?_id='+id,configuracion).then(function (response){
            me.pasajeros=response.data.pasajeros;
            var index = me.cambiosGuardia.findIndex(std=> std._id === '5f2c71e4e044d700239a3e32');
            console.log
            }).catch(function(error){
              console.log(error)
            })
          },

          verGuardia(item){
            this.limpiar();
            this.fecha = item.fecha
            this.folio = item.folio
            this.detalles = item.detalles
            this.listarDetalles(item._id);
            this.verNuevo=1;
            this.verDetallee=1;
          },

          editItem (item) {
              this.limpiar();
            this.fecha = item.fecha
            this.folio = item.folio
            this.detalles = item.detalles
            this.operacion = item.operacion
             this.muelle = item.muelle
            this.embarcacion = item.embarcacion._id
            this.listarDetalles(item._id);
            this.verNuevo=1;
            this._id=item._id;
            this.folio = item.folio
            this.fecha = item.fecha
            this.detalles = item.detalles
            this.editedIndex=1;
            this.estado = item.estado;
            this.dialog = false
            this.verNuevo=1
          },

        activarDesactivarMostrar(){
          this.adModal=1;
         
        },
        activar(){
          let me=this;
           let header={"Token":this.$store.state.token};
           let configuracion= {headers: header}
           axios.put('cambioGuardia/activate',{'_id':this.adId,'aprobacionAmls':this.$store.state.usuario.nombre},configuracion)
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
           console.log(this.$store.state.usuario.nombre)
           let configuracion= {headers: header}
           axios.put('cambioGuardia/deactivate',{'_id':this.adId,'aprobacionAmls':this.$store.state.usuario.nombre},configuracion)

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