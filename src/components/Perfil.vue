<template>
  <v-layout align-start>
    <v-flex>
        <h3>En construcción</h3>
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
      headers: [
        { text: "Actions", value: "action", sortable: false },
        { text: "RFC", value: "rfc", sortable: true },
        { text: "Nombre Completo", value: "nombre_completo", sortable: true },
        {
          text: "Numero de Libreta de Mar",
          value: "numero_libreta",
          sortable: true
        },
        { text: "Numero de Seguro Social", value: "nss", sortable: false },
        { text: "Compania", value: "compania", sortable: true },
        { text: "Puesto", value: "puesto", sortable: true }
      ],
      editedIndex: -1,
      _id: "",
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