import BootstrapVue from 'bootstrap-vue';
import VueModal from 'vue-js-modal';
import NumberFormat from 'vue-filter-number-format';

require('./core/index');
require('./core/bootstrap');
window.Vue = require('vue');

Vue.use(BootstrapVue);
Vue.use(VueModal, App.Modals.Options);

Vue.filter('num_format', NumberFormat);

Vue.component('cars-table-view', require('./components/Home').default);

new Vue(require('./components/App').default);