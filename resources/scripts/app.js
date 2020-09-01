import BootstrapVue from 'bootstrap-vue';
import VueModal from 'vue-js-modal';
import NumberFormat from 'vue-filter-number-format';

require('./core/bootstrap');
window.Vue = require('vue');

Vue.use(BootstrapVue);
Vue.use(VueModal, Options.Modals);

Vue.filter('num_format', NumberFormat);

Vue.component('cars-table-view', require('./components/Home').default);

new Vue(require('./components/App').default);