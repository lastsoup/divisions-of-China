<template>
<div id="main">
			<h2 class="top_title">jquery.cityselect.js基于jQuery+JSON的省市联动效果</h2>
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
					$("#city_6").citySelect({prov:"湖南省", city:"长沙市", dist:"岳麓区",town:"岳麓街道",});
				</pre>
			</div>
			
		</div>
</template>
<script>
 export default {
        data () {
            return {
                msg: 'Hello 6World!',
                api:"/public/json/street.json"
            }
        },
        methods:{

        },
         mounted:function(){
               $("#city_1").citySelect({
                    url:this.api,
					nodata:"none",
					required:false
				}); 
				$("#city_2").citySelect({
					url:this.api,
					prov:"北京市",
					nodata:"none"
				});

				$("#city_3").citySelect({
					url:this.api,
					prov:"北京市",
					nodata:"none"
				});
				
				$("#city_4").citySelect({
					 url:this.api,
					prov:"湖南省", 
					city:"长沙市"
				});
				$("#city_5").citySelect({
					 url:this.api,
					prov:"湖南省", 
					city:"长沙市",
					dist:"岳麓区",
					nodata:"none"
				}); 

				$("#city_6").citySelect({
					 url:this.api,
					prov:"湖南省", 
					city:"长沙市",
					dist:"岳麓区",
					town:"岳麓街道",
					nodata:"none"
				}); 
         }
    }
</script>
