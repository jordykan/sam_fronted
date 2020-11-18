<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table :headers="headers" :items="usuarios" :search="search" class="elevation-1">
        <template v-slot:item.estado="{ item }">
          <v-card-text v-if="item.estado" class="blue--text">Activo</v-card-text>
          <v-card-text v-if="!item.estado" class="red--text">Inactivo</v-card-text>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Usuarios</v-toolbar-title>
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
                <v-btn @click="limpiar" small class="mb-2" v-on="on">Nuevo Usuario</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select v-model="rol" :items="roles" label="Rol"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="empresa" label="Empresa"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="email" label="Email"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="direccion" label="Direccion"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="telefono" label="Telefono"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="cargo" label="Cargo"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete :items="agencias" v-model="agencia" label="Agencias"></v-autocomplete>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="password" type="password" label="Password"></v-text-field>
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
                  <span v-if="adAccion==2">Desactivar</span>
                  al usuario {{adNombre}}
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="activarDesactivarCerrar()" small color="green">Cancelar</v-btn>
                  <v-btn v-if="adAccion==1" @click="activar()" small color="blue">Activar</v-btn>
                  <v-btn v-if="adAccion==2" @click="desactivar()" small color="red">Desactivar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
          <template v-if="item.estado">
            <v-icon small @click="activarDesactivarMostrar(2,item)">block</v-icon>
          </template>
          <template v-else>
            <v-icon small @click="activarDesactivarMostrar(1,item)">check</v-icon>
          </template>
        </template>
        <template v-slot:item.certificado="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">fa fa-file-pdf-o</v-icon>
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
import "font-awesome/css/font-awesome.min.css"; // Ensure you are using css-loader
import swal from 'sweetalert'
import emailjs from "emailjs-com";

export default {
  icons: {
    iconfont: "fa4"
  },
  data() {
    return {
      dialog: false,
      search: "",
      usuarios: [],
      headers: [
        { text: "Actions", value: "action", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Empresa", value: "empresa", sortable: true },
        { text: "Email", value: "email", sortable: false },
        { text: "Direccion", value: "direccion", sortable: false },
        { text: "Agencia", value: "agencia.nombre", sortable: false },
        { text: "Rol", value: "rol", sortable: true },
        { text: "Cargo", value: "cargo", sortable: true },
        { text: "Estatus", value: "estado", sortable: true }
      ],
      editedIndex: -1,
      _id: "",
      nombre: "",
      agencias: [],
      rol: "",
      roles: ["Administrador", "Cliente", "APITAB"],
      empresa: "",
      email: "",
      direccion: "",
      telefono: "",
      estado: "",
      email: "",
      password: "",
      agencia: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: ""
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Usuario" : "Editar Usuario";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
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
        (this.nombre = ""),
        (this.rol = ""),
        (this.empresa = ""),
        (this.email = ""),
        (this.telefono = ""),
        (this.password = ""),
        (this.manga = ""),
        (this.direccion = "");
      (this.cargo = ""),
        (this.valida = 0),
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
            "usuario/update",
            {
              _id: this._id,
              nombre: this.nombre,
              rol: this.rol,
              empresa: this.empresa,
              email: this.email,
              direccion: this.direccion,
              telefono: this.telefono,
              password: this.password,
              agencia: this.agencia,
              cargo: this.cargo
            },
            configuracion
          )
          .then(function(response) {
            swal(
              "Usuario actualizado",
              "Usuario actualziado con exito",
              "success"
            )
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            swal(
            "Error",
            "Verifica los datos ingresados"+error,
            "error",
            
            )
          
          });
      } else {
        //Nuevo

        axios
          .post(
            "usuario/add",
            {
              nombre: this.nombre,
              rol: this.rol,
              empresa: this.empresa,
              email: this.email,
              direccion: this.direccion,
              telefono: this.telefono,
              password: this.password,
              agencia: this.agencia,
              cargo: this.cargo
            },
            configuracion
          )
          .then(function(response) {
            swal(
              "Nuevo usuario agregado",
              "Nuevo usuario agregado con exito",
              "success"
            )
           
            me.enviar(response.data.nombre, response.data.email, me.password);
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            me.close()
            swal(
              "Error",
              "Verique los datos ingreasados"+error,
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
        .get("usuario/list", configuracion)
        .then(function(response) {
          me.usuarios = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    listarActivos() {
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let me = this;
      axios
        .get("usuario/listActivos", configuracion)
        .then(function(response) {
          me.usuarios = response.data;
        })
        .catch(function(error) {
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

 enviar(
      nombre,
      email,
      password
    ) {
      var template_params = {
        
        nombre: nombre,
        email: email,
        password: password
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
        .put("usuario/activate", { _id: this.adId }, configuracion)
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
        .put("usuario/deactivate", { _id: this.adId }, configuracion)
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