import { createStore } from 'vuex'
import { authModule } from './authModule'
import { apiGateWayModule } from './apiGateWayModule'

export default createStore({
  modules:{
    auth:authModule,
    apigw:apiGateWayModule
  }
})
