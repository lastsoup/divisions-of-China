/*webpack入口文件*/
import Vue from 'vue';
import index from './components/index.vue';
import area from './components/city.vue';
var myVue = new Vue({
    el:"#firstVue",
    components: {'my-component': index,'my-area': area},
    data:{
        myData:"vue:5444778"
    }
})