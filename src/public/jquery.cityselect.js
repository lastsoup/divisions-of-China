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
<div class="cndzk-entrance-division suspend word-wrap" style="width:500px;">
<div class="cndzk-entrance-division-header"><span class="cndzk-entrance-division-header-label"><div class="next-form-item-label"><label required="">地址信息:</label></div></span><div class="cndzk-entrance-division-header-click"><span class="cndzk-entrance-division-header-click-input"><p class="placeholder" data-spm-anchor-id="0.0.0.i0.650e175cHMvmAz">请选择省/市/区/街道</p></span><span class="cndzk-entrance-division-header-click-icon"></span></div></div>
<div class="cndzk-entrance-division-box" style="display:none;"><ul class="cndzk-entrance-division-box-title"><li class="cndzk-entrance-division-box-title-level active" style="width: 25%;">省</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">市</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">区</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">街道</li></ul><ul class="cndzk-entrance-division-box-content"><div></div></ul></div>
</div>
required:必选项
------------------------------ */
(function($){
	$.division=function(options){
			var defaults = {
				validator: false,
				validatorForm:$("#config-form"),
				validatorName:"ProjectCityName",
               value:[{index:0,name:"北京市"}]
			}
			var opt = $.extend({},defaults, options);
			var division={
				validator:false,
				division:".cndzk-entrance-division",
				divisionheader:".cndzk-entrance-division-header",
				divisionbox:".cndzk-entrance-division-box",
				divisiontitle:".cndzk-entrance-division-box-title",
				divisioncontent:".cndzk-entrance-division-box-content div",
				url:"/public/json/street.json",
				api:"http://58.213.48.24:3004/api/cheerio",
				govUrl:"http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/",
				value:null,
				current_json:null,
				current_array:[],
				current_index:[],
				init:function(){
					this.division=$(this.division);
					this.divisionheader=$(this.divisionheader);
					this.divisionbox=$(this.divisionbox);
					this.divisioncontent=$(this.divisioncontent);
					this.divisiontitle=$(this.divisiontitle);
					if(this.validator){
						var text=opt.value?"验证通过":"";
						this.division.after('<input type="hidden" name="'+opt.validatorName+'" value="'+text+'" />');
					}
					
					if(this.value){
						$(".cndzk-entrance-division-header-click-input").empty();
						$.each(opt.value,function(n,item){
							var name=item.name;
							var headerName='<span><span class="cndzk-entrance-division-header-click-input-name ">'+name+'</span>';
							var headerSymbol='<span class="cndzk-entrance-division-header-click-input-symbol">'+((n+1)==opt.value.length?"":"/")+'</span></span>';
							$(".cndzk-entrance-division-header-click-input").append(headerName+headerSymbol);
						 });
					}
					this.event();
				},
				setServer:function(code,callback){
					var str1=code.substr(0,2);
					var str2=code.substr(2,2);
					var url=division.govUrl+str1+"/"+str2+"/"+code+".html";
					division.divisioncontent.append("加载中……");
					$.ajax({
						type: "POST",
						dataType: "json",
						url: division.api,
						data: { url: url, selecter:".towntr td:last-child"}}).done(function(citydata){
							division.divisioncontent.empty();
							callback(citydata);
						}).fail(function(err){
							 console.log(err);
						});;
				},
				setValue:function(){
					this.current_array=opt.value;
					var len=opt.value.length;
					var json=this.current_json;
					var index=len;
					var start=json[division.current_array[0].index].code.substr(0,1);
					var lastcode;
					$.each(division.current_array,function(n,item){
							item["json"]=json;
							var child=json[item.index].children;
							if(!child){
								lastcode=json[item.index].code;
								if(start=="8"){
									index=n;	
								}else if(n==3){
								   index=n;		
								}
							}else{
								json=child;
							}
					 });
					 this.divisiontitle.find("li").removeClass("active");
					 this.divisiontitle.find('li:eq('+index+')').addClass("active");
					 if(start!="8"&&len>2){
						division.setServer(lastcode,function(data){
							division.UpTag(data);
						})
					 }else{
					   this.UpTag(json);
					 }
				},
				initData:function(){
					var setdata=function(json){
						division.current_json=json;
						division.divisioncontent.empty();
						if(!division.value){
						  division.initTag(division.current_json);
						}else
						{
							division.setValue();
						}
					}
					if(this.data){
						setdata(this.data);
						return;
					}
					$.getJSON(this.url,function(json){
						setdata(json);
					});
				},
				initTag:function(json){
					this.current_json=json;
					$.each(json,function(n,item){
						var name=item.name.replace("办事处","");
						var li='<li class="cndzk-entrance-division-box-content-tag ">'+name+'</li>';
						division.divisioncontent.append(li);
					});
					this.setActive("next");
					this.tagClick();
				},
				UpTag:function(json){
					this.current_json=json;
					$.each(json,function(n,item){
						var name=item.name.replace("办事处","");
						var li='<li class="cndzk-entrance-division-box-content-tag ">'+name+'</li>';
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
				Validator:function(){
					if(opt.validator){ 
						var hidden=division.division.next();
						var input=$(".cndzk-entrance-division-header-click-input");
						var text=$(".cndzk-entrance-division-header-click-input p").length==0?input.text():"";
						hidden.val(text);
						opt.validatorForm.data('bootstrapValidator').updateStatus(opt.validatorName, 'NOT_VALIDATED').validateField(opt.validatorName);
					}
				},
				tagClick:function(){
					 this.divisioncontent.find("li").click(function(){
						 var active=division.divisiontitle.find("li.active").index();
						 var index=$(this).index();
						 $(".cndzk-entrance-division-header-click-input").children(":eq("+active+")").remove();
						 division.current_array.splice(active);
						 division.current_array.push({index:index,json: division.current_json});
						 $(".cndzk-entrance-division-header-click-input").empty();
						 //获取
						 var code=division.current_json[index].code;
						 var start=code.substr(0,1);
						 division.value=[];
						 $.each(division.current_array,function(n,item){
							var name=item.json[item.index].name.replace("办事处","");
							var children=item.json[item.index].children;
							division.value.push({index:item.index,name:name})
							var headerName='<span><span class="cndzk-entrance-division-header-click-input-name ">'+name+'</span>';
							var symbol=!children?(n==2&&start!="8"?"/":""):"/";
							var headerSymbol='<span class="cndzk-entrance-division-header-click-input-symbol">'+symbol+'</span></span>';
							$(".cndzk-entrance-division-header-click-input").append(headerName+headerSymbol);
						 });
						 division.divisioncontent.empty();
						 var citydata=division.current_json[index].children;
						 division.Validator();
						 if(citydata){
							division.initTag(citydata);
						 }else{
							var len=code.length;
							 if(start=="8"||len!=6){
									division.divisionbox.hide();
									return;
							 }else
							 {
									//从服务器获取数据
								  division.setServer(code,function(data){
										division.initTag(data);
									});
							 }
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
				division.value=opt.value;
				division.validator=opt.validator;
				if(opt.data){
					division.data=opt.data;
					division.init();
				}else{
					division.url=opt.url;
					division.init();
				}

				return division;
	}
	$.fn.citySelect=function(options){
		// 默认值
		var settings = $.extend(true,{
			url:"area.json",
			prov:null,
			city:null,
			dist:null,
			nodata:null,
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
		var select_prehtml=(settings.required) ? "" : "<option value=''>----请选择----</option>";
		var city_json;

		

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
		if(settings.data){
			city_json=settings.data;
			init();
			return;
	  }
		if(typeof(settings.url)=="string"){
			$.getJSON(settings.url,function(json){
				city_json=json;
				init();
				});
		}else{
			city_json=settings.url;
			init();
		};
		

	};
})(jQuery);