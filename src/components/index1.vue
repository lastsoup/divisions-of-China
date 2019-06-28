<template>
  <div id="divisions">
      <h2 class="top_title"><i class="iconfont">&#xe601;</i>基于cheerio抓取统计局官网最新行政划分数据</h2>
      <p>地址：<input id="host" value="http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/" /></p>
      选择
      <select id="level">
        <option value ="0">省级</option>
        <option value ="1">地级</option>
        <option value="2">县级</option>
        <option value="3">乡级</option>
        <!-- <option value="4">村级</option> -->
      </select>
      <button @click="all">开始抓取数据</button>
      <button @click="save">保存数据</button>
      <button @click="erro">错误处理</button>
       <input id="code" value=""  autocomplete="off" />
      <button @click="output">行政编号输出数据</button>
      <span style="color:red;">建议:最多一次性获取到三级数据（乡级和村级数据可通过行政编号请求获取）</span>
     <div id="showdetail">
         <p class="detail">数据获取情况：地级<span class="ptotal">0</span>/<span class="pcount">0</span>条
         &nbsp; 
         <!-- 获取<span class="remark" style="color:red;"></span>数据完毕！ -->
         县级<span class="ctotal">0</span>/<span class="ccount">0</span>条
         &nbsp; 
         乡级<span class="stotal">0</span>/<span class="scount">0</span>条
         </p>
     </div>
      错误详情：
      <div id="showerror" style="color:red;font-size: 13px;font-style: italic;border: solid 1px #758697;
    min-height: 100px;">
     </div>
    <pre>
     $.ajax({
        type: "POST",
        dataType: "json",
        url:"/api/json",
        data: { url: "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/", selecter:".provincetr td"}
     }).done(callback).fail(error);;
	</pre>
</div>

</template>
<script>
    var object;
    var pcount=0,ccount=0,scount=0;
    var ptotal=0,ctotal=0,stotal=0,ttotal=0,vtotal=0;
    //import gatdata from '../public/json/gatdata';
    export default {
        data () {
            return {
                gatdata:gatdata.data,
                api:"/api/cheerio",
                api1:"/api/json",
                host:"http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/",
                selecter:[".provincetr td",".citytr td:last-child",".countytr td:last-child",".towntr td:last-child",".villagetr td:last-child"]
            }
        },
        methods:{
            save:function(){
                console.log(object);
                console.log(JSON.stringify(object));
                alert("打开浏览器控制台复制数据！文件内替换（办事处）");
            },
            output:function(){
                var code=$("#code").val();
                var index=0;
                var url=this.host;
                switch(code.length){
                    case 0:
                    {
                        index=0;
                        break;
                    }
                    case 2:
                    {
                        index=1;
                        url=this.host+code+".html";
                        break;
                    }
                    case 4:
                    {
                        index=2;
                        if(code==4419||code==4420||code==4604) //特殊处理三个没有区直接到街道的
                        index=3;
                        var str1=code.substr(0,2);
                        var url=this.host+str1+"/"+code+".html";
                        break;
                    }
                     case 6:
                    {
                        index=3;
                        var str1=code.substr(0,2);
                        var str2=code.substr(2,2);
                        var url=this.host+str1+"/"+str2+"/"+code+".html";
                        break;
                    }
                     case 9:
                    {
                        index=4;
                        var str1=code.substr(0,2);
                        var str2=code.substr(2,2);
                        var str3=code.substr(4,2);
                        if(code.indexOf(4419)>-1||code.indexOf(4420)>-1||code.indexOf(4604)>-1)
                         var url=this.host+str1+"/"+str2+"/"+code+".html";
                        else
                         var url=this.host+str1+"/"+str2+"/"+str3+"/"+code+".html";
                        break;
                    }
                    default:
                    {
                        alert("编码填写错误");
                        return;
                    }
                }
                var selecter=this.selecter[index];
                 $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: this.api1,
                        data: { url: url, selecter:selecter}
                    }).done(function(data){
                         console.log(data);
                         console.log(JSON.stringify(data));
                         alert("打开浏览器控制台复制数据！");
                    }).fail(function(erro){

                    });
            },
            erro:function(){
                this.Error();
            },
            all:function(){
                var level=$("#level").get(0).selectedIndex;
                   object=null;
                   pcount=ccount=scount=0;
                   ptotal=ctotal=stotal=ttotal=vtotal=0;
                this.host=$("#host").val();
                $("#showerror").empty();
                switch(level){
                    case 0:
                    {
                        this.Province(function(data){});
                        break;
                    }
                    case 1:
                    {
                        this.City(function(data){})
                        break;
                    }
                    case 2:
                    {
                        this.Area(function(data){})
                        break;
                    }
                     case 3:
                    {
                        this.Street();
                        break;
                    }
                }
            },
            scrape:function (url,selecter,callback,error) {
                   $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: this.api1,
                        data: { url: url, selecter:selecter}
                    }).done(callback).fail(error);
            },
            Province: function (callback) {
                this.scrape(this.host,this.selecter[0],function(data){
                    object=data;
                    ptotal=Object.getOwnPropertyNames(data).length;
                    $("#showdetail .detail .ptotal").text(ptotal);
                    callback(data);
                });
            },
            City:function(callback){
                var dom=this;
                var selecter=this.selecter;
                dom.Province(function(pdata){
                     $.each(pdata,function(code,name){
                        var url=dom.host+code+".html";
                        dom.scrape(url,selecter[1],function(cdata){
                            var l=Object.getOwnPropertyNames(cdata).length;
                            var o={n:name,c:cdata};
                            object[code]=o;
                            pcount=pcount+1;
                            ctotal=ctotal+l;
                            $("#showdetail .detail .pcount").text(pcount);
                            $("#showdetail .detail .ctotal").text(ctotal);
                            callback(cdata,code);
                        },function(err){

                        });
                    });
                });
            },
            Area:function(callback){
                var dom=this;
                var selecter=this.selecter;
                dom.City(function(cdata,pcode){
                     $.each(cdata,function(code,name){
                         var str1=code.substr(0,2);
                         var url=dom.host+str1+"/"+code+".html";
                         dom.scrape(url,selecter[2],function(sdata){
                              var l=Object.getOwnPropertyNames(sdata).length;
                              var o={n:name,c:sdata};
                              object[pcode]["c"][code]=o;
                              ccount=ccount+1;
                              stotal=stotal+l;
                              $("#showdetail .detail .ccount").text(ccount);
                              $("#showdetail .detail .stotal").text(stotal);
                              callback(sdata,pcode,code);
                         },function(err){
 
                         });
                     })
                });
            },
            Street:function(){
                var dom=this;
                var selecter=this.selecter;
                dom.Area(function(sdata,pcode,ccode){
                    $.each(sdata,function(code,name){
                        var str1=code.substr(0,2);
                        var str2=code.substr(2,2);
                        var url=dom.host+str1+"/"+str2+"/"+code+".html";
                        dom.scrape(url,selecter[3],function(tdata){
                            //var l=Object.getOwnPropertyNames(tdata).length;
                            scount=scount+1;
                            var o={n:name,c:sdata};
                            object[pcode]["c"][ccode]["c"][code]=o;
                            $("#showdetail .detail .scount").text(scount);
                        },function(err){

                        });
                    });
                });
            },
            Error:function(){
              
            }
        }
    }
</script>
