import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

declare module "vuex" {
  type StoreStateType = typeof store.state;
  type ModulesType = {
    common: typeof common.state;
  }
  export function useStore<S = StoreStateType & ModulesType>(): Store<S>;
}