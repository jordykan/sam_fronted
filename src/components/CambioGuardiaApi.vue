<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="cambiosGuardia"
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
            </v-avatar>Aprobado AMLS
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
            <v-chip small class="ma-2" color="primary" text-color="white"  v-if="item.estado==4">
          <v-avatar left>
            <v-icon small>verified</v-icon>
          </v-avatar>
           Finalizado
         </v-chip>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Solicitud de embarque y desembarque de personal</v-toolbar-title>
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
                <v-card-title class="headline" v-if="adAccion==2">Anular Solicitud</v-card-title>

                <v-card-text>
                  Estas a punto de
                  <span v-if="adAccion==1">Aprobar</span>
                  <span v-if="adAccion==2">Anular</span>
                  la solicitud con folio CG{{adNombre}}
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
                  <v-btn @click="activarDesactivarCerrar()" color="error" small>Salir</v-btn>
                  <v-btn v-if="adAccion==1" @click="activarApi()" small color="primary">Aprobar</v-btn>
                  <v-btn v-if="adAccion==2" @click="activar()" small color="orange">Anular</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="comprobanteModalPasajero" max-width="1000px">
              <v-card>
                <v-card-title class="headline">
                  <v-btn @click="printDivPasajeros()">
                    <v-icon>print</v-icon>
                  </v-btn>Reporte de Entrada
                </v-card-title>
                <v-card-text>
                  <div id="solicitudGuardiaPasajeros">
                    <br />
                    <br />
                    <header>
                      <link
                        rel="stylesheet"
                        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                        crossorigin="anonymous"
                      />
                     <div style="float: left; margin-left:2%;margin-right:2%">
                        <img
                          style="width:100px"
                          src="data:image/png;base64,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"
                          id="imagen"
                        />
                      </div>
                      <div style="margin-left:80%;margin-right:2%">
                        <img
                          style="width:100px"
                          src="data:image/jpeg;base64,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"
                        />
                      </div>
                      <div style="float:left;margin-top:0%;margin-left:15%;margin-right:2%">
                        <p
                          style="text-align:center;margin-left:10px;margin-right:10px;font-size:16px"
                        >
                          <strong id="texto">Solicitud de Entrada</strong>
                          <br />
                          <strong id="texto">CG-{{folio}}</strong>
                          <br />
                        </p>
                      </div>
                      <br />
                      <br />
                      <div></div>
                      <br />
                      <div style="margin-left: 66%;">Frontera, Tab. a: {{fecha}}</div>
                    </header>
                    <br />

                    <section>
                      <table class="table table-sm">
                        <thead class="thead-dark">
                          <tr>
                            <th colspan="8">Pasajeros</th>
                          </tr>
                        </thead>
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">RFC</th>
                            <th scope="col">Libreta de Mar</th>
                            <th scope="col">NSS</th>
                            <th scope="col">Destino</th>
                            <th scope="col">Emb/Des</th>
                            <th scope="col">Estatus</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(det, index) in pasajeros" :key="det._id">
                            <td>{{index+1}}</td>

                            <td>{{det.nombreCompleto}}</td>
                            <td>{{det.rfc}}</td>
                            <td>{{det.identificacion}}</td>
                            <td>{{det.nss}}</td>
                            <td>{{det.destino}}</td>
                            <td>{{det.estatus}}</td>
                            <td>{{det.estado}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </section>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="ocultarComprobantePasajero()" small>Salir</v-btn>
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
                  <div id="solicitudGuardia">
                    <br />
                    <br />
                        <header>
                      <link
                        rel="stylesheet"
                        media="print"
                        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                        crossorigin="anonymous"
                      />

                      <link
                        rel="stylesheet"
                        media="screen"
                        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                        crossorigin="anonymous"
                      />
                    </header>
                    <br />
                  
                   <div id="agencia">
                     
                      
                      <div  style="float: left; margin-left:2%;margin-right:2%">
                        <img 
                        style="width:100px"
                        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gKgSUNDX1BST0ZJTEUAAQEAAAKQbGNtcwQwAABtbnRyUkdCIFhZWiAH4wALABYAEQAHAANhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAADhjcHJ0AAABQAAAAE53dHB0AAABkAAAA
                        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wb2iefah9qPIdldpjn3pxhQZQ5jpsd+X3bZBUbTYiSUFYLKbB+a0pcWbzk+7FGiuqvpbJypqaMh4IhjJyrErXwssSXyZxyxwjTFNjfQWKxVijB2pcpzJR3loKYMJ7EE4OVJ1nVdpLYvig4HVdtsnKmNHlSrvA0dMzN5SSYefBTtqcdNnnwcdv2tQ6LirURLkPRSigghulNmSTDz/wDJf//aAAwDAQACAAMAAAAQ88888888888888888888888888888888888883888888888888888888888Egp8GMT888888888888888888lhhkHUD888888888888888888H5p2xdR8888888888888888ck0G00IHLr88888888888888FsCKEAocztQN8888888888888AF8xNtouALNVA888888888888+NJiqF6ESLzac888888888888+FMBx0AOWKQt88888888888888X8C3B7nACQU8888888888888+wqyozjgMB8V8888888888888yZDyv2erw++L8888888888888888ZpJDua28W8888888888888s8867VABhj8t8888888888888n88Sk8o6LFm888888888888887HIGR2oTjKw88888888888888yAQKACoSya088888888888888Eq6C9og88BZe88888888888888IDApZVRr6FJ8888888888888888888s888888888888888888h3eCorfHEA/7r888888888888sZMA7pzfSpNLp888888888888cQl0uQV7N8I/wDPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP/xAAoEQEAAgECBQMFAQEAAAAAAAABABEhMUEQMFFxoWGRsUCBwdHwUOH/2gAIAQMBAT8Q/wAW1X9M9SFu5FDLMwAz+Y7rlLsMoiL6NaDWoOZmPKGYG9MXrMuMyzbmKyfRqm5mRSUBUsK/iZqs61+f+R0UWxGFqIrfoQVolaqofUQr31gbZXtBBXWLNvxGrNneG9iLYWc+gQPuhizdwLlku5eeHDOJaRV1lwJ7qDpzrrAnmb3iaQmlPSeHwtplGvsgBVp6RkmuLnV074JekVg3g5gr0xD0gvQiyMEAwVHQvSLsDnrvDtAuuO0slbQaWp7RK3zCk9YixohROkwcZjobvxPjc90rwQ1aYgaiQUeqYDFYqO85GUCChhTOj5iK2fH56475RdcIAXWHbzrM1bvC9spZT0cdcPj85BZgGngy+r7MKDZ9mDB2lxuNN1wKpDP5XP5XAUt452v2eKhRCkMV+SEKgAGjOoiAWTj4XO1+zxWixGTiE2yQi6ov/WZNF3h4vO1OzxMLDYTbh4cMzMRVwQtaTxedqdmWg1qYiItK4eDMkcMugYM2bzxedsnRhmLFEr9RGy4LK0QzmeHLyzVKTJFYni86nixrTbgvsY2TqbRBKeDxQLuaZlG+Oe
                        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"id="imagen" />
                      </div>
                      <div style="margin-left:80%;margin-right:2%">
                        <img
                         style="width:100px"
                          src="data:image/jpeg;base64,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"
                        />
                      </div>
                       <div style="float:left;margin-top:0%;margin-left:15%;margin-right:2%">
                        <p
                          style="text-align:center;margin-left:10px;margin-right:10px;font-size:16px"
                        >
                          <strong id="texto">Solicitud de Entrada</strong>
                          <br />
                          <strong id="texto">CG-{{folio}}</strong>
                          <br />
                        </p>
                      </div>
                      <br />

                      <br />
                      <div id="texto" style="margin-left: 66%;">
                        Frontera, Tab. a: {{fecha}}
                        <br />
                        <font size="3">
                          <strong>Solicitud de {{operacion}}</strong>
                        </font>
                      </div>
                      <br />
                      <p id="texto">
                        De conformidad y en cumplimiento a lo estipulado en las Reglas de Operación de la APITAB en su capitulo IV.- "Acceso y
                        vialidades del Puerto" Regla 19, 20, 21 y 22 y Código Internacional de Protección a Buques e Instalaciones Portuarias.
                      </p>

                      <p id="texto">
                        Solicito la
                        <strong>ENTRADA</strong> a las areas del recinto portuario concesionadas a la administracion portuaria
                        integral de Tabasco S.A. de C.V con Fecha
                        <strong>{{fecha_solicitud}}</strong> del personal y vehiculos que a continuacion se enlistan
                      </p>
                    </div>
                    <br />
                   
 <div id="agencia">
                      <table style="width: 100%; height: 50px;">
                        <tbody>
                          <tr>
                            <td id="texto" style="border: hidden">Nombre del Solicitante</td>

                            <td id="texto" style="border-bottom: .5px solid">{{nombre}}</td>
                          </tr>

                          <tr>
                            <td id="texto" style="border: hidden">Cargo</td>

                            <td id="texto" style="border-bottom: .5px solid">{{cargo}}</td>
                          </tr>

                          <tr>
                            <td id="texto" style="border: hidden">Agencia Naviera</td>

                            <td
                              id="texto"
                              style="border-bottom: .5px solid"
                            >{{agenciasUsuario.nombre}}</td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="width: 80%; height: 50px;">
                        <tbody>
                          <tr>
                            <td id="texto">Contratista</td>
                            <td>
                              <input
                                v-if="tipo=='Contratista'"
                                type="checkbox"
                                name="optiona"
                                id="opta"
                                checked
                              />
                              <input
                                v-if="tipo=='Armador'"
                                type="checkbox"
                                name="optiona"
                                id="opta"
                              />
                            </td>
                            <td id="texto">Armador</td>
                            <td>
                              <input
                                v-if="tipo=='Armador'"
                                type="checkbox"
                                name="optiona"
                                id="opta"
                                checked
                              />
                              <input
                                v-if="tipo=='Contratista'"
                                type="checkbox"
                                name="optiona"
                                id="opta"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="width: 100%; height: 100px;">
                        <thead style=" background-color:gray; color:black;">
                          <tr>
                            <th colspan="11">Características de la Embarcación</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td id="texto" colspan="3">Nombre de la embarcación</td>
                            <td
                              id="texto"
                              colspan="8"
                              style="border-bottom: 1px solid"
                            >{{embarcacion.nombre}}</td>
                          </tr>
                          <tr>
                            <td colspan="3" style="border-color:white"></td>
                            <td colspan="8"></td>
                          </tr>
                        </tbody>

                        <tbody style="border-color:white">
                          <tr>
                            <td
                              id="texto"
                              colspan="3"
                              style="border-color:white"
                            >Al servicio de la compañia</td>
                            <td id="texto" colspan="8" style="border-bottom: 1px solid">{{compania}}</td>
                          </tr>
                          <tr>
                            <td id="texto" colspan="3" style="border-color:white"></td>
                            <td id="texto" colspan="8"></td>
                          </tr>
                        </tbody>

                        <tbody style="border-color:white">
                          <tr>
                            <td id="texto" style="border-color:white">Tipo</td>
                            <td id="texto" style="border-bottom: 1px solid">{{embarcacion.tipo}}</td>

                            <td id="texto">Bandera</td>
                            <td id="texto" style="border-bottom: 1px solid">{{embarcacion.bandera}}</td>
                            <td id="texto">T.R.B.</td>
                            <td id="texto" style="border-bottom: 1px solid">{{embarcacion.tbr}}</td>
                            <td id="texto">Eslora</td>
                            <td id="texto" style="border-bottom: 1px solid">{{embarcacion.eslora}}</td>
                            <td id="texto">Manga</td>
                            <td id="texto" style="border-bottom: 1px solid">{{embarcacion.manga}}</td>

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
                            <td></td>
                            <td style="border-color:white"></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                      <br />
                      <table style="width: 100%; height: 100px; border: 1px solid #000000;">
                        <thead
                          style="background-color:gray; color:black; border: 1px solid #000000;"
                        >
                          <tr>
                            <th colspan="8">Lista de Personal</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style="border: 1px solid #000000;">
                            <td id="texto" style="border: 1px solid #000000;">#</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Nombre</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Compañia</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Puesto</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >No. de Licencia</td>
                          </tr>
                          <tr v-for="(det, index) in pasajeros" :key="det._id">
                            <td style="border: 1px solid #000000; text-align:center">{{index+1}}</td>

                            <td
                              id="texto"
                              style="border: 1px solid #000000;text-align:center"
                            >{{det.nombre}}{{det.apellidoPaterno}}&nbsp;{{det.apellidoMaterno}}</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >{{det.compania}}</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >{{det.puesto}}</td>
                            <td id="texto" style="border: 1px solid #000000; text-align:center"></td>
                          </tr>
                        </tbody>
                      </table>

                      <br />

                      <table style="width: 100%; height: 100px; border: 1px solid #000000;">
                        <thead
                          style="background-color:gray; color:black; border: 1px solid #000000;"
                        >
                          <tr>
                            <th colspan="8">Vehiculos</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style="border: 1px solid #000000;  !important; ">
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Marca</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Modelo</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Color</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Placas</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Compañia de aseguradora</td>
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >Vigencia de seguro</td>
                          </tr>
                          <tr>
                            <td></td>

                            <td style="border: 1px solid #000000;"></td>
                            <td style="border: 1px solid #000000;"></td>
                            <td style="border: 1px solid #000000;"></td>
                            <td style="border: 1px solid #000000;"></td>
                            <td style="border: 1px solid #000000;"></td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="width: 80%; height: 100px;">
                        <tbody>
                          <tr>
                            <td id="texto" style="border-color:white">Ingreso de material o equipo</td>
                            <td id="texto" style="border-color:white">
                              <input
                                v-if="ingreso_mat"
                                type="checkbox"
                                name="optiona"
                                id="opta"
                                checked
                              />
                              <input v-if="!ingreso_mat" type="checkbox" name="optiona" id="opta" />
                            </td>
                            <td id="texto" style="border-color:white">Retiro de material o equipo</td>
                            <td style="border-color:white">
                              <input
                                v-if="retiro_mat"
                                type="checkbox"
                                name="optiona"
                                id="opta"
                                checked
                              />
                              <input v-if="!retiro_mat" type="checkbox" name="optiona" id="opta" />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="width: 100%; height: 100px; border: 1px solid #000000;">
                        <thead
                          style="background-color:gray; color:black; border: 1px solid #000000;"
                        >
                          <tr>
                            <th colspan="8">Motivo de la visita</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style="border: 1px solid #000000;">
                            <td
                              id="texto"
                              style="border: 1px solid #000000; text-align:center"
                            >{{detalles}}</td>
                          </tr>
                        </tbody>
                      </table>
                   <br>
                   Aprobación AMLS <label id="texto">{{aprobacionAmls}}</label><br>
                   Aprobación APITAB <label id="text">{{aprobacionApi}}</label>
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
        <template v-slot:item.fecha="{ item }">{{ item.fecha.join(' al ')}}</template>
 <template v-slot:item.list_p="{ item }">
          <v-icon small class="mr-2" @click="mostrarComprobantePasajero(item)">fa fa-file-pdf-o</v-icon>
        </template>
        <template v-slot:item.action="{ item }">
          <template v-if="item.estado==1">
            <v-icon class="mr-2" @click="activarDesactivarMostrar(1,item)">check</v-icon>
          </template>
          <template v-if="item.estado==3 || item.estado==1">
            <v-icon class="mr-2" @click="activarDesactivarMostrar(2,item)">block</v-icon>
          </template>

          <v-icon
            v-if="item.estado==1 || item.estado==0  || item.estado==2 || item.estado==3 || item.estado==4" 
            class="mr-2"
            @click="mostrarComprobante(item)"
          >print</v-icon>
        </template>

        <template v-slot:item.adjunto="{ item }">
          <v-icon small class="mr-2" @click="descargarCG(item)">fa fa-file-pdf-o</v-icon>
        </template>
        <template v-slot:item.folio="{ item }">CG{{ item.folio}}</template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>

      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 lg4 x14>
            <v-text-field v-model="folio" label="Folio"></v-text-field>
          </v-flex>
          <v-flex xs12 sm4 lg4 x14>
            <v-text-field v-model="fecha" type="date" label="Fecha"></v-text-field>
          </v-flex>
          <v-flex xs12 sm4 lg4 x14>
            <v-autocomplete v-model="embarcacion" :items="embarcaciones" label="Embarcaciones"></v-autocomplete>
          </v-flex>

          <v-flex xs12 sm4 lg8 x14>
            <v-textarea v-model="detalles" clearable="clearable" label="Detalles"></v-textarea>
          </v-flex>

          <v-flex xs12 sm2 md2 lg2 x12>
            <v-btn small fab dar color @click="agregarDetalle()">
              <v-icon dark>group_add</v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs12 sm2 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="cabeceraDetalles"
                :items="pasajeros"
                class="elevation-1"
                hide-default-footer
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-center">
                    <v-text-field v-model="props.items.nombreCompleto"></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    <v-text-field v-model="props.items.identificacion"></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    <v-text-field v-model="props.items.nss"></v-text-field>
                  </td>
                  <td class="text-xs-center">
                    <v-text-field v-model="props.items.destino"></v-text-field>
                  </td>
                </template>
                <template v-slot:item.borrar="{ item }">
                  <v-icon small @click="eliminarPasajero(pasajeros,item)">delete</v-icon>
                </template>

                <template v-slot:item.nombreCompleto="{ item }">
                  <td class="text-xs-center">
                    <v-text-field clearable="clearable" v-model="item.nombreCompleto"></v-text-field>
                  </td>
                </template>
                <template v-slot:item.identificacion="{ item }">
                  <td class="text-xs-center">
                    <v-text-field clearable="clearable" v-model="item.identificacion"></v-text-field>
                  </td>
                </template>
                <template v-slot:item.libretaMar="{ item }">
                  <td class="text-xs-center">
                    <v-text-field clearable="clearable" v-model="item.nss"></v-text-field>
                  </td>
                </template>
                <template v-slot:item.destino="{ item }">
                  <td class="text-xs-center">
                    <v-text-field clearable="clearable" v-model="item.destino"></v-text-field>
                  </td>
                </template>
              </v-data-table>
            </template>
          </v-flex>
          <v-flex xs12 sm2 md12 lg12 xl12>
            <v-btn
              class="ma-2"
              v-if="verDetallee==0"
              @click.native="guardar()"
              outlined
              color="indigo"
            >Guardar</v-btn>
            <v-btn class="ma-2" @click.native="ocultarNuevo()" outlined color="red">Cancel</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import DatetimePicker from "vuetify-datetime-picker";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import swal from "sweetalert";
import emailjs from 'emailjs-com';

export default {
  icons: {
    iconfont: "fa4",
  },
  data() {
    return {
      dialog: false,
      search: "",
      cambiosGuardia: [],
      headers: [
        { text: "Actions", value: "action", sortable: false },
        { text: "Usuario", value: "usuario[0].nombre", sortable: true },
        { text: "Folio", value: "folio", sortable: true },
        { text: "Muelle", value: "muelle", sortable: true },
        { text: "Fecha", value: "fecha", sortable: false },
        { text: "Embarcacion", value: "embarcacion.nombre", sortable: false },
        { text: "Estado", value: "estado", sortable: true },
                { text: "Lista de Pasajeros", value: "list_p", sortable: false },
        { text: "Adjunto", value: "adjunto" },
      ],
      editedIndex: -1,
      _id: "",
      embarcacion: "",
      embarcaciones: [],
      agenciasUsuario: [],
      muelle: "",
      usuario: "",
      nombreCompleto: "",
      agencias: [],
      folio: "",
      fecha_solicitud: "",
      nombre: "",
      cargo:"",
      agencia2: "",
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Nombre Completo", value: "nombreCompleto" },
        { text: "Identificacion", value: "identificacion" },
        { text: "Seguro Social", value: "nss" },
        { text: "Destino", value: "destino" },
      ],
      pasajeros: [],
      verNuevo: 0,
      verDetallee: 0,
      fecha: "",
      estado: "",
      detalles: "",
      aprobacionAmls: "",
      razon_social: "",
      operacion: "",
      tipo: "",
      compania: "",
      ingreso_mat: "",
      retiro_mat: "",

      aprobacionApi: "",
      motivo_cancelacion: "",
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      comprobanteModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva Cambio de Guardia"
        : "Editar Cambio de Guardia";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.selectEmbarcaciones();
    this.selectAgencias();
     this.emailIn()
  },



  methods: {
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    descargarCG(item) {
      window.open(item.adjunto, "_blank");
    },

      emailIn(){
                  emailjs.init("user_QA8qMBuyHCQIHTgR0AsPx");
              },

               enviar(fecha,embarcacion,muelle,detalles,operacion,usuario,status,cancelacion,correo){
                 

                        var template_params = {
                          "fecha": fecha,
                          "embarcacion": embarcacion,
                          "muelle": muelle,
                          "detalles" : detalles,
                          "operacion": operacion,
                          "usuario": usuario,
                          "status": status,
                          "cancelacion":cancelacion,
                          "correo":correo
                       
                        }
                        
                       emailjs.send("gmail","cambioguardia", template_params)
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
      html2canvas(quotes).then(function (canvas) {
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
        doc.save("solicitudCG.pdf");
      });
    },

    imprimir(){
        var objeto = document.getElementById("solicitudGuardia"); //obtenemos el objeto a imprimir
      var ventana = window.open("", "_blank"); //abrimos una ventana vacía nueva
      ventana.document.write(objeto.innerHTML); //imprimimos el HTML del objeto en la nueva ventana
      ventana.document.close(); //cerramos el documento
      ventana.print(); //imprimimos la ventana
      ventana.close(); //cerramos la ventana
    },

    mostrarComprobante(item) {
      this.limpiar();
      this.folio = item.folio;
      this._id = item._id;
      this.aprobacionAmls = item.aprobacionAmls;
      this.detalles = item.detalles;
      this.aprobacionApi = item.aprobacionApi;
      this.usuario = item.usuario;
      this.nombre = item.usuario[0].nombre
      this.cargo = item.usuario[0].cargo
      this.muelle = item.muelle;
      this.operacion = item.operacion;
      this.compania = item.compania;
      if (item.tipo == "Contratista") {
        this.tipo = "Contratista";
      } else {
        this.tipo = "Armador";
      }

      var fechaAprobacion = item.fechaAprobacion;
      var fechaActual = new Date();
      var fechaAprobacionDate = new Date(fechaAprobacion);
      var minutoSumar = 5;

      fechaAprobacionDate.setMinutes(
        fechaAprobacionDate.getMinutes() + minutoSumar
      );

      if (fechaActual >= fechaAprobacionDate) {
        this.bandera = true;
      } else {
        this.bandera = false;
      }

      this.ingreso_mat = item.ingreso_mat;
      this.retiro_mat = item.retiro_mat;
      this.estado = item.estado;
      this.compania = item.compania;

      this.fecha_solicitud = item.fecha.join(" al ");

      this.listarAgencia(item.usuario[0].agencia);
      var solic_fec = item.fecha;
      var fecha = new Date();
      var options = { year: "numeric", month: "long", day: "numeric" };

      this.tipoServicio = item.tipoServicio;
      this.fecha = fecha.toLocaleDateString("es-ES", options);
      this.embarcacion = item.embarcacion;
      this.listarDetalles(item._id);
      this.comprobanteModal = 1;
    },
    ocultarComprobante(item) {
      this.comprobanteModal = 0;
    },

 ocultarComprobantePasajero(item) {
      this.comprobanteModalPasajero = 0;
    },
    eliminarPasajero(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },

    printDivPasajeros() {
      var objeto = document.getElementById("solicitudGuardiaPasajeros"); //obtenemos el objeto a imprimir
      var ventana = window.open("", "_blank"); //abrimos una ventana vacía nueva
      ventana.document.write(objeto.innerHTML); //imprimimos el HTML del objeto en la nueva ventana
      ventana.document.close(); //cerramos el documento
      ventana.print(); //imprimimos la ventana
      ventana.close(); //cerramos la ventana
    },


    selectEmbarcaciones() {
      let me = this;
      let embarcacionArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("embarcacion/list", configuracion)
        .then((response) => {
          embarcacionArray = response.data;
          embarcacionArray.map(function (x) {
            me.embarcaciones.push({ text: x.nombre, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

      mostrarComprobantePasajero(item) {
      this.limpiar();

      this.listarAgencia(item.usuario.agencia);
      this.folio = item.folio;
      var solic_fec = item.fecha;
      var fecha = new Date();
      this.operacion = item.operacion;
      var options = { year: "numeric", month: "long", day: "numeric" };
      var fec = new Date(solic_fec);
      this.fecha_solicitud = fec.toLocaleString();
      this.fecha = fecha.toLocaleDateString("es-ES", options);
      this.embarcacion = item.embarcacion;
      this.listarDetalles(item._id);
      this.comprobanteModalPasajero = 1;
    },

    selectAgencias() {
      let me = this;
      let agencaiArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("agencia/list", configuracion)
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
        .then(function (response) {
          me.agenciasUsuario = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    agregarDetalle() {
      this.pasajeros.push({
        nombreCompleto: "",
        identificacion: "",
        nss: "",
        destino: "",
      });
    },
    limpiar() {
      this._id = "";
      (this.usuario = ""),
        (this.agencia = ""),
        (this.fecha = ""),
        (this.pasajeros = []),
        (this.valida = 0),
        (this.validaMensaje = []),
        (this.editedIndex = -1);
      this.verDetallee = 0;
    },
    guardar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };

      if (this.editedIndex > -1) {
        axios
          .put(
            "cambioGuardia/update",
            {
              _id: this._id,
              embarcacion: this.embarcacion,
              usuario: this.$store.state.usuario._id,
              detalles: this.detalles,
              agencia: this.agencia,
              fecha: this.fecha,
              pasajeros: this.pasajeros,
            },
            configuracion
          )
          .then(function (response) {
            me.close();
            me.ocultarNuevo();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        axios
          .post(
            "cambioGuardia/add",
            {
              embarcacion: this.embarcacion,
              usuario: this.$store.state.usuario._id,
              detalles: this.detalles,
              agencia: this.agencia,
              fecha: this.fecha,
              pasajeros: this.pasajeros,
              detalles: this.detalles,
            },
            configuracion
          )
          .then(function (response) {
            me.limpiar();
            me.ocultarNuevo();
            me.close();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    listar() {
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let me = this;
      axios
        .get("cambioGuardia/listAdmin", configuracion)
        .then(function (response) {
          me.cambiosGuardia = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("cambioGuardia/query?_id=" + id, configuracion)
        .then(function (response) {
          me.pasajeros = response.data.pasajeros;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    verGuardia(item) {
      this.limpiar();
      this.fecha = item.fecha;
      this.folio = item.folio;
      this.detalles = item.detalles;
      this.embarcacion = item.embarcacion._id;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetallee = 1;
    },

    editItem(item) {
      this.limpiar();
      this.fecha = item.fecha;
      this.folio = item.folio;
      this.detalles = item.detalles;
      this.agencia = item.agencia._id;
      this.embarcacion = item.embarcacion._id;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this._id = item._id;
      this.folio = item.folio;
      this.fecha = item.fecha;
      this.detalles = item.detalles;
      this.editedIndex = 1;
      this.dialog = false;
      this.verNuevo = 1;
    },

    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.folio;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adMmodal = 0;
      }
    },

     listarEmbarcacion(fecha,embar,muelle,detalles,operacion,usuario,cancelacion,correo){
            let header={"Token":this.$store.state.token};
            let me=this;
            let embarcacion
            let configuracion= {headers: header}
            axios.get('embarcacion/query?_id='+embar,configuracion).then(function (response){
            embarcacion=response.data;
            var fechaLocal
              status = 'aprobada'
           
            
            me.enviar(fecha,embarcacion,muelle,detalles,operacion,usuario,status,cancelacion,correo)
            }).catch(function(error){
              console.log(error)
            })
          },

             listarEmbarcacionCancelada(fecha,embar,muelle,detalles,operacion,usuario,cancelacion,correo){
            let header={"Token":this.$store.state.token};
            let me=this;
            let embarcacion
            
            let configuracion= {headers: header}
            axios.get('embarcacion/query?_id='+embar,configuracion).then(function (response){
            embarcacion=response.data;
            var fechaLocal
              status = 'cancelada'
           
           
            me.enviar(fecha,embarcacion,muelle,detalles,operacion,usuario,status,cancelacion,correo)
            }).catch(function(error){
              console.log(error)
            })
          },

    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "cambioGuardia/deactivateApi",
          {
            _id: this.adId,
            aprobacionApi: this.$store.state.usuario.nombre,
            motivo_cancelacion: this.motivo_cancelacion,
          },
          configuracion
        )
        .then(function (response) {
         me.listarEmbarcacionCancelada(response.data.fecha.join(' al '),response.data.embarcacion,response.data.muelle,response.data.detalles,response.data.operacion,me.$store.state.usuario.nombre,me.motivo_cancelacion,response.data.usuario.email)
          swal(
            "Se ah cancelado la solicitud",
            "Se ah cancelado la solicitud con exito ",
            "success"
            
          );
          (me.adModal = 0),
            (me.adAccion = 0),
            (me.adNombre = ""),
            (me.adId = ""),
            me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "cambioGuardia/deactivateApi",
          { _id: this.adId, aprobacionApi: this.$store.state.usuario.nombre },
          configuracion
        )
        .then(function (response) {
          (me.adModal = 0),
            (me.adAccion = 0),
            (me.adNombre = ""),
            (me.adId = ""),
            me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    activarApi() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      let cancelacion=''
      axios
        .put(
          "cambioGuardia/aprobarApi",
          { _id: this.adId, aprobacionApi: this.$store.state.usuario.nombre },
          configuracion
        )
        .then(function (response) {
          me.listarEmbarcacion(response.data.fecha.join(" al "),response.data.embarcacion,response.data.muelle,response.data.detalles,response.data.operacion,me.$store.state.usuario.nombre,cancelacion,response.data.usuario.email)
          swal(
            "Se ah aprobado la solicitud",
            "Se ah aprobado la solicitud con exito ",
            "success"
          );
          
          (me.adModal = 0),
            (me.adAccion = 0),
            (me.adNombre = ""),
            (me.adId = ""),
            me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
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