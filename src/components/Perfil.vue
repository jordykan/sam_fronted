<template>
  <v-layout align-start>
    <v-flex>
       

        <template>
             <v-dialog v-model="dialog" max-width="500px">
            
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                    
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="password" type="password" label="Password" id="password" name="password" class="form-control" :class="{ 'is-invalid': submited && $v.password.$error }" ></v-text-field>
                               <div v-if="submited && $v.password.$error" class="invalid-feedback">
                                    <span style="color:#FF0000" v-if="!$v.password.required">Contraseña es requerida</span>
                                    <span style="color:#FF0000" v-if="!$v.password.minLength">Contraseña debe tener mas de 8 caracteres</span>
                                </div> 
                      </v-col>
                        <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="repeatPassword" type="password" label="Confirmar Password" ></v-text-field>
                          <div v-if="submited && $v.repeatPassword.$error">
                                  <h4 v-if="!$v.repeatPassword.sameAsPassword" style="color:#FF0000"> <strong style="color:#FF0000">Error</strong> Contraseña no coincide</h4>
                               
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
  <v-card
   
    class="my-5"
    max-width="374"
  >
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>
      <v-row justify="center">
            <v-menu
              bottom
              min-width="200px"
              rounded
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  x-large
                  v-on="on"
                >
                  <v-avatar
                    color="brown"
                    size="48"
                  >
                    <span class="white--text headline"></span>
                  </v-avatar>
                </v-btn>
              </template>
              <v-card>
                <v-list-item-content class="justify-center">
                  <div class="mx-auto text-center">
                    <v-avatar
                      color="brown"
                    >
                      <span class="white--text headline"></span>
                    </v-avatar>
                   
                  </div>
                </v-list-item-content>
              </v-card>
            </v-menu>
          </v-row>

    <v-card-title>{{usuario.nombre}}</v-card-title>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
     
        <div class="grey--text ml-4">
         Dirección: <strong> {{usuario.direccion}}</strong>
        </div>
      
      </v-row>
            <v-row
        align="center"
        class="mx-0"
      >
     
        <div class="grey--text ml-4">
         Correo: <strong> {{usuario.email}}</strong>
        </div>
     
      </v-row>

           <v-row
        align="center"
        class="mx-0"
      >
     
        <div class="grey--text ml-4">
         Telefono: <strong> {{usuario.telefono}}</strong>
        </div>
     
      </v-row>



     

    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title></v-card-title>

    <v-card-text>
 
    </v-card-text>

    <v-card-actions>
      
      
           <v-btn
        color="deep-purple lighten-2"
        text
        @click="editItem()"
      >
        Cambiar contraseña
      </v-btn>
       
        
    
   
    </v-card-actions>
  </v-card>
</template>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import "font-awesome/css/font-awesome.min.css"; // Ensure you are using css-loader
import { required, sameAs, minLength } from 'vuelidate/lib/validators'
import swal from 'sweetalert'

export default {
  components: {},
  icons: {
    iconfont: "fa4"
  },
  validations:{
    password:{
      required,
      minLength: minLength(8)
    },
    repeatPassword:{
      required,
      sameAsPassword: sameAs('password')
    }

  },
  data() {
    return {
      dialog: false,
      search: "",
      pasajeros: [],
      inicial : '',
      editedIndex: -1,
      submited:false,
      password:'',
      repeatPassword:'',
      _id: "",
      email:'',
      usuario:[],
      nombre_completo: "",
      rfc: "",
      numero_libreta: "",
      nss: "",
      compania: "",
      companias: [],
      puesto: "",
      eslora: "",
      manga: "",
      nombreArchivo: "",
      file: "",
      calado: "",
      valida: 0,
      agencia: "",
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: ""
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Pasajero" : "Cambiar Contraseña";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.listar();
    this.selectCompanias();
  },

  methods: {
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.rfc.length < 1) {
        this.validaMensaje.push("El RFC es obligatorio");
      }
      if (this.nombre_completo.length < 1) {
        this.validaMensaje.push("El Nombre completo es obligatorio");
      }
      if (this.numero_libreta.length < 1) {
        this.validaMensaje.push("La libreta de mar es obligatoria");
      }
      if (this.nss.length < 1) {
        this.validaMensaje.push("El Numero de Seguro Social es obligatorio");
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },

    limpiar() {
      (this._id = ""),
        (this.rfc = ""),
        (this.nombre_completo = ""),
        (this.numero_libreta = ""),
        (this.nss = ""),
        (this.validaMensaje = []),
        (this.editedIndex = -1);
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
    
      if (this.editedIndex > -1) {
                  this.submited = true
                  this.$v.$touch();
                  if(this.$v.$invalid){
                   
                    return false
                  }
        axios
          .put(
            "usuario/updatePassword",
            {
              _id: this.$store.state.usuario._id,
              password: this.password
            },
            configuracion
          )
          .then(function(response) {
            swal(
              "Contraseña actualizada",
              "Contraseña Actualizada",
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
             "Verifique los datos ingresado"+error,
             "error"
           )
          });
      } else {
        //Nuevo
                  this.submited = true
                  this.$v.$touch();
                  if(this.$v.$invalid){
                    swal(
                      "Error",
                      "Verifique los datos",
                      "error"
                    )
                    return false
                  }
        axios
          .post(
            "usuario/updatePassword",
            {
              password: this.password,
            },
            configuracion
          )
          .then(function(response) {
            swal(
              "Pasajero agregado",
              "Pasajero agregado exitosamente",
              "success"
            )
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            me.close(),
            swal(
              "Error",
              "Verifique los datos ingresados",
              "error"
            )
          });
      }
    },
    listar() {
        let header={"Token":this.$store.state.token};
        let configuracion= {headers: header}
        let me=this;
        axios.get('usuario/query?_id='+this.$store.state.usuario._id,configuracion).then(function (response){
          me.usuario=response.data;
          console.log(me.usuario)
        }).catch(function(error){
          console.log(error)
        })
    },

 editItem() {
     
      this.editedIndex = 1;
      this.dialog = true;
    },

    selectCompanias() {
      let me = this;
      let companiaArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get(
          "companias/list?agencia=" + this.$store.state.usuario.agencia,
          configuracion
        )
        .then(response => {
          companiaArray = response.data;
          companiaArray.map(function(x) {
            me.companias.push({ text: x.razon_social, value: x.razon_social });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.nombre_completo;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adMmodal = 0;
      }
    },
    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("embarcacion/activate", { _id: this.adId }, configuracion)
        .then(function(response) {
          (me.adModal = 0),
            (me.adAccion = 0),
            (me.adNombre = ""),
            (me.adId = ""),
            me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("embarcacion/deactivate", { _id: this.adId }, configuracion)
        .then(function(response) {
          (me.adModal = 0),
            (me.adAccion = 0),
            (me.adNombre = ""),
            (me.adId = ""),
            me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },

    close() {
      this.dialog = false;
    }
  }
};
</script>