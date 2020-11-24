<template>
  <v-layout align-start>
    <v-flex>
       

        <template>
  <v-card
    :loading="loading"
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
         Dirección: <strong> {{usuario.direccion}}</strong>
        </div>
      
      </v-row>



      <div class="my-4 subtitle-1">
       <strong>{{usuario.email}}</strong>
      </div>

      <div>{{usuario.telefono}}</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-title></v-card-title>

    <v-card-text>
 
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="deep-purple lighten-2"
        text
        @click="reserve"
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

import swal from 'sweetalert'

export default {
  components: {},
  icons: {
    iconfont: "fa4"
  },
  data() {
    return {
      dialog: false,
      search: "",
      pasajeros: [],
      inicial : '',
      editedIndex: -1,
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
      return this.editedIndex === -1 ? "Nuevo Pasajero" : "Nueva Embarcación";
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
        axios
          .put(
            "pasajeros/update",
            {
              _id: this._id,
              rfc: this.rfc,
              nombre_completo: this.nombre_completo,
              numero_libreta: this.numero_libreta,
              nss: this.nss,
              compania: this.compania,
              puesto: this.puesto
            },
            configuracion
          )
          .then(function(response) {
            swal(
              "Pasajero actualizado",
              "Pasajero actualizado exitosamente",
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
            "pasajeros/add",
            {
              agencia: this.$store.state.usuario.agencia,
              rfc: this.rfc,
              nombre_completo: this.nombre_completo,
              numero_libreta: this.numero_libreta,
              nss: this.nss,
              compania: this.compania,
              puesto: this.puesto
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

    editItem(item) {
      this._id = item._id;
      this.rfc = item.rfc;
      this.nombre_completo = item.nombre_completo;
      this.numero_libreta = item.numero_libreta;
      this.nss = item.nss;
      (this.compania = item.compania), (this.puesto = item.puesto);
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