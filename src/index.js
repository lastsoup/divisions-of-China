/*webpack入口文件*/
import Vue from 'vue';
import index from './components/index1.vue';
import area from './components/city.vue';
var myVue = new Vue({
    el:"#firstVue",
    components: {'my-component': index,'my-area': area},
    data:{
        data:'行政区域'
    }
})