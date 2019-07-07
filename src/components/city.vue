<template>
<div id="main">
			<!-- <h2 class="top_title">基于jQuery+JSON的省市联动效果</h2>
			<div class="demo">
				<h3>直接调用</h3>
				<p>二级联动，默认选项为：请选择</p>
				<div id="city_1">
					<select class="prov"></select> 
					<select class="city" disabled="disabled"></select>
				</div>
				<p>三级联动，默认省份：北京，隐藏无数据的子级select</p>
				<div id="city_2">
					<select class="prov"></select> 
					<select class="city" disabled="disabled"></select>
					<select class="dist" disabled="disabled"></select>
				</div>
				<p>四级联动，默认省份：北京，隐藏无数据的子级select</p>
				<div id="city_3">
					<select class="prov"></select> 
					<select class="city" disabled="disabled"></select>
					<select class="dist" disabled="disabled"></select>
					<select class="town" disabled="disabled"></select>
				</div>
				<pre>
					$("#city_1").citySelect({nodata:"none",required:false}); 
					$("#city_2").citySelect({prov:"北京市",nodata:"none"});
					$("#city_3").citySelect({prov:"江苏省",nodata:"none"});
				</pre>
			</div>
			
			<div class="demo">
				<h3>设置省份、城市、地区（县）的默认值</h3>
				<p>二级联动</p>
				<div id="city_4">
					<select class="prov"></select> 
					<select class="city" disabled="disabled"></select>
				</div>
				<p>三级联动</p>
				<div id="city_5">
					<select class="prov"></select> 
					<select class="city" disabled="disabled"></select>
					<select class="dist" disabled="disabled"></select>
				</div>
				<p>四级联动</p>
				<div id="city_6">
					<select class="prov"></select> 
					<select class="city" disabled="disabled"></select>
					<select class="dist" disabled="disabled"></select>
					<select class="town" disabled="disabled"></select>
				</div>
				<pre>
					$("#city_4").citySelect({prov:"湖南省", city:"长沙市"});
					$("#city_5").citySelect({prov:"湖南省", city:"长沙市", dist:"岳麓区"}); 
					$("#city_6").citySelect({prov:"湖南省", city:"长沙市", dist:"岳麓区",town:"岳麓街道"});
				</pre>
			</div> -->
				<h2 class="top_title"><i class="iconfont">&#xe601;</i>仿淘宝四级联动</h2>
				<pre>
					$.divisionpicker();
					$("#taobao").divisionpicker();
				</pre>
				<div id="taobao"></div>
				<!-- <div class="cndzk-entrance-division suspend" style="width:500px;">
					<div class="cndzk-entrance-division-header">
						<span class="cndzk-entrance-division-header-label"><div class="next-form-item-label"><label required="">地址信息:</label></div></span>
						<div class="cndzk-entrance-division-header-click">
							<span class="cndzk-entrance-division-header-click-input">
								<p class="placeholder">请选择省/市/区/街道</p>
							</span>
							<span class="cndzk-entrance-division-header-click-icon"></span>
						</div>
					</div>
		           <div class="cndzk-entrance-division-box" style="display:none;">
					   <ul class="cndzk-entrance-division-box-title"><li class="cndzk-entrance-division-box-title-level active" style="width: 25%;">省</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">市</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">区</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">街道</li></ul>
					   <ul class="cndzk-entrance-division-box-content"><div></div></ul>
					</div>
				</div> -->
		</div>
</template>

<script>
 export default {
        data () {
            return {
                api:"/public/json/city.json"
            }
        },
        methods:{
          
        },
         mounted:function(){
			   //$.divisionpicker();
			   $("#taobao").divisionpicker();
            //    $("#city_1").citySelect({
            //         url:this.api,
			// 		nodata:"none",
			// 		required:false
			// 	}); 
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
