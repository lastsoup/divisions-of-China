/*
Ajax 四级省市区联动
日期：2019-3-6

settings 参数说明
-----
url:省市数据josn文件路径
prov:默认省份
city:默认城市
dist:默认地区（县）
nodata:无数据状态
division：仿淘宝四级联动
<div class="cndzk-entrance-division" style="width:500px;margin:20px;margin-bottom:400px;">
<div class="cndzk-entrance-division-header"><span class="cndzk-entrance-division-header-label"><div class="next-form-item-label"><label required="">地址信息:</label></div></span><div class="cndzk-entrance-division-header-click"><span class="cndzk-entrance-division-header-click-input"><p class="placeholder" data-spm-anchor-id="0.0.0.i0.650e175cHMvmAz">请选择省/市/区/街道</p></span><span class="cndzk-entrance-division-header-click-icon"></span></div></div>
<div class="cndzk-entrance-division-box" style="display:none;"><ul class="cndzk-entrance-division-box-title"><li class="cndzk-entrance-division-box-title-level active" style="width: 25%;">省</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">市</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">区</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">街道</li></ul><ul class="cndzk-entrance-division-box-content"><div></div></ul></div>
</div>
required:必选项
------------------------------ */
(function($){
	$.fn.citySelect=function(options){
		// 默认值
		var settings = $.extend(true,{
			url:"area.json",
			prov:null,
			city:null,
			dist:null,
			nodata:null,
			division:false,
			required:true
		},options);
		var box_obj=this;
		var prov_obj=box_obj.find(".prov");
		var city_obj=box_obj.find(".city");
		var dist_obj=box_obj.find(".dist");
		var town_obj=box_obj.find(".town");
		var prov_val=settings.prov;
		var city_val=settings.city;
		var dist_val=settings.dist;
		var select_prehtml=(settings.required) ? "" : "<option value=''>请选择</option>";
		var city_json;

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
				this.setActive("next");
				this.tagClick();
			},
			UpTag:function(json){
				this.current_json=json;
				$.each(json,function(n,item){
					var li='<li class="cndzk-entrance-division-box-content-tag ">'+item.name+'</li>';
					division.divisioncontent.append(li);
				});
				this.setActive("up");
				this.tagClick();
			},
			setActive:function(tag){
				var active=division.divisiontitle.find("li.active").index()+1;
				var textlen=this.current_array.length;
				if(active<=textlen&&tag=="up"){
					var lastobject=this.current_array[textlen-1];
					this.divisioncontent.find('li:eq('+lastobject.index+')').addClass("active");
				}
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

			},
			headerClick:function(){
				division.divisioncontent.empty();
				if(!division.current_json){
						division.divisioncontent.append("加载中……");
						division.initData();
					}else
					{
						//判断是否加载过
						division.UpTag(division.current_json);
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
						var children=item.json[item.index].children;
						var headerName='<span><span class="cndzk-entrance-division-header-click-input-name ">'+name+'</span>';
						var headerSymbol='<span class="cndzk-entrance-division-header-click-input-symbol">'+(!children?"":"/")+'</span></span>';
						$(".cndzk-entrance-division-header-click-input").append(headerName+headerSymbol);
					 });
					 division.divisioncontent.empty();
					 var citydata=division.current_json[index].children;
					 if(citydata){
						division.initTag(citydata);
					 }else{
						 division.divisionbox.hide();
						 return;
					 }
					 division.divisiontitle.find("li").removeClass("active");
					 division.divisiontitle.find('li:eq('+(active+1)+')').addClass("active");
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

		// 赋值市级函数
		var cityStart=function(){
			var prov_id=prov_obj.get(0).selectedIndex;
			if(!settings.required){
				prov_id--;
			};
			city_obj.empty().attr("disabled",true);
			dist_obj.empty().attr("disabled",true);
			town_obj.empty().attr("disabled",true);

			if(prov_id<0||typeof(city_json[prov_id].children)=="undefined"){
				if(settings.nodata=="none"){
					city_obj.css("display","none");
					dist_obj.css("display","none");
					town_obj.css("display","none");
				}else if(settings.nodata=="hidden"){
					city_obj.css("visibility","hidden");
					dist_obj.css("visibility","hidden");
					town_obj.css("visibility","hidden");
				};
				return;
			};
			
			// 遍历赋值市级下拉列表
			temp_html=select_prehtml;
			$.each(city_json[prov_id].children,function(i,city){
				temp_html+="<option value='"+city.name+"'>"+city.name+"</option>";
			});
			city_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
			distStart();
		};


		// 赋值地区（县）函数
		var distStart=function(){
			var prov_id=prov_obj.get(0).selectedIndex;
			var city_id=city_obj.get(0).selectedIndex;
			if(!settings.required){
				prov_id--;
				city_id--;
			};
			dist_obj.empty().attr("disabled",true);
			town_obj.empty().attr("disabled",true);

			if(prov_id<0||city_id<0||typeof(city_json[prov_id].children[city_id].children)=="undefined"){
				if(settings.nodata=="none"){
					dist_obj.css("display","none");
					town_obj.css("display","none");
				}else if(settings.nodata=="hidden"){
					dist_obj.css("visibility","hidden");
					town_obj.css("visibility","hidden");
				};
				return;
			};
			
			// 遍历赋值市级下拉列表
			temp_html=select_prehtml;
			$.each(city_json[prov_id].children[city_id].children,function(i,dist){
				temp_html+="<option value='"+dist.name+"'>"+dist.name+"</option>";
			});
			dist_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
			if(dist_obj.length!=0)
			townStart();
		};

		// 赋值乡镇街道函数
		var townStart=function(){
			var prov_id=prov_obj.get(0).selectedIndex;
			var city_id=city_obj.get(0).selectedIndex;
			var dist_id=dist_obj.get(0).selectedIndex;
			if(!settings.required){
				prov_id--;
				city_id--;
				dist_id--;
			};
			town_obj.empty().attr("disabled",true);

			if(prov_id<0||city_id<0||typeof(city_json[prov_id].children[city_id].children[dist_id].children)=="undefined"){
				if(settings.nodata=="none"){
					town_obj.css("display","none");
				}else if(settings.nodata=="hidden"){
					town_obj.css("visibility","hidden");
				};
				return;
			};
			
			// 遍历赋值市级下拉列表
			temp_html=select_prehtml;
			$.each(city_json[prov_id].children[city_id].children[dist_id].children,function(i,dist){
				temp_html+="<option value='"+dist.name+"'>"+dist.name+"</option>";
			});
			town_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
		};

		var init=function(){
			// 遍历赋值省份下拉列表
			temp_html=select_prehtml;
			$.each(city_json,function(i,prov){
				temp_html+="<option value='"+prov.name+"'>"+prov.name+"</option>";
			});
			prov_obj.html(temp_html);

			// 若有传入省份与市级的值，则选中。（setTimeout为兼容IE6而设置）
			setTimeout(function(){
				if(settings.prov!=null){
					prov_obj.val(settings.prov);
					cityStart();
					setTimeout(function(){
						if(settings.city!=null){
							city_obj.val(settings.city);
							distStart();
							setTimeout(function(){
								if(settings.dist!=null){
									dist_obj.val(settings.dist);
									townStart();
									setTimeout(function(){
										if(settings.town!=null){
											town_obj.val(settings.town);										
										};
									},1);
								};
							},1);
						};
					},1);
				};
			},1);

			// 选择省份时发生事件
			prov_obj.bind("change",function(){
				cityStart();
			});

			// 选择市级时发生事件
			city_obj.bind("change",function(){
				distStart();
			});

			// 选择区县时发生事件
			dist_obj.bind("change",function(){
				townStart();
			});
		};

		// 设置省市json数据
		if(typeof(settings.url)=="string"){
			if(settings.division){
				division.url=settings.url;
				division.init();
			}
			else{
				$.getJSON(settings.url,function(json){
					city_json=json;
					init();
			    });
			}
		}else{
			city_json=settings.url;
			init();
		};
	};
})(jQuery);