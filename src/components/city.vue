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
					$("#city_1").citySelect(); 
				</pre>
			   </div>
				<h2 class="top_title"><i class="iconfont">&#xe601;</i>仿淘宝四级联动</h2>
				<pre>
					$.divisionpicker();
					或
					$("#taobao").divisionpicker();
				</pre>
				<div id="taobao"></div>
				<h2 class="top_title"><i class="iconfont">&#xe601;</i>移动端区域联动</h2>
				 <!-- <div class="content-block">
					<input id="demo1" type="text" readonly="" placeholder="城市选择特效"  value="广东省,深圳市,南山区"/>
					<input id="value1" type="hidden" value="20,234,504"/>
				</div> -->
				<!-- <section class="g-flexview">
					<section class="g-scrollview">
						<div class="m-celltitle">默认调用</div>
						<div class="m-cell">
							<div class="cell-item">
								<div class="cell-left">所在地区：</div>
								<div class="cell-right cell-arrow">
									<input type="text" class="cell-input" readonly id="J_Address" value="" placeholder="请选择收货地址">
								</div>
							</div>
						</div>

						<div class="m-celltitle">设置默认值</div>
						<div class="m-cell">
							<div class="cell-item">
								<div class="cell-left">所在地区：</div>
								<div class="cell-right cell-arrow">
									<input type="text" class="cell-input" readonly id="J_Address2" value="中国 新疆维吾尔自治区 乌鲁木齐市 天山区" placeholder="请选择收货地址">
								</div>
							</div>
						</div>
					</section>
				</section> -->
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
			   $("#city_1").cityselect();

			    // var area1=new MArea({
				// 	'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
				// 	'valueTo': '#value1', //选择完毕后id属性输出到该位置
				// 	'keys': {
				// 		id: 'id',
				// 		name: 'name'
				// 	}, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
				// 	'type': 1, //数据源类型
				// 	'data': "http://192.168.0.71:3004/public/json/city.json" //数据源
				// });
				// area1.value=[1,15,3];//控制初始位置，注意：该方法并不会影响到input的value

				// var area2 = new MArea({
				// 	'trigger': '#demo2',
				// 	'valueTo': '#value2',
				// 	'keys': {
				// 		id: 'value',
				// 		name: 'text'
				// 	},
				// 	'type': 2,
				// 	'data': [provs_data, citys_data, dists_data]
				// });

         }
    }
</script>
