/** ------------------------------
	介绍：divisionpicker仿淘宝四级联动
	日期：2019-3-6
	作者：陈清元
	初始化html：
	$.divisionpicker();
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
	或者
	<div id="taobao"></div>
	$("#taobao").divisionpicker();
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
		code:"440103",//指定默认区域编码
		url:"http://127.0.0.1:3004/public/json/city.json",
		townUrl:"http://127.0.0.1:3004/api/code",
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
		   if(validator){
			   this.picker.after('<input type="hidden" name="'+validatorName+'" value="'+code+'" />');
			}
		   //事件处理
		   this.Event();
		},
		addNameAndSymbol:function(name,isSymbol){
			$(".cndzk-entrance-division-header-click-input .placeholder").empty();
			var headerName='<span><span class="cndzk-entrance-division-header-click-input-name ">'+name+'</span>';
			var headerSymbol='<span class="cndzk-entrance-division-header-click-input-symbol">'+(isSymbol?"/":"")+'</span></span>';
			$(".cndzk-entrance-division-header-click-input").append(headerName+headerSymbol);
		},
        getValueWithCode:function(){
			var code=this.code;
			var data=this.data;
			var length=code.length;
			if(length==0)
			  return;
			$(".cndzk-entrance-division-header-click-input").empty();
			switch(length){
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
					var code1=code.substr(0,2);
                    var code2=code.substr(0,4);
					var code3=code.substr(0,6);
					var province=data[code1];
					var city=province.c[code2];
					var county=city.c[code3];
					this.addNameAndSymbol(province.n,true);
					this.addNameAndSymbol(city.n,true);
					if(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1){
						var town=city.c;
						this.currentItems=town;
						this.addNameAndSymbol(town[code],false);
					}else{
						this.addNameAndSymbol(county,true);
						//第四级显示三级的code
						var that=this;
						this.getTownData(code3,function(data){
							var town=data[code];
							that.addNameAndSymbol(town,false);
						});
					}
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
			this.currentItems=that.data;
			this.index=0;
			this.getValueWithCode();
		},
		getServerData:function(url){
			var that=this;
			$.getJSON(url,function(json){
				that.data=json;
				that.setValue();
			});
		},
		headerClick:function(){
			if(this.index<3){
			   this.SpecialCodeIndex("up");
			}else{
			   this.box.show();
			}
		},
		TabClick:function(el){
			var index=$(el).index();
			var that=this;
			var code=that.code;
			var data=that.data;
			//设置标题点击级别为选中状态
			that.title.find("li").removeClass("active");
			that.title.find('li:eq('+index+')').addClass("active");
			//设置当前标题的实现数据
			if(index==3){
				var code1=code.substr(0,2);
				var code2=code.substr(0,4);
				var code3=code.substr(0,6);
				var code4=code.substr(0,9);
				var province=data[code1];
				var city=province.c[code2];
				if(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1){
					var town=city.c;
					that.currentItems=town;
					that.initItems();
					that.itemActive(that.currentItems,code4);//设置显示数据选中状态
				}else{
					this.getTownData(code3,function(data){
						that.currentItems=data;
						that.initItems();
						that.itemActive(that.currentItems,code4);//设置显示数据选中状态
					});
				}
			}else{
				var activecode=code;
				if(index==0){
					var code1=code.substr(0,2);
					that.currentItems=data;
					activecode=code1;	
				}
				if(index==1){
					var code1=code.substr(0,2);
					var code2=code.substr(0,4);
					that.currentItems=data[code1].c;
					activecode=code2;
				}
				if(index==2){
					var code1=code.substr(0,2);
					var code2=code.substr(0,4);
					var code3=code.substr(0,6);
					that.currentItems=data[code1].c[code2].c;
					activecode=code3;
				}
				that.initItems();
				that.itemActive(that.currentItems,activecode);//设置显示数据选中状态
			}
		
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
			if(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1){
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
			$.ajax({
				type: "POST",
				dataType: "json",
				url:this.options.townUrl,
				data: { code: code}
			}).done(callback).fail(function(erro){
				alert(erro.statusText);
			});
		},
		getTownData:function(code,callback){
			// var url="https://passer-by.com/data_location/town/"+code+".json";
			// $.getJSON(url,callback);
			this.getDataWithCode(code,callback);
		},
		SpecialCodeIndex:function(tag){
			var that=this;
			var itemindex=that.title.find("li.active").index();
			var code=that.code,mycode=that.code;
			that.content.empty();
			that.content.append("加载中……");
			that.box.show();
			if(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1){
				//直接获取二级的下级数据
				mycode=code.substr(0,4);
				that.index = 3;
			 } 
			else{
				that.index = tag=="next"?(itemindex+1):that.index;
			}
			that.setActive();//设置表头选中状态
			if(that.index==3&&!(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1)){
				//第三级(除了几个特殊区域)的下一级数据从服务端获取
				mycode=code.substr(0,6);
				that.getTownData(mycode,function(data){
					that.currentItems=data;
					that.initItems();
					that.itemActive(that.currentItems,code);//设置显示数据选中状态
				});
			}else{
				//点击获取下一级数据
				if(tag=="next"){
					var data=that.currentItems[mycode];
					that.currentItems=data.c;
					that.initItems();
				}else{
					that.initItems();
			        that.itemActive(that.currentItems,code);//设置显示数据选中状态
				}
				
			}
		},
	    itemActive:function(data,code){
			//设置显示数据选中状态
			var keys = Object.keys(data);
			var itemindex=keys.indexOf(code);
			if(itemindex>=0){
				this.content.find("li").removeClass("active");
			    var selectedli=this.content.find('li:eq('+itemindex+')');
				selectedli.addClass("active");
				//滚动条滚动到选中位置
				var pli=$(".cndzk-entrance-division-box-content");
				pli.scrollTop(selectedli.offset().top-pli.offset().top);
			}
		},
		itemClick:function(){
			var that=this;
			that.content.find("li").click(function(){	
			   var active=that.title.find("li.active").index();
			   //设置当前选中code
			   that.code=$(this).attr("code");
			   //添加验证
			   that.Validator();
			   //显示文字处理
			   var text=$(this).text();
			   var spanNames=$(".cndzk-entrance-division-header-click-input").children("span");
			   spanNames.each(function(n,i){
				 if((n+1)>active){
					$(i).remove();
				 }
			   });
			   var code=that.code;
			   if(active==3&&(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1)){
				 $(spanNames[2]).remove();
			   }
			   that.addNameAndSymbol(text,active!=3);
			   if(active==3){
				    that.content.find("li").removeClass("active");
					that.content.find('li:eq('+$(this).index()+')').addClass("active");
					//第四级不继续执行，隐藏区域选择
					that.box.hide();
					return;
			   }
			   //三级以下数据处理
			   that.SpecialCodeIndex("next");
			});
		},
		initItems:function(data){
			var that=this;
			var items=that.currentItems;
			that.content.empty();
			for (var key in items){
				var name=items[key].n?items[key].n:items[key];
				var li='<li class="cndzk-entrance-division-box-content-tag" code="'+key+'">'+name+'</li>';
				that.content.append(li);
			}
			//滚动条到顶部
			$(".cndzk-entrance-division-box-content").scrollTop(0);
			//注册点击事件
			that.itemClick();
		},
		Validator:function(){
			if(validator){ 
				var validator=this.options.validator;
				var validatorForm=this.options.validatorForm;
				var validatorName=this.options.validatorName;
				var hidden=this.picker.next();
				hidden.val(this.code);
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
		if($(".cndzk-entrance-division").length==0){
	        alert("控件没有添加");
		}
		var d=new DivisonPicker(option);
		d.init();
		return d;
	};

	//动态添加控件
	$.fn.divisionpicker = function(option) {
		var element=`<div class="cndzk-entrance-division suspend">
		<div class="cndzk-entrance-division-header">
			<span class="cndzk-entrance-division-header-label"><div class="next-form-item-label"><label required="">地址信息:</label></div></span>
			<div class="cndzk-entrance-division-header-click">
				<span class="cndzk-entrance-division-header-click-input">
					<p class="placeholder">请选择省/市/区/街道</p>
				</span>
				<span class="cndzk-entrance-division-header-click-icon"></span>
			</div>
		</div>
	   <div class="cndzk-entrance-division-box" style="display:none;width:600px;">
		   <ul class="cndzk-entrance-division-box-title"><li class="cndzk-entrance-division-box-title-level active" style="width: 25%;">省</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">市</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">区</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">街道</li></ul>
		   <ul class="cndzk-entrance-division-box-content"><div></div></ul>
		</div></div>`;
		$(this).append(element);
		var d=new DivisonPicker(option);
		d.init();
		return d;
	};
})(window.jQuery);