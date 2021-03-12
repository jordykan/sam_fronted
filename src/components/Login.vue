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
        <br /><br />
      </v-flex>

      <v-card>
        <v-toolbar class="blue-grey lighten-3">
          <v-toolbar-title> Acceso al Sistema </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="email"
            type="email"
            autofocus
            color="accent"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            autofocus
            color="accent"
            label="Password"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="px-3 pb3">
          <v-flex>
            <v-btn @click="ingresar" color="primary">Ingresar</v-btn>
          </v-flex>
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="orange" dark v-bind="attrs" v-on="on">
                Alta de PSP
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Alta de PSP</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="nombre"
                        label="Nombre Completo"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="empresa"
                        label="Razón Social"
                        hint="Razón Social del PSP"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-text-field v-model="cargo" label="Cargo"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="telefono" label="Telefono" required></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="direccion" label="Direccion"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Contraseña"
                        type="password"
                        v-model="password"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <small
                  >Enviar todos los documentos para el alta al correo
                  altapsp@amls.mx</small
                >
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                               <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>

              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>

        <v-card-actions class="px-3 pb3">
          <v-flex text-xs-right>
            <a href="solicitud.docx" download="formato">
              <v-btn text small color="primary"
                >Formato de Solicitud de Cuenta</v-btn
              ></a
            >
          </v-flex>
          <v-flex text-xs-right>
            <a href="plantilla.csv" download="plantilla.csv">
              <v-btn text small color="primary"
                >Plantilla para carga de pasajeros</v-btn
              ></a
            >
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>


    


<script>
import axios from "axios";
import swal from "sweetalert";

export default {
  data() {
    return {
      email: "",
      password: "",
      dialog: false,
      errorM: "",
      snackbar: false,
      empresa: "",
      nombre:'',
      direccion: "",
      rol:'',
      cargo:'',
      telefono: "",
      estado: "",
    };
  },
  methods: {
    ingresar() {
      axios
        .post("usuario/login", { email: this.email, password: this.password })
        .then((respuesta) => {
          return respuesta.data;
        })
        .then((data) => {
          this.$store.dispatch("guardarToken", data.tokenReturn);
          this.$router.push({ name: "home" });
        })
        .catch((error) => {
          console.log(error);
          this.errorM = null;
          if (error.response.status == 404) {
            swal(
              "Error",
              "El usuario no existe, favor de verificar sus datos",
              "error"
            );
          } else {
            this.errorM = "Ocurrio un error con el servidor";
          }
        });
    },
     guardar() {
      let me = this;
        //Nuevo
        axios
          .post(
            "usuario/addPsp",
            {
              nombre: this.nombre,
              rol: 'PSP',
              estado:0,
              empresa: this.empresa,
              email: this.email,
              direccion: this.direccion,
              telefono: this.telefono,
              password: this.password,
              cargo: this.cargo
            }
          )
          .then(function(response) {
            swal(
              "Datos agregados con exito",
              "Para que tu solicitud sea aprobada favor de enviar por correo los siguientes archivos:",
              "success"
            )
            me.close();
            me.limpiar()
           
         
          })
          .catch(function(error) {
            me.close()
            me.limpiar()
            swal(
              "Error",
              "Verique los datos ingreasados"+error,
              "error"
            )
          });
      
    },
    limpiar(){
      this.nombre = '',
      this.email = '',
      this.empresa = '',
      this.cargo = '',
      this.telefono = '',
      this.direccion = '',
      this.contraseña = ''
    },
    close(){
      this.dialog = false
    }
  },
};
</script>