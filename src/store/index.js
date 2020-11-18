import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import decode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token : null,
    usuario: null,
    _id:null

  },
  mutations: {
    setToken(state,token){
      state.token=token;
    },
    setUsuario(state,usuario){
      state.usuario=usuario
    },
    setId(state,_id){
      state._id=_id
    }
  },
  actions: {
    guardarToken({commit},token){
      commit("setToken",token)
     
      commit("setUsuario",decode(token)) 
      localStorage.setItem("token",token)
    },
    autoLogin({commit}){
      let token = localStorage.getItem("token");
      let _id = localStorage.getItem("_id");
      if(token){
        commit("setToken",token)
        commit("setId",_id)
        commit("setUsuario",decode(token))
      }
      router.push({name:'home'})
    },
    salir({commit}){
      commit("setToken",null)
      commit("setUsuario",null)
      localStorage.removeItem("token")
      router.push({name:'login'})
    }
    
  },
  modules: {
  }
})
