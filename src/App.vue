
<template >
  
  <v-app id="app" >
     

    <v-navigation-drawer
      fixed
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="logueado"
      color="white"
       absolute
        
    >
      <v-list dense>

         <v-list-item two-line :class="miniVariant && 'px-0'">
            <v-list-item-avatar>
              <img src="https://i.ibb.co/852HMWf/anchor-1911939-1617508.png">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{$store.state.usuario.nombre}}</v-list-item-title><br>
              <v-list-item-subtitle>{{$store.state.usuario.email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

            <v-list-item :to="{name: 'perfil'}">
            <v-list-item-action>
              <v-icon>account_circle</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Mi perfil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
    
        <template v-if="esAdministrador">
          <v-list-item slot="activator">
            <v-list-item-action>
              <v-icon>assignment_turned_in</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Solicitudes de Acceso</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{name: 'solicitud_unica_admin'}">
            <v-list-item-action>
              <v-icon>today</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Solicitud Unica de Acceso</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{name: 'solicitudes'}">
            <v-list-item-action>
              <v-icon>people</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Solicitud de Embarque y <br>Desembarque de Personal</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{name: 'vehiculosPersonalAdmin'}">
            <v-list-item-action>
              <v-icon>local_shipping</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Acceso a Vehiculos y Personal</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

            <template v-if="esAdministrador">
          <v-list-item :to="{name: 'pspcosteoregistro'}">
            <v-list-item-action>
              <v-icon>engineering</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>PSP Costeo</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="esAdministrador">
          <v-list-item :to="{name: 'bitacora'}">
            <v-list-item-action>
              <v-icon>assignment_ind</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Pase de Lista</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template v-if="esAdministrador">
          <v-list-item :to="{name: 'bitacoraEmbarcaciones'}">
            <v-list-item-action>
              <v-icon>book</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Bitacora de Embarcaciones</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>


        <template v-if="esAdministrador">
          <v-list-item :to="{name: 'embarcacion'}">
            <v-list-item-action>
              <v-icon>directions_boat</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Embarcacion</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>


        <template v-if="esAPITAB">
          <v-list-item :to="{name: 'solicitud_apitab'}">
            <v-list-item-action>
              <v-icon>work</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Solicitud Unica de Arribo</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        

        <template v-if="esAPITAB">
          <v-list-item :to="{name: 'cambio_guardia_api'}">
            <v-list-item-action>
              <v-icon>people</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> Solicitud de Embarque y
              <br />Desembarque de Personal</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{name: 'vehiculos_personal_api'}">
            <v-list-item-action>
              <v-icon>local_shipping</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Solicitud de Vehiculos y
                <br />Personal
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

       

         <template v-if="esAPITAB">
          <v-list-item :to="{name: 'pspcosteo'}">
            <v-list-item-action>
              <v-icon>engineering</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>PSP Costeo</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

          

        <template v-if="esAdministrador">
          <v-list-item :to="{name: 'agencia'}">
            <v-list-item-action>
              <v-icon>work</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Agencia</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
       
        <template v-if="esCliente">
          <v-list-item :to="{name: 'solicitud_unica'}">
            <v-list-item-action>
              <v-icon>today</v-icon>
            </v-list-item-action>
            <v-list-item-title>Solicitud Unica de Arribo</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esCliente">
          <v-list-item :to="{name: 'cambios_guardia'}">
            <v-list-item-action>
              <v-icon>people</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Solicitud de Embarque y
              <br />Desembarque de Personal
            </v-list-item-title>
          </v-list-item>
        </template>

        <template v-if="esCliente || esPSP" >
          <v-list-item :to="{name: 'vehiculos_personal'}">
            <v-list-item-action>
              <v-icon>local_shipping</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Acceso a Vehiculos y
              <br />Personal
            </v-list-item-title>
          </v-list-item>
        </template>

        <template v-if="esCliente">
          <v-list-item :to="{name: 'pasajeros'}">
            <v-list-item-action>
              <v-icon>directions_walk</v-icon>
            </v-list-item-action>
            <v-list-item-title>Mis Pasajeros</v-list-item-title>
          </v-list-item>
        </template>

     

        <template v-if="esAdministrador">
          <v-list-item :to="{name: 'usuario'}">
            <v-list-item-action>
              <v-icon>group_add</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Usuarios</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
           <v-list-item :to="{name: 'altapsp'}">
            <v-list-item-action>
              <v-icon>manage_accounts</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Alta PSP</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{name: 'reportes'}">
            <v-list-item-action>
              <v-icon>picture_as_pdf</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Reportes</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      
    </v-navigation-drawer>
    

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="gray" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-spacer />
      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-btn text small v-bind="attrs" v-on="on">Directorio</v-btn>
          </template>

          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>Directorio</v-card-title>

            <v-card-text>
              <br />Oficinas Cd del Carmen :
              <strong>+52 938 118 4904</strong>
              <br />Oficinas Dos Bocas :
              <strong>+52 933 100 1200</strong>
              <br />David Morales -Administrador del Muelle Chiltepec :
              <strong>+52 938 283 1289</strong>
              <br />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">I accept</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogPsp" width="500" v-if="logueado">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-btn text small v-bind="attrs" v-on="on">Prestadores de Servicios</v-btn>
          </template>

          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >Lista de Prestadores de Servicios</v-card-title>

            <v-card-text>
              <br />Oficinas Cd del Carmen :
              <strong>+52 938 118 4904</strong>
              <br />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialogPsp = false">I accept</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      
      

      <div class="my-2">
        <v-btn text small>Servicios</v-btn>
      </div>
      <div class="my-2">
        <v-btn text small>Tramites</v-btn>
      </div>
      <v-btn @click="salir()" icon v-if="logueado">
        <v-icon>logout</v-icon>
      </v-btn>
      

      <v-btn :to="{name:'login'}" icon v-else>
        <v-icon>fingerprint</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-content>
      <v-container class="fill-height" fluid>
        <v-slide-y-transition mode="out-in">
          
          <router-view />
        </v-slide-y-transition>
      </v-container>
      
    </v-content>
        <template v-if="!logueado">
          
             <div class="block TutorialBlock">
                <v-container>
               <h2 class="text-center">Videotutoriales</h2>
               <v-row>
                 <v-col cols="4">
              
                  <v-card outlined
                    class="mx-auto"
                  
                  >
                    <v-img
                      class="white--text align-end"
                      height="200px"
                     src="https://i.ibb.co/JdnVcXq/su.jpg"
                    >
                     
                    </v-img>

                    <v-card-subtitle class="pb-0">
                      Tutorial 1
                    </v-card-subtitle>

                    <v-card-text class="text--primary">
                      <div><strong>Solicitud unica de acceso</strong></div>

                      <div>En este tutorial se muestra un ejemplo de como realizar una solicitud para el acceso de embarcaciones al muelle</div>
                    </v-card-text>

                    <v-card-actions>
                     

                      <v-btn
                        color="dark"
                        text
                        href="https://youtu.be/ZCc3WNTFfqk" 
                        target="_blank"
                      >
                        Ir al tutorial
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                 </v-col>
                    <v-col cols="4">
              
                  <v-card
                    class="mx-auto"
                   
                  >
                    <v-img
                      class="white--text align-end"
                      height="200px"
                      src="https://i.ibb.co/9YPQp8F/cg.jpg"
                    >
                     
                    </v-img>

                    <v-card-subtitle class="pb-0">
                      Tutorial 2
                    </v-card-subtitle>

                    <v-card-text class="text--primary">
                      <div><strong>Embarque y Desembarque de Personal</strong></div>

                      <div>En este tutorial se muestra un ejemplo como ingresar una soliitud de embarque o desembarque de pasajeros</div>
                    </v-card-text>

                    <v-card-actions>
                   

                      <v-btn
                        color="dark"
                        text
                        href="https://youtu.be/IvBNpOhz1ks" 
                        target="_blank"
                      >
                        Ir al tutorial
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                 </v-col>
                    <v-col cols="4">
              
                  <v-card
                    class="mx-auto"
                   
                  >
                    <v-img
                      class="white--text align-end"
                      height="200px"
                      src="https://i.ibb.co/4KnhtV9/gmgg.jpg"
                    >
                    </v-img>

                    <v-card-subtitle class="pb-0">
                      Tutorial 3
                    </v-card-subtitle>

                    <v-card-text class="text--primary">
                      <div><strong>Acceso a Vehiculos y Personal</strong></div>

                      <div>En este tutorial se muestra un ejemplo de como ingresar una solicitud de acceso a vehiculos y personal</div>
                    </v-card-text>

                    <v-card-actions>
                     

                      <v-btn
                        color="black"
                        text
                        href="https://youtu.be/0jQuAxVldMk" 
                        target="_blank"
                      >
                        Ir al tutorial
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                 </v-col>
                 
                 
               </v-row>
                </v-container>
             </div>
             
          
        </template>
        
          <template  v-if="!logueado">
            <!-- Footer -->
            <mdb-footer style="backgroundColor:gray" dark  class="page-footer font-small pt-0">
              <div style="backgroundColor: #41474a" >
                <mdb-container class="text-left">
                  <mdb-row class="py-4 d-flex align-items-center">
                    <mdb-col md="6" lg="5" class="text-center text-md-left mb-4 mb-md-0">
                      <h3 class="mb-0" style="color:white">¡Conéctate con nosotros en las redes sociales!</h3>
                    </mdb-col>
                    <mdb-col md="6" lg="7" class="text-center text-md-right">
                      <a href="https://www.facebook.com/108769701013839/posts/108787737678702/" class="fb-ic ml-0"><i class="fa fa-facebook white-text mr-lg-4" style="color:white"> </i></a>
                      <a href="https://www.linkedin.com/company/amls-agency-vessels/" class="li-ic"><i class="fa fa-linkedin white-text mr-lg-4" style="color:white"> </i></a>
                      <a class="ins-ic"><i class="fa fa-instagram white-text mr-lg-4" style="color:white"> </i></a>
                      <a class="wa.link/7ay3uy"><i class="fa fa-whatsapp white-text mr-lg-4" style="color:white"> </i></a>
                    </mdb-col>
                    
                  </mdb-row>
                    <v-divider
             
            ></v-divider> 
                </mdb-container>
                
                
              </div>
                         <mdb-container  class="mt-5 mb-4 text-center text-md-left">
                <mdb-row class="mt-3">
                  <mdb-col md="6" lg="6" xl="4" class="mb-6">
                    <h6 class="text-uppercase font-weight-bold" style="color:black; font-size:18px"><strong>Contacto</strong></h6>
                    <hr class="deep-white accent-2 mb-4 mt-0 d-inline-block mx-auto" style="width: 70px" />
                    <p style="color:black">Para garantizar una respuesta rápida y eficiente a cualquier solicitud de nuestros clientes, nuestras oficinas operan las 
                      24 horas del día, los 7 días de la semana, los 365 días del año con un equipo de trabajo experimentado.</p>
                  </mdb-col>
                  <mdb-col md="2" lg="2" xl="2" class="mb-4">
                    <h6 class="text-uppercase font-weight-bold"><strong>Servicios</strong></h6>
                    <hr class="deep-white accent-2 mb-4 mt-0 d-inline-block mx-auto" style="width: 60px" />
                    <p>Agencia Consignataria</p>
                    <p>Fletamento de Embarcaciones</p>
                    <p>Administranción de Muelles</p>
                    
                  </mdb-col>
                  <mdb-col md="4" lg="3" xl="3" class="mb-4">
                     <h6 class="text-uppercase font-weight-bold"><strong>Dos Bocas</strong></h6>
                    <hr class="deep-white accent-2 mb-4 mt-0 d-inline-block mx-auto" style="width: 60px" />
                    <p><i class="fa fa-home mr-3"></i>Carretera Paraíso Dos Bocas No. 924 <br>Colonia El Limon, C.P. 86606</p>
                    <p><i class="fa fa-envelope mr-3"></i> contacto@amls.mx</p>
                    <p><i class="fa fa-phone mr-3"></i> 933 596 7068</p>
                  </mdb-col>
                  <mdb-col md="4" lg="3" xl="3" class="mb-4">
                    <h6 class="text-uppercase font-weight-bold"><strong>Ciudad del Carmen</strong></h6>
                    <hr class="deep-black accent-2 mb-4 mt-0 d-inline-block mx-auto" style="width: 120px" />
                    <p><i class="fa fa-home mr-3"></i> Calle 4 Lote 5 Local C y D P.I.P <br> Laguna Azul C.P. 24129</p>
                    <p><i class="fa fa-envelope mr-3"></i> contacto@amls.mx</p>
                    <p><i class="fa fa-phone mr-3"></i> 938 118 4904</p>
                  </mdb-col>
                </mdb-row>
              </mdb-container>
              <div class="footer-copyright text-center py-3">
                <mdb-container fluid>
                  &copy; 2020 Copyright: <a href="https://www.amls.mx"> amls.mx </a>
                </mdb-container>
              </div>
            </mdb-footer>
            <!-- Footer -->
          </template>
  </v-app>
  
</template>

<script>
 

"use strict";
 import { mdbFooter, mdbContainer, mdbRow, mdbCol } from 'mdbvue';
export default {
  name: "App",
  name: 'FooterPage',
   components: {
      mdbFooter,
      mdbContainer,
      mdbRow,
      mdbCol
    },
  data() {
    return {
      drawer: true,
      dialog: false,
      dialogPsp: false
    };
  },
  computed: {
    logueado() {
      return this.$store.state.usuario;
    },
    esAdministrador() {
      return (
        this.$store.state.usuario &&
        this.$store.state.usuario.rol == "Administrador"
      );
    },
    esCliente() {
      return (
        this.$store.state.usuario && this.$store.state.usuario.rol == "Cliente"
      );
    },
    esAPITAB() {
      return (
        this.$store.state.usuario && this.$store.state.usuario.rol == "APITAB"
      );
    },
     esPSP() {
      return (
        this.$store.state.usuario && this.$store.state.usuario.rol == "PSP"
      );
    }
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
  methods: {
    salir() {
      this.$store.dispatch("salir");
    }
  }
};
</script>
<style >
  
</style>