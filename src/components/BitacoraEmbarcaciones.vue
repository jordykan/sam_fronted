<template>
  <v-layout align-start>
   
  <v-flex>
        <h2>Bitacora de Embarcaciones</h2>

          <v-container>
            <v-row>
              <v-col cols="3" sm="3">
 <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="mesCaptura"
            label="Fecha de captura"
            prepend-icon="calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="mesCaptura"
          v-on:change="embarcacionChange()"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
    </v-col>
                  
                    <v-col cols="3" sm="3" md="3">
                        <v-autocomplete  
                          v-on:change="embarcacionChange()"
                          v-model="embarcacion" 
                          :items="embarcaciones"
                          label="Embarcacion"></v-autocomplete>
                    </v-col>
                    <v-col cols="3" sm="3" md="3">
                        <v-btn
                              
                              small
                              color="blue-grey"
                              class="ma-2 white--text"
                            
                              @click="guardar"
                            >
                              {{accion}}
                              <v-icon right dark>save</v-icon>
                        </v-btn>
                                      
                    </v-col>
                    
             

            </v-row>
                <template>
                     <v-divider></v-divider>
                </template>
               <v-row>
                   
                <v-col cols="3" sm="3" md="3">
                     <v-autocomplete  v-model="agencia" :items="agencias"  label="Agencia"></v-autocomplete>
                </v-col>
                   <v-col cols="3" sm="3" md="3">
                        <v-datetime-picker label="Fecha y hora de Atraque" locale="es" v-model="atraque"> </v-datetime-picker>
                  </v-col>
                   <v-col cols="3" sm="3" md="3">
                        <v-datetime-picker label="Fecha y hora de Desatraque" locale="es" v-model="desatraque"> </v-datetime-picker>
                  </v-col>


                    
                    <v-col cols="3">
                        <v-text-field
                        label="Estadia "
                        type="number"
                        suffix="horas"
                        v-model="estadia"
                        ></v-text-field>
                    </v-col>      
            </v-row>
             <v-row>
                  <v-col cols="2">
                        <v-text-field
                        label="Embarque PX "
                        type="number"
                        v-model="embarquePx"
                        ></v-text-field>
                    </v-col>      
                   <v-col cols="2" sm="2" md="2">
                          <v-text-field
                        label="Desembarque PX "
                        type="number"
                        v-model="desembarquePx"
                        ></v-text-field>
                  </v-col>
                   <v-col cols="2" sm="2" md="2">
                          <v-text-field
                        label="Folio del Servicio"
                        v-model="folioServicio"
                        ></v-text-field>
                  </v-col>
                  
                    <v-col cols="3" sm="3" md="3">
                          <v-text-field
                        label="Entrada "
                        type="number"
                        suffix="Toneladas"
                        v-model="entrada"
                        ></v-text-field>
                  </v-col>

                    
                     <v-col cols="3" sm="3" md="3">
                          <v-text-field
                        label="Salida "
                        type="number"
                        suffix="Toneladas"
                        v-model="salida"
                        ></v-text-field>
                  </v-col>   
            </v-row>
            
          </v-container>
           <template>
                     <v-divider></v-divider>
                </template>
                <v-data-table
      :search="search"
      :headers="headers"
      :items="bitacoraEmb"
      class="elevation-1"
    >
    
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Bitacora</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-if="verNuevo==0"
              v-model="search"
              append-icon="search"
              label="Busqueda"
              single-line
              hide-details
            ></v-text-field>
        
         
        
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
    
       
        
     
        

      </template>

       
 <template v-slot:item.atraque="{ item }">
          {{  item.atraque | moment("D MMMM YYYY, h:mm:ss a")}}
      </template>
       <template v-slot:item.desatraque="{ item }">
          {{  item.desatraque | moment("MMMM D  YYYY, h:mm:ss a")}}
      </template>
       <template v-slot:item.estadia="{ item }">
        {{item.estadia}} horas
      </template>
     
       <template v-slot:item.entrada="{ item }">
        {{item.entrada}} Ton
      </template>
       <template v-slot:item.salida="{ item }">
        {{item.salida}} Ton
      </template>
     
        
      <template v-slot:no-data>
        <v-btn color="primary" @click="listar()">Resetear</v-btn>
      </template>
    </v-data-table>

     
   

     
  </v-flex>
 </v-layout>
</template>
<script>

import axios from 'axios';
import DatetimePicker from 'vuetify-datetime-picker'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

  export default {
     icons: {
    iconfont: 'fa4',
  },
    data(){
      return{
                  dialog: false,
                  search: '',
                 bitacoraEmb:[],
                headers: [
               { text: 'Actions', value: 'action', sortable: false},
               { text: 'Embarcacion', value: 'embarcacion.nombre', sortable:true},
               { text: 'Agencia', value: 'agencia.nombre', sortable:true},
               { text: 'Folio', value: 'folioServicio', sortable:true},
               { text: 'Atraque', value: 'atraque', sortable:true},
               { text: 'Desatraque', value: 'desatraque', sortable:true},
              { text: 'Estadia', value: 'estadia', sortable:true},
              { text: 'Embarque PAX', value: 'embarquePx', sortable:true},
              { text: 'Desembarque', value: 'desembarquePx', sortable:true},
                { text: 'Entrada', value: 'entrada', sortable:true},
              { text: 'Salida', value: 'salida', sortable:true},
            ],
            
            editedIndex: -1,
            _id:'',
            embarcacion:'5ea997afcc3f5f0e7803f5b0',
            embarcaciones:[],
            agencias:[],
            agencia:'',
            fecha:'', 
            mesCaptura:new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
     
  
            atraque:'',
            desatraque:'',
            estadia:'',
            embarquePx:'',
            desembarquePx:'',
            folioServicio:'',
            entrada:'',
            salida:'',
            usuarioDetalle:[],
            reportCat:'',
            loader: null,
            loading: false,
            embarcacionC:'5ea997afcc3f5f0e7803f5b0',
            tipo:'',
            agencias:[],
            nombre:'',
            agencia2:'',
           
            verNuevo:0,
            usuario:'',
            tipoMovimiento:'',
            detalles:'',
            fecha:'',
            muelles:['FRONTERA','CHILTEPEC','SANCHEZ MAGALLANEZ'],
            estatus:['En Proceso','Aprobados AMLS','Aprobados APITAB','Cancelados'],
            folio:'',
            fecha1:'',
            fecha2:'',
            cambiosGuardia:[],
            estado:'',
            detalles:'',
            usuarioAgencia:[],
            compania:'',
            usuarios:[],
            reportVeh:'',
            muelle:'',
            fechaR1:'',
            agencia:'',
            agencias:[],
            embarcacionDetalle:[],
            estados:['En Proceso','Aprobados por APITAB','Aprobados por AMLS','Cancelados'],
            reportEmb:'',
            fechaR2:'',
            tipoReporte:'',
            tipoRep:'',
            valida:0,
            accion:'Guardar',
            fecha:null,
            validaMensaje:[],
            adModal:0,
            comprobanteModal:0,
            adAccion:0,
            adNombre:'',
            adId:''
      }
    },
          computed: {
          formTitle () {
            return this.editedIndex === -1 ? 'Nueva Solicitud' : 'Editar Solicitud'
          }
        },

        watch: {
          dialog (val) {
            val || this.close()
          }
        },

        created () {
       this.listar()
       this.selectEmbarcaciones()
       this.selectAgencias()
        },
       

        methods: {

        

       

          mostrarNuevo(){
            this.verNuevo =1;

          },
          ocultarNuevo(){
            this.verNuevo =0
            this.limpiar()
          },

             embarcacionChange(){
             this.embarcacionC = this.embarcacion
             this.filtroFecha = this.mesCaptura
             this.listar();
            },
       
guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let dateCaptura = new Date(this.mesCaptura)
      if (this.editedIndex > -1) {
        axios
          .put(
            "bitacoraEmbarcacion/update",
            {
              _id: this._id,
                embarcacion: this.embarcacion,
              agencia: this.agencia,
              atraque: this.atraque,
              desatraque: this.desatraque,
              estadia: this.estadia,
              embarquePx: this.embarquePx,
              desembarquePx: this.desembarquePx,
              folioServicio: this.folioServicio,
              entrada: this.entrada,
              salida: this.salida,
              mesCaptura : dateCaptura
            },
            configuracion
          )
          .then(function(response) {
            swal(
              "Bitacora actualizado",
              "Bitacora actualizado exitosamente",
              "success"
            )
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
           me.close,
           swal(
             "Error",
             "Verifique los datos ingresado",
             "error"
           )
          });
      } else {
        //Nuevo

        axios
          .post(
            "bitacoraEmbarcacion/add",
            {
              embarcacion: this.embarcacion,
              agencia: this.agencia,
              atraque: this.atraque,
              desatraque: this.desatraque,
              estadia: this.estadia,
              embarquePx: this.embarquePx,
              desembarquePx: this.desembarquePx,
              folioServicio: this.folioServicio,
              entrada: this.entrada,
              salida: this.salida,
              mesCaptura : dateCaptura
            },
            configuracion
          )
          .then(function(response) {
            swal(
              "Bitacora agregada",
              "Bitacora agregado exitosamente",
              "success"
            )
            me.listar();
            me.limpiar();
            me.close();
          })
          .catch(function(error) {
            me.close(),
            swal(
              "Error",
              "Verifique los datos ingresados"+error,
              "error"
            )
          });
      }
    },

       

     
          limpiar(){
            this.accion = 'Guardar'
            this.folioServicio = ''
            this.embarquePx = ''
            this.desembarquePx = ''
            this.entrada = ''
            this.salida = ''
            this.estadia =''
            this.atraque = ''
            this.desatraque = '',
            this.agencia = ''
            this.embarcacion = ''
            this.editedIndex=-1;
          },
         
        
           serviciosChange(){
             this.tipoRep = this.tipoReporte 
             this.reporteCategoria = ''
            },

            reporteServiciosChange(){
             this.reportCat = this.reporteCategoria

            },

        
           detallesUsuarios(){
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            let me=this;
            axios.get('usuario/query?_id='+this.usuario,configuracion).then(function (  response){
            me.usuarioDetalle=response.data;
            me.usuarioAgencia=response.data.agencia
            console.log(me.usuarioDetalle)
            }).catch(function(error){
              console.log(error)
            })
          },
          detallesEmbarcacion(){
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            let me=this;
            axios.get('embarcacion/query?_id='+this.embarcacion,configuracion).then(function (response){
            me.embarcacionDetalle=response.data;
            console.log(me.embarcacionDetalle)
            }).catch(function(error){
              console.log(error)
            })
          },

          imprimir(){
 var objeto = document.getElementById("solicitud"); //obtenemos el objeto a imprimir
      var ventana = window.open("", "_blank"); //abrimos una ventana vacía nueva
      ventana.document.write(objeto.innerHTML); //imprimimos el HTML del objeto en la nueva ventana
      ventana.document.close(); //cerramos el documento
      ventana.print(); //imprimimos la ventana
      ventana.close(); //cerramos la ventana
          },

           mostrarComprobante(){
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            var fec = new Date();   
            this.fecha = fec.toLocaleString(); 

            this.fechaR1 = this.fecha1.toLocaleString(); 
            this.fechaR2 = this.fecha2.toLocaleString();
            this.listarDetalles(),
            this.comprobanteModal=1          
          },
           ocultarComprobante(item){
            this.comprobanteModal=0
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

        selectAgencias() {
          let me = this;
          let agencaiArray = [];
          let header = { Token: this.$store.state.token };
          let configuracion = { headers: header };
          axios
            .get("agencia/listActivos", configuracion)
            .then(response => {
              agencaiArray = response.data;
              agencaiArray.map(function(x) {
                me.agencias.push({ text: x.nombre, value: x._id });
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        },

          listar(){
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            let me=this;
            let dateCaptura = new Date(this.mesCaptura).toISOString()
            console.log(dateCaptura)
           axios.get('bitacoraEmbarcacion/list?fecha='+dateCaptura+'&embarcacion='+this.embarcacion,configuracion).then(function (response){
            me.bitacoraEmb=response.data;
            console.log(me.bitacoraEmb)
            }).catch(function(error){
              console.log(error)
            })
          },

           editItem (item) {
             this.accion = 'Editar'
             this.editedIndex = 1
             this._id = item._id
            this.folioServicio = item.folioServicio
            this.embarquePx = item.embarquePx
            this.desembarquePx = item.desembarquePx
            this.entrada = item.entrada
            this.salida = item.salida
            this.estadia = item.estadia
            this.atraque = new Date(item.atraque)
            this.desatraque = new Date(item.desatraque)
            var mesCaptura = new Date(item.mesCaptura)
            //console.log( mesCaptura.toISOString().substring(0, 10))
            this.mesCaptura = mesCaptura.toISOString().substring(0, 10)

            this.agencia = item.agencia._id
            this.embarcacion = item.embarcacion._id

          },


          
       
          selectUsuarios(){
            let me = this;
            let usuarioArray=[];
            let header={"Token":this.$store.state.token};
            let configuracion= {headers: header}
            axios.get('usuario/list',configuracion).then((response)=>{
              usuarioArray=response.data;
              usuarioArray.map(function(x){
                me.usuarios.push({text:x.nombre, value:x._id})
              });
            }).catch(function(error){
              console.log(error);
            })
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
<style>
  #factura {
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 16px ;
        }

        #logo {
            float: left;
            margin-left: 2%;
            margin-right: 2%;
        }
         #logo2 {
           
            margin-left: 80%;
            margin-right: 2%;
        }
        #table_agencia {
           margin-right: 10px;
        }
        #imagen {
            width: 100px;
        }
         #imagen2{
            width: 90px;
        }

        #fact {
            font-size: 14px;
           
            text-align: right;
        }   

        #datos {
            float: left;
            margin-top: 0%;
            margin-left: 15%;
            margin-right: 2%;
            /*text-align: justify;*/
        }

        #encabezado {
            text-align: center;
            margin-left: 10px;
            margin-right: 10px;
            font-size: 16px;
        }

        section {
            clear: left;
        }

      

        #cliente {
            text-align: left;
        }

        #facliente {
            width: 40%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 15px;
        }

        #fa {
            color: #FFFFFF;
            font-size: 14px;
        }

          #fa2 {
            color: #FFFFFF;
            font-size: 14px;
        }

        #facarticulo {
            width: 90%;
            border-collapse: collapse;
            border-spacing: 0;
            padding: 20px;
            margin-bottom: 15px;
            border: .5px solid #ddd;
        }

        #facarticulo thead {
            padding: 20px;
            background: #31467c;
            text-align: center;
            border-bottom: 1px solid #FFFFFF;
        }

         #solicitante {
            width: 60%;
            border-collapse: collapse;
            border-spacing: 1;
            padding: 20px;
            margin-bottom: 15px;
            border: .5px solid #ddd;
        }

         #solicitante thead {
            padding: 20px;
            background: #31467c;
            text-align: center;
            
            border-bottom: 1px solid #FFFFFF;
        }

        #gracias {
            text-align: center;
        }
        #tituloSolicitante{
          background-color: #808285;
          border: 1px solid #ddd;
          color:#FFFFFF
          }
        #tituloPasajeros{
          background-color: #808285;
          border: 1px solid #ddd;
          color:#FFFFFF
       }
</style>