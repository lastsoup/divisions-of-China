/*------------------------------
省市区街道jQuery联动插件(针对网上通用的citySelect插件代码重构并扩展到四级)
日期：2019-3-6
作者：陈清元
联系方式：qingtang166@qq.com
settings 参数说明
-----
url:省市数据josn文件路径
prov:默认省份
city:默认城市
dist:默认地区（县）
nodata:无数据状态
https://www.daimabiji.com/
http://www.jq22.com/daima
------------------------------ */
;(function($){
	'use strict';

	var defaults = {
		url:"http://127.0.0.1:3004/public/json/city.json",
		prov:null,//默认值，可不写
		city:null,//默认值，可不写
		dist:null,//默认值，可不写
		required:false,//false:请选择 true：默认第一项
		nodata:false,//是否隐藏未选择的
		validator: false,//是否开启验证
		validatorForm:$("#config-form"),//验证表单对象
		validatorName:"ProjectCityName"//验证属性
	};

	var cityselect=function(el,options){
		this.options = $.extend({},defaults, options);
		this.box_obj=$(el);
		this.prov_obj=this.box_obj.find(".prov");
		this.city_obj=this.box_obj.find(".city");
		this.dist_obj=this.box_obj.find(".dist");
		this.town_obj=this.box_obj.find(".town");
		this.select_prehtml=(this.options.required) ? "" : "<option value=''>----请选择----</option>";
		var url=this.options.url;
		var data=this.options.data;
		var that=this;
		if(data){
			that.data=data;
			that.init();
		}else{
			$.getJSON(url,function(json){
				that.data=json;
				that.init();
			});
		}
		 //验证
		 var validator=this.options.validator;
		 var prov=this.options.prov?this.options.prov:"";
		 if(validator){
			var validatorName=this.options.validatorName;
			el.append('<input type="hidden" name="'+validatorName+'" value="'+prov+'" />');
		 }
		this.Events();
	};

	cityselect.prototype={
		init:function(){
		   var prov=this.options.prov;
		   var nodata=this.options.nodata;
		   var city_json=this.data;
		   if(nodata){
				this.city_obj.hide();
				this.dist_obj.hide();
				this.town_obj.hide();
		   }
		   if(this.prov_obj.length>0){
				//添加省数据
				this.provData(city_json,this.prov_obj);
				if(prov)
				   this.prov_obj.val(prov);
				else
				   this.prov_obj.find("option:first").attr("selected",true);
				//添加市数据
				if(this.city_obj.length>0){
					this.cityStart();
					var city=this.options.city;
					if(city)this.city_obj.val(city);
					//添加区数据
					if(this.dist_obj.length>0){
						this.distStart();
						var dist=this.options.dist;
						if(dist)this.dist_obj.val(dist);
					}
				}
				
				

		   }
		},
		provData:function(json,el){
			var temp_html=this.select_prehtml;
			$.each(json,function(n,i){
			  temp_html+="<option value='"+i.n+"' code='"+n+"'>"+i.n+"</option>";
			});
			el.append(temp_html);
		},
		dataChange:function(pre_obj,curr_obj,index){
			var code=pre_obj.find("option:selected").attr('code');
			curr_obj.empty();
			if(code){
				curr_obj.attr("disabled",false);
				var temp_html=this.select_prehtml;
				var json=this.data;
                if(index==0){
					json=this.data[code].c;
					$.each(json,function(n,i){
						temp_html+="<option value='"+i.n+"' code='"+n+"'>"+i.n+"</option>";
					});
					this.curr_json=json;
				}
				if(index==1){
				   json=this.curr_json[code].c;
				   $.each(json,function(n,i){
					    temp_html+="<option value='"+i+"' code='"+n+"'>"+i+"</option>";
				   });
				}
				curr_obj.append(temp_html);
				if(json.length!=0)
				   curr_obj.show();
				else
				   curr_obj.hide();
			}else{
				curr_obj.append("<option value=''>----请选择----</option>");
				curr_obj.attr("disabled",true);
			}
		},
		cityStart:function(){
			this.dataChange(this.prov_obj,this.city_obj,0);
			this.distStart();
		},
		distStart:function(){
			this.dataChange(this.city_obj,this.dist_obj,1);
		},
		townStart:function(){

		},
		Validator:function(){
			var validator=this.options.validator;
			if(validator){ 
				var validatorForm=this.options.validatorForm;
				var validatorName=this.options.validatorName;
				var text=this.prov_obj.val();
				var hidden=this.box_obj.find("[name='"+validatorName+"']");
				hidden.val(text);
				validatorForm.data('bootstrapValidator').updateStatus(validatorName, 'NOT_VALIDATED').validateField(validatorName);
			}
		},
		Events:function(){
			var that=this;
			// 选择省份时发生事件
			that.prov_obj.bind("change",function(){
				that.cityStart();
				that.Validator();
			});

			// 选择市级时发生事件
			that.city_obj.bind("change",function(){
				that.distStart();
			});

			// 选择区县时发生事件
			that.dist_obj.bind("change",function(){
				that.townStart();
			});
		}
	};

	$.fn.cityselect=function(option){
		var c=new cityselect(this,option);
	}

})(jQuery);