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
		code:"",//指定默认区域编码
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
			var headerName='<span><span class="cndzk-entrance-division-header-click-input-name ">'+name+'</span>';
			var headerSymbol='<span class="cndzk-entrance-division-header-click-input-symbol">'+(isSymbol?"/":"")+'</span></span>';
			$(".cndzk-entrance-division-header-click-input").append(headerName+headerSymbol);
		},
        getValueWithCode:function(code,data){
			if(code){
				var headerInput=$(".cndzk-entrance-division-header-click-input .placeholder");
				headerInput.empty();
			}
			var text=this.options.display;
			//var index=0;
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
					//text=data[code].n;
					this.currentItems=data[code].c;
					this.addNameAndSymbol(data[code].n,true);
					break;
				}
				case 4:
				{
					this.index=2;
					var code1=code.substr(0,2);
					var province=data[code1];
					//text=province.n+"/"+province.c[code].n;
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
					//text=province.n+"/"+city.n+"/"+city.c[code];
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
					text="默认编码格式错误";
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
			this.content.empty();
			this.content.append("加载中……");
			this.initItems();
			this.box.show();
		},
		TabClick:function(el){
			var index=$(el).index();
			alert(1);
			this.initItems();
			this.title.find("li").removeClass("active");
			this.title.find('li:eq('+index+')').addClass("active");
		},
		setActive:function(tag){
			var that=this;
			var index=that.index;
			that.title.find("li").removeClass("active");
			that.title.find('li:eq('+(index)+')').addClass("active");
			that.title.find("li").off("click");
			that.title.find("li:lt("+(index+1)+")").on("click",function(){
				that.TabClick(this);
			});
		},
		itemClick:function(){
			var that=this;
			that.content.find("li").click(function(){
			   //that.initItems();
			   var active=that.title.find("li.active").index();
			   var index=$(this).index();
			   var keys = Object.keys(that.currentItems);
			   var code=keys[index];
			   var data=that.currentItems[code];
			   that.currentItems=data.c;
			   that.title.find("li:eq("+(active+1)+")").off("click");
			   that.title.find("li:eq("+(active+1)+")").on("click",function(){
				   that.TabClick(this);
			   });
			   that.title.find("li:eq("+(active+1)+")").click();
			   if(active==3){
				  that.box.hide();
				  return;
			   }

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
			that.setActive();
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