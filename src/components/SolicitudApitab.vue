<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="solicitudUnica"
        :search="search"
        class="elevation-1"
        v-if="verNuevo==0"
      >
        <template v-slot:item.estado="{ item }">
          <v-chip small class="ma-2" color="orange" text-color="white" v-if="item.estado==0">
            <v-avatar left>
              <v-icon small>restore</v-icon>
            </v-avatar>En proceso
          </v-chip>

          <v-chip small class="ma-2" color="primary" text-color="white" v-if="item.estado==1">
            <v-avatar left>
              <v-icon small>done</v-icon>
            </v-avatar>Aprobado
          </v-chip>

          <v-chip small class="ma-2" color="success" text-color="white" v-if="item.estado==3">
            <v-avatar left>
              <v-icon small>done</v-icon>
            </v-avatar>Aprobado API
          </v-chip>

          <v-chip small class="ma-2" color="error" text-color="white" v-if="item.estado==2">
            <v-avatar left>
              <v-icon small>error</v-icon>
            </v-avatar>
            {{item.motivo_cancelacion}}
          </v-chip>
              <v-chip small class="ma-2" color="black" text-color="white"  v-if="item.estado==4">
          <v-avatar left>
            <v-icon small>verified</v-icon>
          </v-avatar>
           Servicio Realizado
         </v-chip>
            <v-chip small class="ma-2" color="black" text-color="white"  v-if="item.estado==5">
          <v-avatar left>
            <v-icon small>verified</v-icon>
          </v-avatar>
           Servicio No Realizado
         </v-chip>
          
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Solicitud Unica de Arribo</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
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
            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row></v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Salir</v-btn>
                  <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="adModal" max-width="290">
              <v-card>
                <v-card-title class="headline" v-if="adAccion==1">Aprobar Solicitud</v-card-title>
                <v-card-title class="headline" v-if="adAccion==2">Cancelar Solicitud</v-card-title>

                <v-card-text>
                  Estas a punto de
                  <span v-if="adAccion==1">aprobar</span>
                  <span v-if="adAccion==2">cancelar</span>
                  <span v-if="adAccion==3">Aprobar</span>
                  la solicitud con folio SU{{adNombre}}
                </v-card-text>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    name="input-7-1"
                    label="Motivo de Cancelación"
                    value
                    v-if="adAccion==2"
                    v-model="motivo_cancelacion"
                  ></v-textarea>
                </v-col>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="activarDesactivarCerrar()" small color="error">Salir</v-btn>
                  <v-btn v-if="adAccion==1" @click="aprobarApi()" small color="primary">Aprobar</v-btn>
                  <v-btn v-if="adAccion==2" @click="activar()" small color="orange">Anular</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="comprobanteModal" max-width="1000px">
              <v-card>
                <v-card-title class="headline">
                  <v-btn @click="imprimir()">
                    <v-icon>print</v-icon>
                  </v-btn>Reporte de Entrada
                </v-card-title>
                <v-card-text>
                       <div id="solicitudGuardia"> <br><br>
                   <header>
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                         <br>
                              <p style="text-align:center">
                                  <strong id="texto"> Solicitud Única</strong><br>
                              </p>
                             <div style="float: left; margin-left:2%;margin-right:2%">
                        <img
                          style="width:100px"
                          src="data:image/jpeg;base64,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"
                          id="imagen"
                        />
                      </div><br>
                      <div style="margin-left:80%;margin-right:2%">
                       
                      </div>                     
                              <br />
                      <div id="texto" style="margin-left: 79%;">
                        Folio No. <u>SU{{folioId}}</u>
                       
                      </div>
                        
                      </header>
                      <div id="agencia">
                          <table style="width: 100%; height: 50px;">
                        <tbody>
                          <tr>
                            <td id="texto" style="border: hidden">Agencia Consignataria</td>

                            <td id="texto" style="border-bottom: .5px solid">{{agenciasUsuario.nombre}}</td>
                          </tr>

                          <tr>
                            <td id="texto" style="border: hidden">Direccion</td>

                            <td id="texto" style="border-bottom: .5px solid">{{agenciasUsuario.direccion}}</td>
                          </tr>

                          <tr>
                            <td id="texto" style="border: hidden">RFC</td>

                            <td
                              id="texto"
                              style="border-bottom: .5px solid"
                            >{{agenciasUsuario.rfc}}</td>
                          </tr>
                            <tr>
                            <td id="texto" style="border: hidden">E-mail</td>

                            <td
                              id="texto"
                              style="border-bottom: .5px solid"
                            >{{agenciasUsuario.email}}</td>
                          </tr>
                        </tbody>
                      </table>
                      <br>
                        <label id="texto">Como representante de la embarcación abajo mencionada, cuyas características detallo, solicito a Usted Autorización para el atraque y uso de
infraestructura del Recinto Portuario, comprometiendome a cumplir con las reglas de operación del puerto y cualquier otro lineamiento en materia de
seguridad, protección y ambiental, así como a resarcir cualquier daño que se pueda ocasionar en la infraestructura portuaria.
                        </label>
     
                   </div> 
                     <div id="agencia">
                      
                      <div class="row">
                        <div class="col-md-12">
                          <table style="width: 100%; height: 50px;">
                              <thead style="background-color:#EFEEEE">
                                <tr>
                                  <th id='texto' colspan="6">Datos del buque y estadía</th>         
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td id="texto">Fecha y Hora de Solicitud</td>
                                <td id="texto" style="border-bottom: .5px solid" ><strong>{{fecha_solicitud}}</strong></td>
                                  <td id="texto" >Tipo de Trafico</td>
                                  <td style="border-bottom: .5px solid" id="texto">CABOTAJE</td>
                                </tr>
                                <tr>
                                  <td id="texto">Nombre de buque</td>
                                  <td id="texto" style="border-bottom: .5px solid">{{embarcacion.nombre}}</td>
                                  <td id="texto" >Muelle de Arribo</td>
                                  <td id="texto" style="border-bottom: .5px solid">{{muelle}}</td>
                                </tr>
                                 <tr>
                                  <td  id="texto">Capitan</td>
                                <td id="texto" style="border-bottom: .5px solid">{{capitan}}</td>
                                  <td id="texto">Terminal de Arribo</td>
                                  <td id="texto" style="border-bottom: .5px solid">APITAB</td>
                                </tr>
                                <tr>
                                  <td id="texto">Armador</td>
                                  <td id="texto" style="border-bottom: .5px solid">{{embarcacion.armador}}</td>
                                  <td id="texto">E.T.A.</td>
                                  <td id="texto" style="border-bottom: .5px solid">{{etaReporte}}</td>
                                </tr>
                                  <tr>
                                  <td id="texto">No. de tripulantes</td>
                                <td id="texto" style="border-bottom: .5px solid">{{no_tripulantes}}</td>
                                  <td id="texto">E.T.D.</td>
                                  <td id="texto" style="border-bottom: .5px solid">{{etdReporte}}</td>
                                </tr>
                                <tr>
                                  <td id="texto">Procedencia</td>
                                  <td id="texto" style="border-bottom: .5px solid">{{procedencia_solicitud}}</td>
                                  <td id="texto" >Estadia</td>
                                  <td id="texto" style="border-bottom: .5px solid">{{estadia}}</td>
                                </tr>
                               
                            
                              </tbody>
                            </table>
                            <br>
                             <table style="width: 100%; height: 50px;">
                              <thead style="background-color:#EFEEEE">
                                <tr>
                                  <th id="texto" colspan="8">Características de la Embarcación</th>         
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                    <td id="texto">Bandera</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.bandera}}</td>
                                    <td id="texto">T.R.B.</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.tbr}}</td>
                                    <td id="texto">Eslora</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.eslora}}</td>
                                    <td id="texto" >Manga</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.manga}}</td>
                                </tr>
                                  <tr>
                                    <td id="texto" >Pto. Matricula</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.pto_matricula}}</td>
                                    <td id="texto">T.R.N.</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.trn}}</td>
                                    <td id="texto">Puntal</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.puntal}}</td>
                                    <td id="texto">IMO</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.imo}}</td>
                                  </tr>
                                  <tr>
                                    <td id="texto">No. Matricula</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.matricula}}</td>
                                    
                                    <td id="texto">Clase</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.tipo}}</td>
                                    <td id="texto">Calado</td>
                                    <td id="texto" style="border-bottom: .5px solid">{{embarcacion.calado}}</td>
                                   
                                  </tr>
                              </tbody>
                            </table><br>
                    
                                  <table id="texto" style="width: 100%; height: 50px;">
                              <thead style="background-color:#EFEEEE">
                                <tr>
                                  <th colspan="8">Servicios portuarios requeridos</th>         
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                    <td >Pto. Fijo</td>
                                    <td>
                                          <input
                                            v-if="check1=='jj'"
                                              type="checkbox"
                                              name="optiona"
                                              id="opta"
                                              checked
                                            />
                                          <input
                                          v-if="!check1"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                    </td>
                                    <td>Atraque</td>
                                    <td>
                                          <input
                                             v-if="check2=='jj'"
                                              type="checkbox"
                                              name="optiona"
                                              id="opta"
                                              checked
                                            />
                                          <input
                                          v-if="!check2"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                     </td>
                                    <td>Cuota por arribo a embarcaciones menores</td>
                                    <td>
                                       <input
                                             v-if="check3=='jj'"
                                              type="checkbox"
                                              name="optiona"
                                              id="opta"
                                              checked
                                            />
                                          <input
                                          v-if="!check3"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                     </td>
                                  
                                </tr>
                                  <tr>
                                    <td style="border-color:white">Pto. Variable</td>
                                    <td style="border-color:white">
                                       <input
                                             v-if="check4=='jj'"
                                              type="checkbox"
                                              name="optiona"
                                              id="opta"
                                              checked
                                            />
                                          <input
                                          v-if="!check4"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                    </td>
                                    <td style="border-color:white">Muellaje</td>
                                    <td style="border-color:white"> 
                                       <input
                                             v-if="check5=='jj'"
                                              type="checkbox"
                                              name="optiona"
                                              id="opta"
                                              checked
                                            />
                                          <input
                                          v-if="!check5"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                 </td>
                                 
                                    <td style="border-color:white">Embarque y desembarque de pasajeros</td>
                                    <td style="border-color:white">
                                       <input
                                             v-if="check6=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                          v-if="!check6"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                        </td>
                                  
                                  </tr>
                                  <tr>      
                                   
                                  </tr>
                            
                              </tbody>
                              
                            </table>

                            <br>
                            

                                <table style="width: 100%; height: 50px;">
                              <thead style="background-color:#EFEEEE">
                                <tr>
                                  <th id="texto" colspan="8">Programa de actividades del buque en el puerto</th>         
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                    <td id="texto" >{{comentarios}}</td>
                                   
                                </tr>
                                <tr>
                                   
                                   <td ></td>
                                </tr>
                                

                           
                            
                              </tbody>
                            </table>
                             
                                      <table style="width: 100%; height: 50px;">
                              <thead style="background-color:#EFEEEE">
                                <tr>
                                  <th id="texto" colspan="8">Servicios portuarios requeridos</th>         
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                    <td id="texto">Piloto</td>
                                    <td>
                                       <input
                                            v-if="checka=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                        v-if="!checka" 
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                      
                                    </td>
                                    <td id="texto">Amarre de cabos</td>
                                    <td>
                                      <input
                                            v-if="checkb=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!checkb"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                    </td>
                                    <td id="texto">Lubricantes</td>
                                    <td>
                                      <input
                                            v-if="checkc=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!checkc"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                     </td>
                                     <td style="color:white" >Lubricante</td>
                                    <td>
                                      
                                     </td>
                                  
                                </tr>
                                  <tr>
                                    <td id="texto" style="border-color:white">Suministro de agua potable</td>
                                    <td style="border-color:white">
                                      <input
                                            v-if="checkd=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!checkd"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                                                        </td>
                                    <td id="texto" style="border-color:white">Combustible</td>
                                    <td style="border-color:white"> 
                                      <input
                                            v-if="checke=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!checke"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                                       </td>
                                    <td id="texto" style="border-color:white">Almacenaje</td>
                                    <td style="border-color:white">
                                      <input
                                            v-if="checkf=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!checkf"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                                                      </td>
                                  
                                  </tr>
                                  <tr>
                                    <td id="texto" style="border-color:white">Recoleccion de Basura</td>
                                    <td style="border-color:white">
                                      <input
                                            v-if="checkg=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!checkg"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                                                          </td>
                                    
                                    <td id="texto" style="border-color:white">Avituallamiento</td>
                                    <td style="border-color:white">
                                      <input
                                            v-if="checkh=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!checkh"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                                         </td>

                                      <td id="texto" style="border-color:white">Reparacion a flote</td>
                                    <td style="border-color:white">
                                      <input
                                            v-if="checki=='jj'"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!checki"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                                                        </td>
                                  </tr>
 
                            
                              </tbody>

                               <tbody style="border-color:white">
                                <tr>
                                    <td id="texto"  >Otro</td>
                                     <td  id="texto" style="border-bottom: .5px solid" colspan="6">{{otros_servicios}}</td>
                                  
                                </tr>

                               
                               
                                 
                              </tbody>
                                <tbody style="border-color:white">
                                

                               
                               
                                 
                              </tbody>
                              
                              
                            </table>
                            <br>
                          <table v-if="otroServicio" class="table table-sm">
                            
                              <tbody>
                                <tr>
                                  <td  style="border-color:white">Otro</td>
                                  
                                     <td style="border-color:white"></td>
                                    <td style="border-color:white"></td>
                                </tr>
                                <tr>
                                   
                                   <td style="border-color:white"></td>
                                   <td ></td>
                                   
                                </tr>                           
                              </tbody>
                            </table>

                            <table style="width: 100%; height: 50px;">
                              <thead style="background-color:#EFEEEE">
                                <tr>
                                  <th id="texto" colspan="8">Tipo de Carga</th>         
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                    <td id="texto">Operación de</td>
                                    <td id="texto">
                                       Carga 
                                    </td>
                                    <td>
                                      
                                        <input
                                           v-if="operacion_carga"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                            v-if="!operacion_carga"
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                       
                                   </td>
                                    <td id="texto">Descarga</td>
                                    <td>
                                        <input
                                          v-if="operacion_descarga"
                                              type="checkbox"
                                              color="red"
                                              name=""
                                              id="opta"
                                              checked
                                            />
                                          <input
                                           v-if="!operacion_descarga" 
                                            type="checkbox"
                                            name="optiona"
                                            id="opta"
                                          />
                                      
                                       
                                    </td>
                                     <td id="texto">Total de toneladas</td>
                                     <td id="texto">{{total_toneladas}}</td>
                                  
                                </tr>

                                 <tr>
                                    <td style="border-color:white"></td>
                                    <td style="border-color:white"></td>
                                    <td style="border-color:white"></td>
                                    <td style="border-color:white"></td>
                                    <td style="border-color:white"></td>
                                    <td></td>
                                    <td ></td>
                                  
                                </tr>
                               
                                 
                              </tbody>

                              <tbody style="border-color:white">
                                <tr>
                                    <td  id="texto">Tipo de Carga</td>
                                     <td id="texto" style="border-bottom: .5px solid" colspan="6">{{tipo_carga}}</td>
                                  
                                </tr>

                               
                               
                                 
                              </tbody>
                              
                            </table>
                            <br>
                              <table style="width: 100%; height: 50px;">
                              <thead style="background-color:#EFEEEE">
                                <tr>
                                  <th id="texto" colspan="8">Responder aviso (exclusivo Administración Portuaria Integral S.A de C.V).<br>En atención a la solicitud para el uso de infraestructura o atraque en los muelles se le responde:</th>         
                                </tr>
                                
                              </thead>

                              
                              <tbody>
                                
                                <tr>
                                    <td id="texto">Solicitud de arribo</td>
                                    <td id="texto" v-if="estado==3">SU{{folioId}}</td>
                                    <td id="texto">Posición de atraque</td>
                                    <td></td>
                                    <td id="texto">Hora de atraque</td>
                                    <td></td>
                                    
                                </tr>
                                  <tr>
                                    <td id="texto" style="border-color:white">Muelle de atraque</td>
                                    <td id="texto" v-if="estado==3">{{muelle}}</td>
                                    <td id="texto" style="border-color:white">Numero de bita</td>
                                    <td></td>
                                    
                                   
                                  </tr>
                                 
                                  <tr>
                                    <td style="border-color:white"></td>
                                    <td></td>
                                    
                                    <td style="border-color:white"></td>
                                    <td></td>
                                    <td style="border-color:white"></td>
                                    <td></td>
                                    <td style="border-color:white"></td>
                                    <td style="border-color:white"></td>
                                  </tr>
                           

                           
                            
                              </tbody>
                              
                            </table>
<br>
                             <table style="width: 100%; height: 50px;">
                              <thead >
                                <tr >
                                  <th id="texto" style="border-color:white">Asimismo nos hacemos garantes de los gastos durante la estadía que esta embarcación genere</th>  <br>
                                       
                                </tr>
                              </thead>
                               <tbody style="border-color:white">
                                  <tr>
                                    <td id="texto" style="background-color:#EFEEEE; border-color:white">Comentarios y observaciones generales</td>
                                   
                                </tr>
                                <tr>
                                    <td id="texto" >{{observaciones}}</td>
                                   
                                </tr>
                                <tr>
                                   
                                   <td ></td>
                                </tr>
                                

                           
                            
                              </tbody>
                            </table>
                       

                  </div>
                          
              </div>
   
                   
                         
          </div>
 
      </div> 
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="ocultarComprobante()" small>Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <template v-if="item.estado==1">
            <v-icon class="mr-2" @click="activarDesactivarMostrar(1,item)">check</v-icon>
          </template>
          <template v-if="item.estado==3 || item.estado==1">
            <v-icon class="mr-2" @click="activarDesactivarMostrar(2,item)">block</v-icon>
          </template>

          <template v-if="item.estado">
            <v-icon class="mr-2" @click="mostrarComprobante(item)">print</v-icon>
          </template>
        </template>

        <template v-slot:item.eta="{ item }">{{ item.eta | moment("dddd Do MMMM YYYY, h:mm:ss a")}}</template>
        <template v-slot:item.etd="{ item }">{{ item.etd | moment("dddd Do MMMM YYYY, h:mm:ss a")}}</template>
          <template v-slot:item.folio="{ item }">
          SU{{item.folio_solicitud}}
      </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>

      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 lg4 x14>
            <v-autocomplete v-model="embarcacion" :items="embarcaciones" label="Embarcaciones"></v-autocomplete>
          </v-flex>

          <v-flex xs12 sm4 lg4 x14>
            <v-autocomplete :items="agencias" v-model="agencia" label="Agencias"></v-autocomplete>
          </v-flex>

          <v-flex xs12 sm4 lg4 x14>
            <v-autocomplete v-model="procedencia" :items="procedencia" label="Procedencia"></v-autocomplete>
          </v-flex>

          <v-flex xs12 sm4 lg4 x14>
            <v-datetime-picker label="Ingrese la ETA de la embarcación" locale="es" v-model="eta"></v-datetime-picker>
          </v-flex>

          <v-flex xs12 sm4 lg4 x14>
            <v-datetime-picker label="Ingrese la ETD de la embarcación" v-model="etd"></v-datetime-picker>
          </v-flex>

          <v-flex xs12 sm4 lg8 x14>
            <v-textarea v-model="comentarios" clearable="clearable" label="Detalles"></v-textarea>
          </v-flex>

          <v-flex xs12 sm2 md12 lg12 xl12>
            <v-btn class="ma-2" @click.native="guardar()" small outlined color="indigo">Guardar</v-btn>
            <v-btn class="ma-2" @click.native="ocultarNuevo()" small outlined color="red">Salir</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import "font-awesome/css/font-awesome.min.css"; // Ensure you are using css-loader
import DatetimePicker from "vuetify-datetime-picker";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import emailjs from "emailjs-com";
import swal from "sweetalert";
import moment from 'moment'

export default {
  icons: {
    iconfont: "fa4"
  },
  data() {
    return {
      dialog: false,
      search: "",
      solicitudUnica: [],
      headers: [
        { text: "Actions", value: "action", sortable: false },
        { text: "Solicitante", value: "usuario[0].nombre", sortable: true },
        { text: "Folio", value: "folio", sortable: true },
        { text: "ETA", value: "eta", sortable: true },
        { text: "ETD", value: "etd", sortable: true },
        { text: "Procedencia", value: "procedencia", sortable: false },
        { text: "Embarcacion", value: "embarcacion.nombre", sortable: false },
        { text: "Estado", value: "estado", sortable: true }
      ],
      editedIndex: -1,
      _id: "",
      embarcacion: "",
      embarcaciones: [],
      procedencia: [
        "CARMEN",
        "DOS BOCAS",
        "FRONTERA",
        "TUXPAN",
        "SEYBAPLAYA",
        "AREA DE PLATAFORMAS"
      ],
      nombreCompleto: "",
      agencias: [],
      nombre: "",
      observaciones:'',
      tipo_carga:'',
      total_toneladas:'',
      operacion_descarga:'',
      operacion_carga:'',
      estadia:'',
      no_tripulantes:'',
      capitan:'',
      muelle:'',
      fecha_solicitud:'',
      otroServicio:'',
      otros_servicios:'',
          checka:'',
            checkb:'',
            checkc:'',
            checkd:'',
            checke:'',
            checkf:'',
            checkg:'',
            checkh:'',
            checki:'',

            check1:'',
            check2:'',
            check3:'',
            check4:'',
            check5:'',
            check6:'',
      agencia2: "",
      motivo_cancelacion: "",
      pasajeros: [],
      verNuevo: 0,
      eta: "",
      fechaSolicitada: "",
      etd: "",
      date: "",
      agencia: "",
      fecha: "",
      folio: "",
      comprobanteModal: 0,
      procedencia_solicitud: "",
      usuario: "",

      dialogs: false,
      etaReporte: "",
      etdReporte: "",
      aprobacionAmls: "",
      aprobacionApi: "",
      fecha_real: "",
      agenciasUsuario: [],
      folio: "",
      folioId: "",
      estado: "",
      comentarios: "",
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
    this.selectEmbarcaciones();
    this.selectAgencias();
    this.emailIn();
  },

  methods: {

    emailIn(){
      emailjs.init("user_QA8qMBuyHCQIHTgR0AsPx");
     },

      enviar(embarcacion,procedencia,solicitante,detalles,eta,etd,muelle,status,cancelacion,correo){
                        var template_params = {
                          "correo":correo,
                          "procedencia": procedencia,
                          "embarcacion": embarcacion,
                          "solicitante": solicitante,
                          "detalles" : detalles,
                          "eta": eta,
                          "etd": etd,
                          "muelle": muelle,
                          "status":status,
                           "cancelacion":cancelacion
                          
                        }
                        
                       emailjs.send("gmail","solicitudUnica", template_params)
                        .then(function(response) {
                            if(response.text === 'OK'){
                              
                              
                            }
                           console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
                        }, function(err) {
                            alert('Ocurrió un problema al enviar el correo');
                           console.log("FAILED. error=", err);
                        });
                
       },

    crearPDF() {
      var quotes = document.getElementById("solicitudGuardia");
      html2canvas(quotes).then(function(canvas) {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 200;
        var pageHeight = 305;

        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        var doc = new jsPDF("p", "mm", "a4");
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save("solicitudUA.pdf");
      });
    },

    mostrarComprobante(item) {
       this.limpiar();
            this.embarcacion = item.embarcacion
            this.solicitud = item.solicitud
            this.procedencia_solicitud = item.procedencia
            this.comentarios=item.comentarios
            this.folioId = item.folio_solicitud
            this.etaReporte =  moment(item.eta).format('MMMM Do YYYY, H:mm')
            this.etdReporte =  moment(item.etd).format('MMMM Do YYYY, H:mm')
            this.capitan = item.capitan
            this.no_tripulantes = item.no_tripulantes
            this._id = item._id
            console.log(moment(item.fechaAprobacion).format('MMMM Do YYYY, h:mm a'))
            var fechaAprobacion = item.fechaAprobacion
            var fechaActual = new Date()
            var fechaAprobacionDate = new Date(fechaAprobacion);
            var minutoSumar = 5;

            fechaAprobacionDate.setMinutes(fechaAprobacionDate.getMinutes() + minutoSumar);

            if(fechaActual>=fechaAprobacionDate){
                this.bandera = true
               
            }else{
              this.bandera = false
              
            }
          
            this.fecha_solicitud= moment(item.createdAt).format('MMMM Do YYYY, H:mm')
            
           
            var fecha1 = moment(item.eta);
            var fecha2 = moment(item.etd);

            var a = (fecha2.diff(fecha1, 'days'));
            var b = (fecha2.diff(fecha1, 'hours'));
            var horas = b-(a*24)
            var estadia = (a+' Dia'+' y '+horas+' Horas')

            //Checkbox
           if(item.infraestructura[0]=='Pto. Fijo' || item.infraestructura[1]=='Pto. Fijo' || item.infraestructura[2]=='Pto. Fijo' || item.infraestructura[3]=='Pto. Fijo' || item.infraestructura[4]=='Pto. Fijo'|| item.infraestructura[5]=='Pto. Fijo'){
              this.check1= 'jj'
           }
           if(item.infraestructura[0]=='Atraque' || item.infraestructura[1]=='Atraque' || item.infraestructura[2]=='Atraque' || item.infraestructura[3]=='Atraque' || item.infraestructura[4]=='Atraque'|| item.infraestructura[5]=='Atraque'){
              this.check2= 'jj'
           }
           if(item.infraestructura[0]=='Cuota por arribo a embarcaciones menores' || item.infraestructura[1]=='Cuota por arribo a embarcaciones menores' || item.infraestructura[2]=='Cuota por arribo a embarcaciones menores' || item.infraestructura[3]=='Cuota por arribo a embarcaciones menores' || item.infraestructura[4]=='Cuota por arribo a embarcaciones menores'|| item.infraestructura[5]=='Cuota por arribo a embarcaciones menores'){
              this.check3= 'jj'           
           } if(item.infraestructura[0]=='Pto. Variable' || item.infraestructura[1]=='Pto. Variable' || item.infraestructura[2]=='Pto. Variable' || item.infraestructura[3]=='Pto. Variable' || item.infraestructura[4]=='Pto. Variable'|| item.infraestructura[5]=='Pto. Variable'){
              this.check4= 'jj'

           }
            if(item.infraestructura[0]=='Muellaje' || item.infraestructura[1]=='Muellaje' || item.infraestructura[2]=='Muellaje' || item.infraestructura[3]=='Muellaje' || item.infraestructura[4]=='Muellaje'|| item.infraestructura[5]=='Muellaje'){
              this.check5= 'jj'
           }

            if(item.infraestructura[0]=='Embarque y desembarque de pasajeros' || item.infraestructura[1]=='Embarque y desembarque de pasajeros' || item.infraestructura[2]=='Embarque y desembarque de pasajeros' || item.infraestructura[3]=='Embarque y desembarque de pasajeros' || item.infraestructura[4]=='Embarque y desembarque de pasajeros'|| item.infraestructura[5]=='Embarque y desembarque de pasajeros'){
              this.check6= 'jj'
           }

           if(item.servicios_portuarios[0]=='Piloto' || item.servicios_portuarios[1]=='Piloto' || item.servicios_portuarios[2]=='Piloto' || item.servicios_portuarios[3]=='Piloto' || item.servicios_portuarios[4]=='Piloto'|| item.servicios_portuarios[5]=='Piloto' || item.servicios_portuarios[6]=='Piloto' || item.servicios_portuarios[7]=='Piloto' || item.servicios_portuarios[8]=='Piloto'){
              this.checka= 'jj'
           }
           if(item.servicios_portuarios[0]=='Amarre de cabos' || item.servicios_portuarios[1]=='Amarre de cabos' || item.servicios_portuarios[2]=='Amarre de cabos' || item.servicios_portuarios[3]=='Amarre de cabos' || item.servicios_portuarios[4]=='Amarre de cabos'|| item.servicios_portuarios[5]=='Amarre de cabos' || item.servicios_portuarios[6]=='Amarre de cabos' || item.servicios_portuarios[7]=='Amarre de cabos' || item.servicios_portuarios[8]=='Amarre de cabos'){
              this.checkb= 'jj'
           }
           if(item.servicios_portuarios[0]=='Lubricantes' || item.servicios_portuarios[1]=='Lubricantes' || item.servicios_portuarios[2]=='Lubricantes' || item.servicios_portuarios[3]=='Lubricantes' || item.servicios_portuarios[4]=='Lubricantes'|| item.servicios_portuarios[5]=='Lubricantes' || item.servicios_portuarios[6]=='Lubricantes' || item.servicios_portuarios[7]=='Lubricantes' || item.servicios_portuarios[8]=='Lubricantes'){
              this.checkc= 'jj'
           
           } if(item.servicios_portuarios[0]=='Suministro de agua potable' || item.servicios_portuarios[1]=='Suministro de agua potable' || item.servicios_portuarios[2]=='Suministro de agua potable' || item.servicios_portuarios[3]=='Suministro de agua potable' || item.servicios_portuarios[4]=='Suministro de agua potable'|| item.servicios_portuarios[5]=='Suministro de agua potable' || item.servicios_portuarios[6]=='Suministro de agua potable' || item.servicios_portuarios[7]=='Suministro de agua potable' || item.servicios_portuarios[8]=='Suministro de agua potable'){
              this.checkd= 'jj'

           }
            if(item.servicios_portuarios[0]=='Combustible' || item.servicios_portuarios[1]=='Combustible' || item.servicios_portuarios[2]=='Combustible' || item.servicios_portuarios[3]=='Combustible' || item.servicios_portuarios[4]=='Combustible'|| item.servicios_portuarios[5]=='Combustible' || item.servicios_portuarios[6]=='Combustible' || item.servicios_portuarios[7]=='Combustible' || item.servicios_portuarios[8]=='Combustible'){
              this.checke ='jj'
           }

            if(item.servicios_portuarios[0]=='Almacenaje' || item.servicios_portuarios[1]=='Almacenaje' || item.servicios_portuarios[2]=='Almacenaje' || item.servicios_portuarios[3]=='Almacenaje' || item.servicios_portuarios[4]=='Almacenaje'|| item.servicios_portuarios[5]=='Almacenaje' || item.servicios_portuarios[6]=='Almacenaje' || item.servicios_portuarios[7]=='Almacenaje' || item.servicios_portuarios[8]=='Almacenaje'){
              this.checkf= 'jj'
           }
            if(item.servicios_portuarios[0]=='Recoleccion de Basura' || item.servicios_portuarios[1]=='Recoleccion de Basura' || item.servicios_portuarios[2]=='Recoleccion de Basura' || item.servicios_portuarios[3]=='Recoleccion de Basura' || item.servicios_portuarios[4]=='Recoleccion de Basura'|| item.servicios_portuarios[5]=='Recoleccion de Basura' || item.servicios_portuarios[6]=='Recoleccion de Basura' || item.servicios_portuarios[7]=='Recoleccion de Basura' || item.servicios_portuarios[8]=='Recoleccion de Basura'){
              this.checkg= 'jj'
           }

            if(item.servicios_portuarios[0]=='Avituallamiento' || item.servicios_portuarios[1]=='Avituallamiento' || item.servicios_portuarios[2]=='Avituallamiento' || item.servicios_portuarios[3]=='Avituallamiento' || item.servicios_portuarios[4]=='Avituallamiento'|| item.servicios_portuarios[5]=='Avituallamiento' || item.servicios_portuarios[6]=='Avituallamiento' || item.servicios_portuarios[7]=='Avituallamiento' || item.servicios_portuarios[8]=='Avituallamiento' ){
              this.checkh= 'jj'
           }
            if(item.servicios_portuarios[0]=='Reparaciones a flote' || item.servicios_portuarios[1]=='Reparaciones a flote' || item.servicios_portuarios[2]=='Reparaciones a flote' || item.servicios_portuarios[3]=='Reparaciones a flote' || item.servicios_portuarios[4]=='Reparaciones a flote'|| item.servicios_portuarios[5]=='Reparaciones a flote' || item.servicios_portuarios[6]=='Reparaciones a flote' || item.servicios_portuarios[7]=='Reparaciones a flote' || item.servicios_portuarios[8]=='Reparaciones a flote' ){
              this.checki= 'jj'
           }

           
            this.estadia=estadia;
            this.muelle = item.muelle
            this.usuario = item.usuario
            this.aprobacionApi = item.aprobacionApi
            this.aprobacionAmls = item.aprobacionAmls
            this.observaciones = item.observaciones
            this.operacion_descarga = item.operacion_descarga
            this.tipo_carga = item.tipo_carga
            this.operacion_carga = item.operacion_carga
            this.total_toneladas = item.total_toneladas
            this.otros_servicios = item.otros_servicios
            this.detalles = item.comentarios
            this.listarAgencia(item.usuario[0].agencia._id)
            this.estado = item.estado
            this.comprobanteModal=1     
    },
    ocultarComprobante(item) {
      this.comprobanteModal = 0;
    },

    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
    },

    eliminarPasajero(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },

    selectEmbarcaciones() {
      let me = this;
      let embarcacionArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("embarcacion/list", configuracion)
        .then(response => {
          embarcacionArray = response.data;
          embarcacionArray.map(function(x) {
            me.embarcaciones.push({ text: x.nombre, value: x._id });
          });
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
        .get("agencia/list", configuracion)
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

    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.rol) {
        this.validaMensaje.push("El rol es obligatorio");
      }
      if (this.empresa.length < 1 || this.empresa.length > 30) {
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

    listarAgencia(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("agencia/query?_id=" + id, configuracion)
        .then(function(response) {
          me.agenciasUsuario = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    agregarDetalle() {
      this.pasajeros.push({
        nombreCompleto: "",
        identificacion: "",
        libretaMar: "",
        destino: ""
      });
    },
    limpiar() {
      this._id = "";

      (this.usuario = ""),
        (this.folio = ""),
        (this.agencia = ""),
        (this.fecha = ""),
        (this.pasajeros = []),
        (this.valida = 0),
        (this.validaMensaje = []),
        (this.editedIndex = -1);
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      if (this.editedIndex > -1) {
        console.log(this.eta.toLocaleString());
        axios
          .put(
            "solicitudUnica/update",
            {
              _id: this._id,
              embarcacion: this.embarcacion,
              usuario: this.$store.state.usuario._id,
              detalles: this.detalles,
              agencia: this.agencia,
              eta: this.eta.toLocaleString(),
              etd: this.etd.toLocaleString(),
              comentarios: this.comentarios,
              procedencia: this.procedencia
            },
            configuracion
          )
          .then(function(response) {
            me.close();
            me.ocultarNuevo();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        console.log(this.eta);
        axios
          .post(
            "solicitudUnica/add",
            {
              embarcacion: this.embarcacion,
              usuario: this.$store.state.usuario._id,
              detalles: this.detalles,
              agencia: this.agencia,
              eta: this.eta.toLocaleString(),
              etd: this.etd.toLocaleString(),
              comentarios: this.comentarios,
              procedencia: this.procedencia
            },
            configuracion
          )
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    listar() {
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let me = this;
      axios
        .get("solicitudUnica/listAdmin", configuracion)
        .then(function(response) {
          me.solicitudUnica = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("solicitudUnica/query?_id=" + id, configuracion)
        .then(function(response) {
          console.log(configuracion);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    verGuardia(item) {
      this.limpiar();
      this.fecha = item.fecha;
      this.folio = item.folio;
      this.detalles = item.detalles;
      this.agencia = item.agencia._id;
      this.embarcacion = item.embarcacion._id;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
    },

    editItem(item) {
      this.limpiar();
      this.eta = item.eta;
      this.etd = item.etd;
      this.procedencia = item.procedencia;
      this.comentarios = item.comentarios;
      this.agencia = item.agencia._id;
      this.embarcacion = item.embarcacion._id;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this._id = item._id;

      this.editedIndex = 1;
      this.dialog = false;
      this.verNuevo = 1;
    },



     listarEmbarcacion(embarcacion,procedencia,usuario,detalles,eta,etd,muelle,estado,cancelacion,correo){
           
            let header={"Token":this.$store.state.token};
            let me=this;
            let embarcacio
            
            let configuracion= {headers: header}
            axios.get('embarcacion/query?_id='+embarcacion,configuracion).then(function (response){
            embarcacio=response.data;
            console.log(estado)
            let status="aprobada"
            let cancelacion=''
              me.enviar(embarcacio,procedencia,usuario,detalles,eta,etd,muelle,status,cancelacion,correo)
            }).catch(function(error){
              console.log(error)
            })
          },

            listarEmbarcacionCancelada(embarcacion,procedencia,usuario,detalles,eta,etd,muelle,estado,cancelacion,correo){
           
            let header={"Token":this.$store.state.token};
            let me=this;
            let embarcacio
            
            let configuracion= {headers: header}
            axios.get('embarcacion/query?_id='+embarcacion,configuracion).then(function (response){
            embarcacio=response.data;
            console.log(estado)
            let status="cancelada"
            console.log(correo)
              me.enviar(embarcacio,procedencia,usuario,detalles,eta,etd,muelle,status,cancelacion,correo)
            }).catch(function(error){
              console.log(error)
            })
          },

    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.folio_solicitud;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adMmodal = 0;
      }
    },
      imprimir(){
            var objeto = document.getElementById("solicitudGuardia"); //obtenemos el objeto a imprimir
      var ventana = window.open("", "_blank"); //abrimos una ventana vacía nueva
      ventana.document.write(objeto.innerHTML); //imprimimos el HTML del objeto en la nueva ventana
      ventana.document.close(); //cerramos el documento
      ventana.print(); //imprimimos la ventana
      ventana.close(); //cerramos la ventana
          },

    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "solicitudUnica/deactivateApi",
          {
            _id: this.adId,
            aprobacionApi: this.$store.state.usuario.nombre,
            motivo_cancelacion: this.motivo_cancelacion
          },
          configuracion
        )
        .then(function(response) {
                 me.listarEmbarcacionCancelada(response.data.embarcacion, response.data.procedencia,response.data.usuario.nombre,response.data.comentarios,moment(response.data.eta).format('MMMM Do YYYY, h:mm a'),moment(response.data.etd).format('MMMM Do YYYY, h:mm a'),response.data.muelle,status,me.motivo_cancelacion,response.data.usuario.email)
          swal(
            "Solicitud Cancelada",
            "Solicitud Cancelada con exito",
            "success"
          );
          me.ocultarComprobante();
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
    aprobarApi(item) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let cancelacion= ''
      axios
        .put(
          "solicitudUnica/aprobarApi",
          { _id: this.adId, aprobacionApi: this.$store.state.usuario.nombre },
          configuracion
        )
        .then(function(response) {
          me.listarEmbarcacion(response.data.embarcacion, response.data.procedencia,response.data.usuario.nombre,response.data.comentarios,moment(response.data.eta).format('MMMM Do YYYY, h:mm a'),moment(response.data.etd).format('MMMM Do YYYY, h:mm a'),response.data.muelle,status,cancelacion,response.data.usuario.email)
          swal("Solicitud Aprobada", "Solicitud Aprobada con exito", "success");
          me.ocultarComprobante();
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
        .put(
          "solicitudUnica/deactivateApi",
          { _id: this.adId, aprobacionApi: this.$store.state.usuario.nombre },
          configuracion
        )
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