<template>
<div id="main">
			<h2 class="top_title">基于jQuery+JSON的省市联动效果</h2>
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
			</div>
				<h2 class="top_title">仿淘宝四级联动</h2>
				<div class="cndzk-entrance-division" style="width:500px;margin:20px;margin-bottom:400px;">
				<div class="cndzk-entrance-division-header"><span class="cndzk-entrance-division-header-label"><div class="next-form-item-label"><label required="">地址信息:</label></div></span><div class="cndzk-entrance-division-header-click"><span class="cndzk-entrance-division-header-click-input"><p class="placeholder" data-spm-anchor-id="0.0.0.i0.650e175cHMvmAz">请选择省/市/区/街道</p></span><span class="cndzk-entrance-division-header-click-icon"></span></div></div>
		        <div class="cndzk-entrance-division-box" style="display:none;"><ul class="cndzk-entrance-division-box-title"><li class="cndzk-entrance-division-box-title-level active" style="width: 25%;">省</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">市</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">区</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">街道</li></ul><ul class="cndzk-entrance-division-box-content"><div></div></ul></div>
				</div>
		</div>
</template>

<script>
 export default {
        data () {
            return {
                api:"/public/json/street.json"
            }
        },
        methods:{
          
        },
         mounted:function(){
			 var division={
				division:".cndzk-entrance-division",
				divisionheader:".cndzk-entrance-division-header",
				divisionbox:".cndzk-entrance-division-box",
				divisiontitle:".cndzk-entrance-division-box-title",
				divisioncontent:".cndzk-entrance-division-box-content div",
				url:"/public/json/street.json",
				current_json:null,
				current_array:[],
				current_index:[],
				init:function(){
					this.division=$(this.division);
					this.divisionheader=$(this.divisionheader);
					this.divisionbox=$(this.divisionbox);
					this.divisioncontent=$(this.divisioncontent);
					this.divisiontitle=$(this.divisiontitle);
					this.event();
				},
				initData:function(){
					$.getJSON(this.url,function(json){
						division.current_json=json;
						division.divisioncontent.empty();
						division.initTag(division.current_json);
			        });
				},
				initTag:function(json){
					this.current_json=json;
                    $.each(json,function(n,item){
						var li='<li class="cndzk-entrance-division-box-content-tag ">'+item.name+'</li>';
						division.divisioncontent.append(li);
					});
					//如果已经加载
					if($(".cndzk-entrance-division-header-click-input p").length==0){
						this.setActive();
					}
					this.tagClick();
				},
				initCity:function(index){
					this.divisioncontent.empty();
					var citydata=this.current_json[index].children;
					this.initTag(citydata);
				},
				setActive:function(){
					var active=division.divisiontitle.find("li.active").index();
					var textlen=this.current_array.length;
					if(textlen==4){
					  var index=this.current_array[3].index;
                      this.divisioncontent.find('li:eq('+index+')').addClass("active");
					}else
					{
						this.divisiontitle.find("li").off("click");
					    this.divisiontitle.find("li:lt("+textlen+")").on("click",function(){
							  division.divisioncontent.empty();
							  var index=$(this).index();
							  var json=division.current_array[index];
							  division.initTag(json.json);
							  division.divisioncontent.find("li").removeClass("active");
							  division.divisioncontent.find('li:eq('+json.index+')').addClass("active");
							  division.divisiontitle.find("li").removeClass("active");
					          division.divisiontitle.find('li:eq('+index+')').addClass("active");
						});
					}

				},
				headerClick:function(){
					division.divisioncontent.empty();
					if(!division.current_json){
							division.divisioncontent.append("加载中……");
							division.initData();
						}else
						{
							//判断是否加载过
						    division.initTag(division.current_json);
						}
					   division.divisionbox.show();
				},
				tagClick:function(){
				   this.divisioncontent.find("li").click(function(){
						 var active=division.divisiontitle.find("li.active").index();
						 var index=$(this).index();
						 var activeindex=division.divisioncontent.find("li.active").index();
						 $(".cndzk-entrance-division-header-click-input").children(":eq("+active+")").remove();
						 division.current_array.splice(active);
						 division.current_array.push({index:index,json: division.current_json});
						 $(".cndzk-entrance-division-header-click-input").empty();
						 $.each(division.current_array,function(n,item){
							var name=item.json[item.index].name;
							var headerName='<span><span class="cndzk-entrance-division-header-click-input-name ">'+name+'</span>';
							var headerSymbol='<span class="cndzk-entrance-division-header-click-input-symbol">'+(n==3?"":"/")+'</span></span>';
							$(".cndzk-entrance-division-header-click-input").append(headerName+headerSymbol);
						 });
						 if(active==3){
							  division.divisionbox.hide();
							  return;
						 }
						 var next=active+1;
                         division.initCity(index);
						 division.divisiontitle.find("li").removeClass("active");
					     division.divisiontitle.find('li:eq('+next+')').addClass("active");
				   });
				},
				event:function(){
					this.division.click(function(event){
						//取消事件冒泡
						var e = event;
						if (e && e.stopPropagation) {
							// this code is for Mozilla and Opera
							e.stopPropagation();
						} else if (window.event) {
							// this code is for IE
							window.event.cancelBubble = true;
						}
						if($(".cndzk-entrance-division-header-click-input").find(e.target).length>0||$(e.target).hasClass("cndzk-entrance-division-header-click-input"))
						  division.headerClick();
					});

					 $(document).click(function () {    
						 division.divisionbox.hide();
					 }); 

				}
		      }
			   division.init();
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
					prov:"江苏省",
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
