 <template>
    <v-layout align-start>
       <form action='http://localhost:3000/upload' method="POST" enctype="multipart/form-data" >
        <input type="file" name="file">
        <input type="submit" value="Subir">
        </form>
          
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <input
              type="file"
              ref="file"
              @change="onSelect"
             />
              <div class="fields">
                  <button>Submit</button>
              </div>
            <div class="message">
               <h5>{{message}}</h5>
            </div>
         
          </form>

            <form enctype="multipart/form-data">
            <input
              type="file"
              ref="file"
              
             />
          <!--  <input
              type="file"
              ref="file"
              
             />-->
            <!-- <div class="fields">
                  <button @click="guardar">Submit</button>
              </div>-->

            <div class="my-2">
             <v-btn text small color="primary" @click="guardar">Guardar</v-btn>
            </div>

            <div class="message">
               <h5>{{message}}</h5>
            </div>
         
          </form>

        
    </v-layout>
 </template>



<script>
import axios from 'axios'; 
export default {
    data(){
        return{
         file:'',
          message:''
        }

  },
  methods:{

          onSelect(){
           
          },

          guardar(){
            const file = this.$refs.file.files[0];
            this.file = file;
            const formData = new FormData();
            formData.append('file',this.file);
            axios.post('upload',formData)
            this.message = 'Good'
          },

          async onSubmit(){
           
            try{
              const reg = await axios.post('upload',formData);
              res.status(200).json(reg);
            }
            catch(err){
              console.log(err);
              this.message = 'Something went wrong'
            }
          }
  
    }
  
}
</script>