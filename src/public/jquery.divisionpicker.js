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
	var spdata={
		"4419":{"441900003":"东城街道","441900004":"南城街道","441900005":"万江街道","441900006":"莞城街道","441900101":"石碣镇","441900102":"石龙镇","441900103":"茶山镇","441900104":"石排镇","441900105":"企石镇","441900106":"横沥镇","441900107":"桥头镇","441900108":"谢岗镇","441900109":"东坑镇","441900110":"常平镇","441900111":"寮步镇","441900112":"樟木头镇","441900113":"大朗镇","441900114":"黄江镇","441900115":"清溪镇","441900116":"塘厦镇","441900117":"凤岗镇","441900118":"大岭山镇","441900119":"长安镇","441900121":"虎门镇","441900122":"厚街镇","441900123":"沙田镇","441900124":"道滘镇","441900125":"洪梅镇","441900126":"麻涌镇","441900127":"望牛墩镇","441900128":"中堂镇","441900129":"高埗镇","441900401":"松山湖管委会","441900402":"东莞港","441900403":"东莞生态园"},
		"4420":{"442000001":"石岐区街道","442000002":"东区街道","442000003":"火炬开发区街道","442000004":"西区街道","442000005":"南区街道","442000006":"五桂山街道","442000100":"小榄镇","442000101":"黄圃镇","442000102":"民众镇","442000103":"东凤镇","442000104":"东升镇","442000105":"古镇镇","442000106":"沙溪镇","442000107":"坦洲镇","442000108":"港口镇","442000109":"三角镇","442000110":"横栏镇","442000111":"南头镇","442000112":"阜沙镇","442000113":"南朗镇","442000114":"三乡镇","442000115":"板芙镇","442000116":"大涌镇","442000117":"神湾镇"},
		"4604":{"460400100":"那大镇","460400101":"和庆镇","460400102":"南丰镇","460400103":"大成镇","460400104":"雅星镇","460400105":"兰洋镇","460400106":"光村镇","460400107":"木棠镇","460400108":"海头镇","460400109":"峨蔓镇","460400111":"王五镇","460400112":"白马井镇","460400113":"中和镇","460400114":"排浦镇","460400115":"东成镇","460400116":"新州镇","460400499":"洋浦经济开发区","460400500":"华南热作学院"}
	}
	var defaults = {
		validator: false,//是否开启验证
		validatorForm:$("#config-form"),//验证表单对象
		validatorName:"ProjectCityName",//验证属性
		code:"4419",//指定默认区域编码
		url:"http://127.0.0.1:3004/public/json/city1.json",
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
			if(!name){
				$(".cndzk-entrance-division-header-click-input").append("<span></span>");
				return;
			}
			var headerName='<span><span class="cndzk-entrance-division-header-click-input-name ">'+name+'</span>';
			var headerSymbol='<span class="cndzk-entrance-division-header-click-input-symbol">'+(isSymbol?"/":"")+'</span></span>';
			$(".cndzk-entrance-division-header-click-input").append(headerName+headerSymbol);
		},
        getValueWithCode:function(){
			var code=this.code;
			var data=this.data;
			var length=code.length;
			if(length==0){
				return;
			}	
			$(".cndzk-entrance-division-header-click-input").empty();	
			switch(length){
				case 2:
				{
					this.index=1;
					this.addNameAndSymbol(data[code].n,true);
					break;
				}
				case 4:
				{
					this.index=2;
					var code1=code.substr(0,2);
					var province=data[code1];
					var city=province.c[code];
					this.addNameAndSymbol(province.n,true);
					this.addNameAndSymbol(province.c[code].n,true);
					//获取特殊数据
					if(city.c.length==0){
						this.index=3;
						this.addNameAndSymbol(null);
					}else{
						this.currentItems=city;
					}
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
					//获取特殊数据
					if(city.c.length==0){
						this.addNameAndSymbol(null);
						this.addNameAndSymbol(spdata[code2][code],false);
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
			var lenli=this.content.find("li").length;
			if(lenli==0){
				this.SpecialCodeIndex("up");
			}else{
				this.box.show();
			}
		},
		TabClick:function(index){
			var that=this;
			var code=that.code;
			var data=that.data;
			//设置标题点击级别为选中状态
			that.title.find("li").removeClass("active");
			that.title.find('li:eq('+index+')').addClass("active");
			that.content.empty();
			that.content.append("加载中……");
			that.unbind=null;
			//设置当前标题的实现数据
			if(index==3){
				var code1=code.substr(0,2);
				var code2=code.substr(0,4);
				var code3=code.substr(0,6);
				var code4=code.substr(0,9);
				var province=data[code1];
				var city=province.c[code2];
				if(city.c.length==0){
					that.currentItems=spdata[code2];//获取特殊数据
					that.unbind=2;
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
			that.title.find("li:lt("+(index+1)+")").on("click",function(){
				that.TabClick($(this).index());
			});
			if(that.unbind){
				that.title.find("li:eq("+that.unbind+")").off("click");
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
			var mycode=that.code;
			that.content.empty();
			that.content.append("加载中……");
			that.box.show();
			//最后一级从服务器获取
			//获取数据：next下一级数据、up当前数据
			if(tag=="next"){
				that.unbind=null;
				that.index = itemindex+1;
				var data=that.currentItems[mycode];
				that.currentItems=data.c;
			    if(typeof(that.currentItems)=="undefined"){
					//从服务器端获取数据
					that.getTownData(mycode.substr(0,6),function(data){
						that.currentItems=data;
						that.initItems();
					});
				}else if(that.currentItems.length==0){
					//无第三级数据特殊处理
					this.addNameAndSymbol(null);//第三级置空
					that.unbind=2;//解除第三级绑定
					that.index = 3;//第三级跳到第四级
					that.currentItems=spdata[mycode];//获取特殊数据
					that.initItems();
				}else{
					that.initItems();
				}
			}else{
				//下拉展开
				that.TabClick(that.index);
			}
			that.setActive();//设置表头选中状态
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
			   if(active==3){
				    that.addNameAndSymbol(text,false);
				    that.content.find("li").removeClass("active");
					that.content.find('li:eq('+$(this).index()+')').addClass("active");
					//第四级不继续执行，隐藏区域选择
					that.box.hide();
			   }else{
				    //三级以下数据处理
					that.addNameAndSymbol(text,true);
					that.SpecialCodeIndex("next");
			   }
			  
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