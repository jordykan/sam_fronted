<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table :headers="headers" :items="embarcaciones" :search="search" class="elevation-1">
        <template v-slot:item.estado="{ item }">
          <v-card-text v-if="item.estado" class="blue--text">Activo</v-card-text>
          <v-card-text v-if="!item.estado" class="red--text">Inactivo</v-card-text>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-btn @click="crearPDF()">
              <v-icon>print</v-icon>
            </v-btn>
            <v-toolbar-title>Embarcaciones</v-toolbar-title>

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
                  dark
                  class="mb-2"
                  @click="limpiar"
                  v-on="on"
                >Nueva Embarcacion</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="nombre" label="Nombre de buque"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="armador" label="Armador"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="bandera" label="Bandera"></v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field v-model="pto_matricula" label="Pto Matricula"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="eslora" type="number" label="Eslora"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="puntal" type="number" label="Puntal"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="manga" label="Manga"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="trn" type="number" label="TRN"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="tbr" label="TRB"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="matricula" label="No. Matricula"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="calado" label="Calado"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="imo" label="IMO"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="tipo" label="Clase"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        Adjunte el certificado de arqueo de la Embarcación:
                        <br />
                        <input
                          type="file"
                          ref="file"
                          name="file"
                          id="file"
                          label="File input"
                          v-on:change="handleFileUpload()"
                        />
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
                  la embarcacion {{adNombre}}
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="activarDesactivarCerrar()" color="green" small>Cancelar</v-btn>
                  <v-btn v-if="adAccion==1" @click="activar()" color="blue" small>Activar</v-btn>
                  <v-btn v-if="adAccion==2" @click="desactivar()" color="red" small>Desactivar</v-btn>
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
          <v-icon
            v-if="!item.certificado"
            small
            class="mr-2"
            @click="downloadCertificado(item)"
          >fa fa-file-pdf-o</v-icon>
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
import download from "download-file";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import S3FileUpload from "@/components/S3FileComponent";
import "font-awesome/css/font-awesome.min.css"; // Ensure you are using css-loader
import S3 from "aws-s3";
import swal from 'sweetalert'

export default {
  components: {
    S3FileUpload
  },
  icons: {
    iconfont: "fa4"
  },
  data() {
    return {
      dialog: false,
      search: "",
      embarcaciones: [],
      headers: [
        { text: "Actions", value: "action", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Bandera", value: "bandera", sortable: true },
        { text: "Pto Matricula", value: "pto_matricula", sortable: true },
        { text: "Armador", value: "armador", sortable: true },
        { text: "Clase", value: "tipo", sortable: true },
        { text: "TRB", value: "tbr", sortable: false },
        { text: "TRN", value: "trn", sortable: false },
        { text: "Matricula", value: "matricula", sortable: false },
        { text: "IMO", value: "imo", sortable: false },
        { text: "Eslora", value: "eslora", sortable: false },
        { text: "Manga", value: "manga", sortable: false },
        { text: "Calado", value: "calado", sortable: false },
        { text: "Puntal", value: "puntal", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
        { text: "Certificado de Arqueo", value: "certificado" }
      ],
      editedIndex: -1,
      _id: "",
      nombre: "",
      armador: "",
      tipo: "",
      tbr: "",
      matricula: "",
      video: [],
      eslora: "",
      manga: "",
      bandera: "",
      pto_matricula: "",
      trn: "",
      puntal: "",
      imo: "",
      nombreArchivo: "",
      file: "",
      calado: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: ""
    };
  },
  computed: {
    config() {
      return {
        bucketName: "sam-amls",
        dirName: "ca" /* optional */,
        region: "us-west-1",
        accessKeyId: "AKIAVFDVDRT4HCGVWS6A",
        secretAccessKey: "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",
        s3Url: this.baseUrl
      };
    },
    baseUrl() {
      return "https://sam-amls.s3-us-west-1.amazonaws.com";
    },
    S3Client() {
      return new S3(this.config);
    },
    newFileName() {
      return Math.random()
        .toString()
        .slice(2);
    },
    url() {
      return `${this.baseUrl}/${"ca"}/${this.newFileName}`;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva Embarcacion"
        : "Editar Embarcacion";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.listar();
  },

  methods: {
    handleFileUpload(e) {
      this.file = this.$refs.file.files[0];
    },

    crearPDF() {
      var columns = [
        { title: "Nombre", dataKey: "nombre" },
        { title: "Armador", dataKey: "armador" },
        { title: "Tipo", dataKey: "tipo" },
        { title: "TBR", dataKey: "tbr" },
        { title: "Matricula", dataKey: "matricula" },
        { title: "Eslora", dataKey: "eslora" },
        { title: "Manga", dataKey: "manga" },
        { title: "Calado", dataKey: "calado" }
      ];
      var rows = [];
      this.embarcaciones.map(x => {
        rows.push({
          nombre: x.nombre,
          armador: x.armador,
          tipo: x.tipo,
          tbr: x.tbr,
          trn: x.trn,
          eslora: x.eslora,
          manga: x.manga,
          calado: x.calado
        });
      });
      var doc = new jsPDF("p", "pt");
      doc.autoTable(columns, rows, {
        margin: { top: 60 },
        addPageContent: function(data) {
          doc.text("Lista de Embarcaciones", 40, 30);
        }
      });
      doc.save("embarcaciones.pdf");
    },

    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.nombre.length < 1) {
        this.validaMensaje.push("El nombre es obligatorio");
      }
      if (this.armador.length < 1) {
        this.validaMensaje.push("El armador es obligatorio");
      }
      if (this.tipo.length < 1) {
        this.validaMensaje.push("El tipo de embarcación es obligatorio");
      }
      if (this.tbr.length < 1) {
        this.validaMensaje.push("El TBR es obligatorio");
      }
      if (this.matricula.length < 1) {
        this.validaMensaje.push("El trn es obligatorio");
      }
      if (this.eslora.length < 1) {
        this.validaMensaje.push("La Eslora es obligatorio");
      }
      if (this.nombre.manga < 1) {
        this.validaMensaje.push("La manga es obligatorio");
      }
      if (this.calado.length < 1) {
        this.validaMensaje.push("El calado es obligatorio");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },

    limpiar() {
      (this._id = ""),
        (this.nombre = ""),
        (this.armador = ""),
        (this.eslora = ""),
        (this.tbr = ""),
        (this.matricula = ""),
        (this.tipo = ""),
        (this.manga = ""),
        (this.calado = "");
      (this.valida = 0),
        (this.bandera = ""),
        (this.pto_matricula = ""),
        (this.puntal = ""),
        (this.trn = ""),
        (this.imo = ""),
        (this.validaMensaje = []),
        (this.editedIndex = -1);
    },
    guardar(files) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

     
      if (this.editedIndex > -1) {
        let file = me.file;
        let fileExtension = file.type.split("/")[1];
        this.nombreArchivo = `${me.url}.${fileExtension}`;
        axios
          .put(
            "embarcacion/update",
            {
              _id: this._id,
              nombre: this.nombre,
              armador: this.armador,
              tipo: this.tipo,
              tbr: this.tbr,
              matricula: this.matricula,
              eslora: this.eslora,
              bandera: this.bandera,
              pto_matricula: this.pto_matricula,
              trn: this.trn,
              puntal: this.puntal,
              imo: this.imo,
              manga: this.manga,
              calado: this.calado,
              certificado_a: this.nombreArchivo
            },
            configuracion
          )
          .then(function(response) {
            me.S3Client.uploadFile(file, me.newFileName).finally(() => {});
            swal(
              "Embarcación Actualizada",
              "Embarcación Actualizada exitosamente",
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
              "Verifique los datos ingresados",
              "error"
            )
          });
      } else {
        //Nuevo
        let file = me.file;
        let fileExtension = file.type.split("/")[1];
        this.nombreArchivo = `${me.url}.${fileExtension}`;
        axios
          .post(
            "embarcacion/add",
            {
              nombre: this.nombre,
              armador: this.armador,
              tipo: this.tipo,
              tbr: this.tbr,
              matricula: this.matricula,
              eslora: this.eslora,
              manga: this.manga,
              bandera: this.bandera,
              pto_matricula: this.pto_matricula,
              trn: this.trn,
              puntal: this.puntal,
              imo: this.imo,
              calado: this.calado,
              certificado_a: this.nombreArchivo
            },
            configuracion
          )
          .then(function(response) {
            me.S3Client.uploadFile(file, me.newFileName).finally(() => {});
            swal(
              "Nueva embarcación agregada",
              "Nueva embarcación agregada con exito",
              "success"
            )
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            me.close()
            swal(
              "Error",
              "Verifique los datos ingresados"+error,
              "error"
            )
          });
      }
    },
    listar() {
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      console.log(configuracion)
      let me = this;

      axios
        .get("embarcacion/list", configuracion)
        .then(function(response) {
          me.embarcaciones = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    editItem(item) {
      this._id = item._id;
      this.nombre = item.nombre;
      this.armador = item.armador;
      this.eslora = item.eslora;
      this.tbr = item.tbr;
      this.file = item.certificado_a;
      this.trn = item.trn;
      this.tipo = item.tipo;
      this.bandera = item.bandera;
      this.pto_matricula = item.pto_matricula;
      this.trn = item.trn;
      this.puntal = item.puntal;
      this.imo = item.imo;
      this.matricula = item.matricula;
      this.manga = item.manga;
      this.calado = item.calado;
      this.editedIndex = 1;

      this.dialog = true;
    },

    download(item) {
      axios
        .get("embarcacion/getCertificado/" + item.certificado_a, {
          responseType: "arraybuffer"
        })
        .then(function(response) {
          let blob = new Blob([response.data], { type: "content-type" });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "certificado_a.pdf";
          link.click();
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    downloadCertificado(item) {
      window.open(item.certificado_a, "_blank");
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
     
      axios
        .put("embarcacion/activate", { _id: this.adId })
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