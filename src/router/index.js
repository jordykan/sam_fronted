import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Embarcacion from '../components/Embarcacion.vue'
import Archivo from '../components/Archivo.vue'
import Login from '../components/Login.vue'
import store from '../store'
import Usuario from '../components/Usuario.vue'
import Pasajeros from '../components/Pasajeros.vue'
import SolicitudUnica from '../components/SolicitudUnica.vue'
import CambiosGuardia from '../components/CambiosGuardia.vue'
import EstatusSolicitud from '../components/EstatusSolicitud'
import Agencia from '../components/Agencia.vue'
import Solicitudes from '../components/Solicitudes.vue'
import Consultas from '../components/Consultas.vue'
import SolicitudUnicaAdmin from '../components/SolicitudUnicaAdmin.vue'
import SolicitudApitab from '../components/SolicitudApitab.vue'
import CambioGuardiaApi from '../components/CambioGuardiaApi.vue'
import Test from '../components/Test.vue'
import Reporte1 from '../components/Reporte1'
import VehiculosPersonal from '../components/VehiculosPersonal.vue'
import Bitacora from '../components/Bitacora.vue'
import VehiculoPersonalApi from '../components/VehiculosPersonalApi'
import VehiculoPersonalAdmin from '../components/VehiculosPersonalAdmin.vue'
import Reportes from '../components/Reportes.vue'
import Companias from '../components/Companias.vue'
import BitacoraEmbarcaciones from '../components/BitacoraEmbarcaciones.vue'
import Perfil from '../components/Perfil.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{
        administrador:true,
        cliente:true,
        apitab:true
      }
    },
    {
      path: '/',
      name: 'perfil',
      component: Perfil,
      meta:{
        administrador:true,
        cliente:true,
        apitab:true
      }
    },
    {
      path: '/solicitud_unica',
      name: 'solicitud_unica',
      component: SolicitudUnica,
      meta:{
        cliente:true
      }
      
    },
    {
      path: '/solicitud_unica_admin',
      name: 'solicitud_unica_admin',
      component: SolicitudUnicaAdmin,
      meta:{
        administrador:true
      }
      
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: Reportes,
      meta:{
        administrador:true
      }
      
    },
    {
      path: '/vehiculos_personal_admin',
      name: 'vehiculosPersonalAdmin',
      component: VehiculoPersonalAdmin,
      meta:{
        administrador:true
      }
      
    },
    {
      path: '/pasajeros',
      name: 'pasajeros',
      component: Pasajeros,
      meta:{
        cliente:true
      }
      
    },

    {
      path: '/companias',
      name: 'companias',
      component: Companias,
      meta:{
        cliente:true
      }
      
    },
    {
      path: '/solicitudes',
      name: 'solicitudes',
      component: Solicitudes,
      meta:{
        administrador:true
      }
      
    },

    {
      path: '/consultas',
      name: 'consultas',
      component: Consultas,
      meta:{
        administrador:true
      }
      
    },

    {
      path: '/reporte1',
      name: 'reporte1',
      component: Reporte1,
      meta:{
        administrador:true
      }
      
    },


    {
      path: '/agencia',
      name: 'agencia',
      component: Agencia,
      meta:{
        cliente:true,
        administrador:true
      }
      
    },
    {
      path: '/cambios_guardia',
      name: 'cambios_guardia',
      component: CambiosGuardia,
      meta:{
        cliente:true,
        administrador:true
      }
      
    },
    {
      path: '/estatus_solicitud',
      name: 'estatus_solicitud',
      component: EstatusSolicitud,
      meta:{
        cliente:true
      }
      
    },
    {
      path: '/embarcacion',
      name: 'embarcacion',
      component: Embarcacion,
      meta:{
        administrador:true,
      } 
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: Usuario,
      meta:{
        administrador:true
      }
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta:{
        administrador:true
      }
    },
  
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta:{
        libre:true
      }         
    },

    {
      path: '/solicitud',
      name: 'solicitud_apitab',
      component: SolicitudApitab,
      meta:{
        apitab:true,
       

      }         
    },
    {
      path: '/vehiculosPersonalApi',
      name: 'vehiculos_personal_api',
      component: VehiculoPersonalApi,
      meta:{
        apitab:true,
       

      }         
    },
    {
      path: '/cambio_guardia',
      name: 'cambio_guardia_api',
      component: CambioGuardiaApi,
      meta:{
        apitab:true,
       
      }         
    },
    {
      path: '/vehiculos_personal',
      name: 'vehiculos_personal',
      component: VehiculosPersonal,
      meta:{
        cliente:true
      }
    },  
    {
      path: '/bitacora',
      name: 'bitacora',
      component: Bitacora,
      meta:{
        administrador:true
      }
    },

    {
      path: '/bitacoraEmbarcaciones',
      name: 'bitacoraEmbarcaciones',
      component: BitacoraEmbarcaciones,
      meta:{
        administrador:true
      }
    }

  ]
})

router.beforeEach((to,from,next)=>{
  if(to.matched.some(record => record.meta.libre)){
    next()
  } else if(store.state.usuario && store.state.usuario.rol == 'Administrador'){
      if(to.matched.some(record => record.meta.administrador)){
        next()
      }      
  }
  else if(store.state.usuario && store.state.usuario.rol == 'Cliente'){
    if(to.matched.some(record => record.meta.cliente)){
      next()
    }   
}
else if(store.state.usuario && store.state.usuario.rol == 'APITAB'){
  if(to.matched.some(record => record.meta.apitab)){
    next()
  }   
}
else{
    next({name:'login'});
  }
})
export default router
