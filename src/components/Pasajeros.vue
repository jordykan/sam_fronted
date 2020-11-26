<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table :headers="headers" :items="pasajeros" :search="search" class="elevation-1">
        <template v-slot:item.estado="{ item }">
          <v-card-text v-if="!item.estado" class="blue--text">Activo</v-card-text>
          <v-card-text v-if="item.estado" class="red--text">Inactivo</v-card-text>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-btn @click="crearPDF()">
              <v-icon>print</v-icon>
            </v-btn>
            <v-toolbar-title>Mis Pasajeros</v-toolbar-title>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Busqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  small
                  dark
                  class="mb-2"
                  @click="limpiar"
                  v-on="on"
                >Nuevo Pasajero</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="rfc" label="RFC"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                      </v-col>
                        <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="apellidoPaterno" label="Apellido Paterno"></v-text-field>
                      </v-col>
                        <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="apellidoMaterno" label="Apellido Materno"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
                         <v-text-field v-model="compania" label="Compañia"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="puesto" label="Puesto"></v-text-field>
                      </v-col>

                   
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="nss" label="Numero de Seguro Social"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="12" v-show="valida">
                        <div class="red--tex" v-for="v in validaMensaje" :key="v" v-text="v"></div>
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
                <v-card-title class="headline" v-if="adAccion==1">Activar Item</v-card-title>
                <v-card-title class="headline" v-if="adAccion==2">Desactivar Item</v-card-title>

                <v-card-text>
                  Estas a punto de
                  <span v-if="adAccion==1">Activar</span>
                  <span v-if="adAccion==2">Eliminar</span>
                  al pasajero con nombre {{adNombre}}
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="activarDesactivarCerrar()" color="green" small>Cancelar</v-btn>
                  <v-btn v-if="adAccion==1" @click="activar()" color="blue" small>Activar</v-btn>
                  <v-btn v-if="adAccion==2" @click="desactivar()" color="red" small>Eliminar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
          <template v-if="item.estado==0">
            <v-icon @click="activarDesactivarMostrar(2,item)">delete_forever</v-icon>
          </template>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "font-awesome/css/font-awesome.min.css"; // Ensure you are using css-loader
import S3 from "aws-s3";
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
      headers: [
        { text: "Actions", value: "action", sortable: false },
        { text: "RFC", value: "rfc", sortable: true },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Apellido Paterno", value: "apellidoPaterno", sortable: true },
         { text: "Apellidpo Materno", value: "apellidoMaterno", sortable: true },
        { text: "Numero de Seguro Social", value: "nss", sortable: false },
        { text: "Compania", value: "compania", sortable: true },
        { text: "Puesto", value: "puesto", sortable: true }
      ],
      editedIndex: -1,
      _id: "",
      nombre: "",
      apellidoPaterno:'',
      apellidoMaterno:'',
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
      if (this.nombre.length < 1) {
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
        (this.nombre = ""),
        (this.numero_libreta = ""),
        (this.nss = ""),
        this.compania="",
        this.puesto="",
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
              nombre: this.nombre,
              apellidoPaterno: this.apellidoPaterno,
              apellidoMaterno: this.apellidoMaterno,
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
              nombre: this.nombre,
              apellidoPaterno: this.apellidoPaterno,
              apellidoMaterno: this.apellidoMaterno,
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
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let me = this;
      axios
        .get(
          "pasajeros/list?agencia=" + this.$store.state.usuario.agencia,
          configuracion
        )
        .then(function(response) {
          me.pasajeros = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    editItem(item) {
      this._id = item._id;
      this.rfc = item.rfc;
      this.nombre = item.nombre;
      this.apellidoMaterno = item.apellidoMaterno
      this.apellidoPaterno = item.apellidoPaterno
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
      this.adNombre = item.nombre;
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