<template>
<div id="main">
			<h2 class="top_title"><i class="iconfont">&#xe601;</i>基于jQuery+JSON的区域联动插件</h2>
			<div class="demo">
				<div id="city_1">
					<select class="prov"></select> 
					<select class="city" disabled="disabled"></select>
					<select class="dist" disabled="disabled"></select>
				</div>
				<pre>
					var defaults = {
						url:"http://127.0.0.1:3004/public/json/city.json",
						prov:null,//默认值，可不写
						city:null,//默认值，可不写
						dist:null,//默认值，可不写
						required:false,//false:请选择 true：默认第一项
						nodata:false//是否隐藏未选择的
					};
					$("#city_1").citySelect(defaults); 
				</pre>
			</div>
				<h2 class="top_title"><i class="iconfont">&#xe601;</i>仿淘宝四级联动</h2>
				<pre>
					$.divisionpicker();
					或
					$("#taobao").divisionpicker();
				</pre>
				<div id="taobao"></div>
		</div>
</template>

<script>
 export default {
        data () {
            return {
                api:"/public/json/city1.json"
            }
        },
        methods:{
          
        },
         mounted:function(){
			   //$.divisionpicker();
			   $("#taobao").divisionpicker();
			   //$("#city_1").cityselect(); 
			   $("#city_1").cityselect();
			// 	$("#city_2").citySelect({
			// 		url:this.api,
			// 		prov:"北京市",
			// 		nodata:"none"
			// 	});

			// 	$("#city_3").citySelect({
			// 		url:this.api,
			// 		prov:"江苏省",
			// 		nodata:"none"
			// 	});
				
			// 	$("#city_4").citySelect({
			// 		 url:this.api,
			// 		prov:"湖南省", 
			// 		city:"长沙市"
			// 	});
			// 	$("#city_5").citySelect({
			// 		 url:this.api,
			// 		prov:"湖南省", 
			// 		city:"长沙市",
			// 		dist:"岳麓区",
			// 		nodata:"none"
			// 	}); 

			// 	$("#city_6").citySelect({
			// 		 url:this.api,
			// 		prov:"湖南省", 
			// 		city:"长沙市",
			// 		dist:"岳麓区",
			// 		town:"岳麓街道",
			// 		nodata:"none"
			// 	}); 
         }
    }
</script>
