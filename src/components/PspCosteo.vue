<template>
  <v-layout align-start>
    <v-flex>
      <v-simple-table dense>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Bitacora de Facturación</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
         
            <v-spacer></v-spacer>
          
       
          </v-toolbar>
             <v-flex xs3 sm3 lg13 x3>
                          <v-dialog
                            ref="dialog"
                            v-model="modal"
                            :return-value.sync="date"
                            persistent
                            width="290px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateRangeText"
                                prepend-icon="event"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                class="pa-0"
                                hide-details
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="dates" range scrollable  >
                              <v-spacer></v-spacer>
                              
                              <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                              <v-btn text color="primary"  @click="$refs.dialog.save(date)">OK</v-btn>
                            </v-date-picker>
                          </v-dialog><br>
                            <v-btn color="primary" small   @click="listar()">Listar</v-btn>
                        </v-flex>
                            <br>                         <v-flex xs3 sm3 lg13 x3>
                            
                        </v-flex>
        </template>
        <template v-slot:default >
          <thead>
            <tr>
          
              <th class="text-left">Servicio</th>
              <th class="text-left">Remisión</th>
               <th class="text-left">Fecha Remitida</th>
              <th class="text-left">Total MXN</th>
              <th class="text-left">Fecha del Servicio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in registros" :key="item.servicio">
            
              <td>{{ item.servicio }}</td>
              <td>{{ item.remision }}</td>
              <td>{{ item.fechaRemitida| moment("dddd Do MMMM YYYY")}}</td>
              <td>${{ item.monto.toFixed(2) }}</td>
                
              <td>{{ item.fechaServicio.join(" , ") }}</td>
            </tr>
                 <td></td>
                   <td></td>
                 <td>Total</td>
                 <td>${{total}}</td>
          </tbody>
        </template>
      </v-simple-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import "font-awesome/css/font-awesome.min.css"; // Ensure you are using css-loader
import swal from "sweetalert";
import emailjs from "emailjs-com";

export default {
  icons: {
    iconfont: "fa4",
  },
  data() {
    return {
      subtotal:'',
      search: "",
      registros: [],
      headers: [
        { text: "Actions", value: "action", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Empresa", value: "empresa", sortable: true },
        { text: "Email", value: "email", sortable: false },
        { text: "Direccion", value: "direccion", sortable: false },
        { text: "Agencia", value: "agencia.nombre", sortable: false },
        { text: "Rol", value: "rol", sortable: true },
        { text: "Cargo", value: "cargo", sortable: true },
        { text: "Estatus", value: "estado", sortable: true },
      ],
      editedIndex: -1,
      _id: "",
      nombre: "",
      agencias: [],
      fechaRemitida:'',
      rol: "",
      fecha: null,
      date: "",
      date: "",
      dialog: "",
      dialogs: false,
      total:"",
      roles: ["Administrador", "Cliente", "APITAB"],
      empresa: "",
      email: "",
      direccion: "",
      modal: false,
      dates: [],
      rangoFechas:[],
      telefono: "",
      estado: "",
      email: "",
      remision:'',
      monto:'',
      fechaServicio:'',
      password: "",
      agencia: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Registro" : "Editar Registro";
    },
    dateRangeText() {
      return this.dates.join(" al ");
      console.log(dates)
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.selectAgencias();
    this.emailIn();
  },

  methods: {
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.rol) {
        this.validaMensaje.push("El rol es obligatorio");
      }
      if (this.empresa.length < 1 || this.empresa.length > 100) {
        this.validaMensaje.push(
          "El nombre de la empresa debe tener entre 1 y 30 caracteres"
        );
      }
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre del usuario debe tener entre 1 y 50 caracteres"
        );
      }
      if (this.email.length < 1 || this.email.length > 50) {
        this.validaMensaje.push("El email debe tener entre 1 y 50 caracteres");
      }
      if (this.password.length < 1 || this.password.length > 64) {
        this.validaMensaje.push(
          "El password debe tener entre 1 y 64 pasajeros"
        );
      }

      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },

    emailIn() {
      emailjs.init("user_QA8qMBuyHCQIHTgR0AsPx");
    },

    limpiar() {
         (this._id = ""),
        (this.agencia = ""),
        (this.monto = ""),
        (this.fechaServicio = ""),
       
        (this.editedIndex = -1);
    },

    fechasChange(){
        this.listar()
    },

    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
     
    
      if (this.editedIndex > -1) {
        axios
          .put(
            "pspCosteo/update",
            {
              _id: this._id,
             
            },
            configuracion
          )
          .then(function (response) {
            swal(
              "Usuario actualizado",
              "Usuario actualziado con exito",
              "success"
            );
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            swal("Error", "Verifica los datos ingresados" + error, "error");
          });
      } else {
        //Nuevo

        axios
          .post(
            "costeoPsp/add",
            {
              agencia: this.agencia,
              remision: this.remision,
              servicio: 'Contrapestación 5%',
              monto: this.monto,
              subtotal:this.subtotal,
              email: this.email,
              fechaServicio: this.dates
             
              
            },
            configuracion
          )
          .then(function (response) {
            swal(
              "Nuevo registro agregado",
              "Nuevo registro agregado con exito",
              "success"
            );

            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            me.close();
            swal("Error", "Verique los datos ingreasados" + error, "error");
          });
      }
    },

    listar() {
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let me = this;
      let fecha1 = new Date(this.dates[0]);
      let fecha2 = new Date(this.dates[1]);
      console.log(fecha1)
      console.log(fecha2)
      axios
        .get("costeoPsp/listFecha?&fecha1="+fecha1+"&fecha2="+fecha2, configuracion)
        .then(function (response) {
          me.registros = response.data;
          var total = 0;
          me.registros.forEach(function (obj){
              total += parseFloat(obj.monto);
          })
          me.total = total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    

    selectAgencias() {
      let me = this;
      let agencaiArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("agencia/listActivos", configuracion)
        .then((response) => {
          agencaiArray = response.data;
          agencaiArray.map(function (x) {
            me.agencias.push({ text: x.nombre, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    enviar(nombre, email, password) {
      var template_params = {
        nombre: nombre,
        email: email,
        password: password,
      };

      emailjs.send("gmail", "nuevousuario", template_params).then(
        function (response) {
          if (response.text === "OK") {
          }
          console.log(
            "SUCCESS. status=%d, text=%s",
            response.status,
            response.text
          );
        },
        function (err) {
          alert("Ocurrió un problema al enviar el correo");
          console.log("FAILED. error=", err);
        }
      );
    },

    editItem(item) {
      this._id = item._id;
      this.nombre = item.nombre;
      this.empresa = item.empresa;
      this.rol = item.rol;
      this.agencia = item.agencia._id;
      this.email = item.email;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.password = item.password;
      this.editedIndex = 1;

      this.dialog = true;
    },

    activarDesactivarCerrar() {
      this.adModal = 0;
    },

    close() {
      this.dialog = false;
    },
  },
};
</script>