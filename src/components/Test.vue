<template>
 <v-layout align-start>
    <v-flex>
        <input type="file"  id="csv" ref="csv" name="csv"  label="File input"/>
          <v-btn
                      @click="readFile()"
                      class="mx-2"
                      fab
                      dark
                      small
                      color="success"
                    >
                      <v-icon dark>check</v-icon>
                    </v-btn>

                        <v-col cols="12" class="text--secondary">
                       <v-data-table
    :headers="headers"
    :items="pasajeros"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
                      </v-col>
    </v-flex>
 </v-layout>
    

</template>
<script>

export default {

    data(){
      return{
        adjunto:[],
        availability: [],
        archivo:'',
        file:'',
        csv:[],
        pasajeros:[],
         headers: [
          { text: 'RFC', value: 'rfc' },
          { text: 'Nombre Completo', value: 'nombreCompleto' },
          { text: 'Identificacion', value: 'identificacion' },
          { text: 'NSS', value: 'nss' },
          { text: 'Compania', value: 'compania' },
          { text: 'Puesto', value: 'puesto' },
          { text: 'Destino', value: 'destino' },
        ],
        
      }
      
    },
    methods: {

        fileLeer(){
           
        },
    
        readFile() {
            let me = this
            var file = this.$refs.csv.files[0]
            let pasajerosArray = []
            this.$papa.parse(file, {
                header: true,
                complete: function (results) {
                    me.pasajeros = results.data
                    console.log(me.pasajeros.length)
                    me.pasajeros.splice(me.pasajeros.length-1,1);
                    console.log(me.pasajeros)
                }
            });
           
        },
    
          agregarDetalle(){
            this.availability.push(
              {
                nombreCompleto: '',
                compania: '',
                puesto:'',
                licencia:''
              }
            )
          },
    }
  };
</script>