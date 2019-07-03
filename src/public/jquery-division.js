/** ------------------------------
	介绍：division仿淘宝四级联动
	日期：2019-3-6
	作者：陈清元
	初始化html：
	<div class="cndzk-entrance-division suspend" style="width:500px;">
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
	</div>
	支持验证：须添加验证控件
	<!--验证控件[ OPTIONAL ]-->
	<link href="/js/plugins/bootstrap-validator/bootstrapValidator.css" rel="stylesheet">
	<script src="/js/plugins/bootstrap-validator/bootstrapValidator.min.js"></script>
------------------------------ **/
// (function($, undefined){}(window.jQuery));
(function($) {
	'use strict';

	var defaults = {
		validator: false,//是否开启验证
		validatorForm:$("#config-form"),//验证表单对象
		validatorName:"ProjectCityName",//验证属性
		code:"4419",//指定默认区域编码
		url:"/public/json/city.json",
		data:null,
		display:"请选择省/市/区/街道",
		mode:0,//0:对象 1：数组
		component:{
			picker:".cndzk-entrance-division",
			header:".cndzk-entrance-division-header",
			box:".cndzk-entrance-division-box",
			title:".cndzk-entrance-division-box-title",
			content:".cndzk-entrance-division-box-content div"
		}
	};

	//控件对象
	var DivisonPicker = function(options){
		this.options = $.extend({},defaults, options);
		this.component=this.options.component;
		this.picker=$(this.component.picker);
		if(this.picker.length==0){
			console.log("缺少控件元素！")
			return false;
		}
		this.header=$(this.component.header);
		this.box=$(this.component.box);
		this.title=$(this.component.title);
		this.content=$(this.component.content);
	};
	
	//版本号
	DivisonPicker.version = '1.0.0-beta';

	//扩展
	DivisonPicker.prototype = {
		constructor: DivisonPicker,
		init:function(){
			var url=this.options.url;
			var code=this.options.code;
			var validator=this.options.validator;
			var validatorName=this.options.validatorName;
		   //获取数据
		   if(url)this.getServerData(url);
		   //验证
		   if(validator)this.picker.after('<input type="hidden" name="'+validatorName+'" value="'+code+'" />');
		   //事件处理
		   this.Event();
		},
		addNameAndSymbol:function(name,isSymbol){
			$(".cndzk-entrance-division-header-click-input .placeholder").empty();
			var headerName='<span><span class="cndzk-entrance-division-header-click-input-name ">'+name+'</span>';
			var headerSymbol='<span class="cndzk-entrance-division-header-click-input-symbol">'+(isSymbol?"/":"")+'</span></span>';
			$(".cndzk-entrance-division-header-click-input").append(headerName+headerSymbol);
		},
        getValueWithCode:function(code,data){
			this.code=code;
			this.index=0;
			this.currentItems=data;
			switch(code.length){
				case 0:
				{
					break;
				}
				case 2:
				{
					this.index=1;
					this.currentItems=data[code].c;
					this.addNameAndSymbol(data[code].n,true);
					break;
				}
				case 4:
				{
					this.index=2;
					var code1=code.substr(0,2);
					var province=data[code1];
					this.currentItems=province.c[code].c;
					this.addNameAndSymbol(province.n,true);
					this.addNameAndSymbol(province.c[code].n,true);
					break;
				}
				 case 6:
				{
					this.index=3;
					var code1=code.substr(0,2);
					var code2=code.substr(0,4);
					var province=data[code1];
					var city=province.c[code2];
					this.addNameAndSymbol(province.n,true);
					this.addNameAndSymbol(city.n,true);
					this.addNameAndSymbol(city.c[code],true);
					break;
				}
				 case 9:
				{
					this.index=3;
					break;
				}
				default:
				{
					alert("默认编码格式错误");
					return;
				}
			}
		},
		setValue:function(){
			var that=this;
			this.code=that.options.code;
			//设置默认值
			this.getValueWithCode(that.code,that.data);
			that.content.empty();
		},
		getServerData:function(url){
			var that=this;
			$.getJSON(url,function(json){
				that.data=json;
				that.setValue();
			});
		},
		headerClick:function(){
			this.SpecialCodeIndex("up");
		},
		TabClick:function(el){
			var index=$(el).index();
			alert(1);
			this.initItems();
			//设置点击级别为选中状态
			this.title.find("li").removeClass("active");
			this.title.find('li:eq('+index+')').addClass("active");
		},
		setActive:function(){
			var that=this;
			var index=that.index;//获取级别
			var code=that.code;
			//设置级别为选中状态
			that.title.find("li").removeClass("active");
			that.title.find('li:eq('+(index)+')').addClass("active");
			//绑定当前级前级别tab点击事件
			that.title.find("li").off("click");
			if(code==4419||code==4420||code==4604){
				that.title.find("li:lt(2)").on("click",function(){
					that.TabClick(this);
				});
				that.title.find("li:eq(3)").on("click",function(){
					that.TabClick(this);
				});
			}else{
				that.title.find("li:lt("+(index+1)+")").on("click",function(){
					that.TabClick(this);
				});
			}
		},
		getDataWithCode:function(code,callback){
			//根据code获取数据，需要搭建服务api
			var index=0;
			var url="http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/";
			var host=url;
			var selecter=[".provincetr td",".citytr td:last-child",".countytr td:last-child",".towntr td:last-child",".villagetr td:last-child"];
			switch(code.length){
				case 0:
				{
					index=0;
					break;
				}
				case 2:
				{
					index=1;
					url=host+code+".html";
					break;
				}
				case 4:
				{
					index=2;
					if(code==4419||code==4420||code==4604) //特殊处理三个没有区直接到街道的
					index=3;
					var str1=code.substr(0,2);
					var url=host+str1+"/"+code+".html";
					break;
				}
				case 6:
				{
					index=3;
					var str1=code.substr(0,2);
					var str2=code.substr(2,2);
					var url=host+str1+"/"+str2+"/"+code+".html";
					break;
				}
				case 9:
				{
					index=4;
					var str1=code.substr(0,2);
					var str2=code.substr(2,2);
					var str3=code.substr(4,2);
					if(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1)
					var url=host+str1+"/"+str2+"/"+code+".html";
					else
					var url=host+str1+"/"+str2+"/"+str3+"/"+code+".html";
					break;
				}
				default:
				{
					alert("编码填写错误");
					return;
				}
			}
			var selecter=selecter[index];
			$.ajax({
				type: "POST",
				dataType: "json",
				url: "/api/json",
				data: { url: url, selecter:selecter}
			}).done(callback).fail(function(erro){
				alert(erro.statusText);
			});
		},
		getTownData:function(code,callback){
			//var url="https://passer-by.com/data_location/town/"+code+".json";
			//$.getJSON(url,callback);
			//特殊处理几个数据从本地加载
		},
		SpecialCodeIndex:function(tag){
			var that=this;
			var active=that.title.find("li.active").index();
			var code=that.code;
			if(code==4419||code==4420||code==4604){
				that.index = tag=="next"?(active+1):3;
			 } 
			else{
				that.index = tag=="next"?(active+1):that.index;
			}
			that.content.empty();
			that.content.append("加载中……");
			that.box.show();
			that.setActive();
			//第三级(几个特殊区域)的下一级数据从服务端获取
			if(code.length==6||code==4419||code==4420||code==4604){
				that.getDataWithCode(code,function(data){
					that.currentItems=data;
					that.initItems();
				});
		    }else{
				//点击获取下一级数据
				if(tag=="next"){
					var data=that.currentItems[code];
					that.currentItems=data.c;
				}
				that.initItems();
		    }
		},
		itemClick:function(){
			var that=this;
			that.content.find("li").click(function(){	
			   var active=that.title.find("li.active").index();
			   if(active==3){
				//第四级不继续执行，隐藏区域选择
				that.box.hide();
				return;
			   }
			   //三级以下数据处理
			   var index=$(this).index();
			   var keys = Object.keys(that.currentItems);
			   var code=keys[index];
			   that.code=code;//设置当前code
			   that.SpecialCodeIndex("next");
			});
		},
		initItems:function(data){
			var that=this;
			var items=that.currentItems;
			that.content.empty();
			for (var key in items){
				var name=items[key].n?items[key].n:items[key];
				var li='<li class="cndzk-entrance-division-box-content-tag ">'+name+'</li>';
				that.content.append(li);
			}
			that.itemClick();
		},
		Validator:function(){
			var validator=this.options.validator;
			var validatorForm=this.options.validatorForm;
			var validatorName=this.options.validatorName;
			if(validator){ 
				var hidden=this.picker.next();
				var input=$(".cndzk-entrance-division-header-click-input");
				var text=$(".cndzk-entrance-division-header-click-input p").length==0?input.text():"";
				hidden.val(text);
				validatorForm.data('bootstrapValidator').updateStatus(validatorName, 'NOT_VALIDATED').validateField(validatorName);
			}
		},
		Event:function(e){
			var that=this;
			that.picker.click(function(event){
				var e = event;
				if (e && e.stopPropagation) {
					e.stopPropagation();
				} else if (window.event) {
					window.event.cancelBubble = true;
				}
				if($(".cndzk-entrance-division-header-click-input").find(e.target).length>0
				||$(e.target).hasClass("cndzk-entrance-division-header-click-input"))
				   that.headerClick();
			});

			$(document).click(function () {
				that.box.hide();
			}); 
		}
          
	};
	//页面须添加控件
	$.divisionpicker = function(option){
		var d=new DivisonPicker(option);
		d.init();
	};
	//动态添加控件
	$.fn.divisionpicker = function(option) {

	};


})(window.jQuery);