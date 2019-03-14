<template>
  <div id="divisions">
      <h2 class="top_title">基于cheerio抓取统计局官网最新行政划分数据</h2>
      <p>地址：<input id="host" value="http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/" /></p>
      选择
      <select id="level">
        <option value ="0">省级</option>
        <option value ="1">地级</option>
        <option value="2">县级</option>
        <option value="3">乡级</option>
        <option value="4">村级</option>
      </select>
      <button @click="all">开始抓取数据</button>
      <button @click="save">保存数据</button>
      <button @click="erro">错误处理</button>
      <span style="color:red;">注:最多获取到四级数据（乡级和村级可以数据可通过请求获取）</span>
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
        url:"/api/cheerio",
        data: { url: "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/", selecter:".provincetr td"}
     }).done(callback).fail(error);;
	</pre>
</div>

</template>
<script>
    var json=[],errojson=[];
    var pcount=0,ccount=0,scount=0;
    var ptotal=0,ctotal=0,stotal=0,ttotal=0,vtotal=0;
    import gatdata from '../public/json/gatdata';
    export default {
        data () {
            return {
                gatdata:gatdata.data,
                api1:"/api/cheerio",
                api2:"/api/puppeteer",
                api:"/api/cheerio",
                host:"http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/",
                selecter:[".provincetr td",".citytr td:last-child",".countytr td:last-child",".towntr td:last-child",".villagetr td:last-child"]
            }
        },
        methods:{
            save:function(){
                var newjson= [].concat(json);
                $.each(this.gatdata,function(){
                    newjson.push(this);
                })
                // newjson.push({'code':"71","name":"台湾省"});
                // newjson.push({'code':"81","name":"香港特别行政区"});
                // newjson.push({'code':"82","name":"澳门特别行政区"});
                console.log(newjson);
                console.log(JSON.stringify(newjson));
                alert("打开浏览器控制台复制数据！文件内替换（办事处）")
            },
            erro:function(){
                this.Error();
            },
            all:function(){
                var level=$("#level").get(0).selectedIndex;
                   json=[];
                   errojson=[];
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
                        url: this.api,
                        data: { url: url, selecter:selecter}
                    }).done(callback).fail(error);;
            },
            Province: function (callback) {
                this.scrape(this.host,this.selecter[0],function(data){
                    json=data;
                    ptotal=data.length;
                    $("#showdetail .detail .ptotal").text(data.length);
                    callback(data);
                });
            },
            City:function(callback){
                var dom=this;
                var selecter=this.selecter;
                dom.Province(function(pdata){
                     $.each(pdata,function(n,item){
                        var url=dom.host+item.code+".html";
                        dom.scrape(url,selecter[1],function(cdata){
                            pcount=pcount+1;
                            item["children"]=cdata;
                            json[n]=item;
                            ctotal=ctotal+cdata.length;
                            $("#showdetail .detail .pcount").text(pcount);
                            $("#showdetail .detail .ctotal").text(ctotal);
                            callback(cdata,n,item);
                        },function(err){
                            errojson.push({level:1,n:n,item:item});
                            var errorstr='<p>地级错误:'+item.name+' &nbsp;错误类型:'+err.responseText+'</p>';
                            $("#showerror").append(errorstr);
                        });
                    });
                });
            },
            Area:function(callback){
                var dom=this;
                var selecter=this.selecter;
                dom.City(function(cdata,n,citem){
                     $.each(cdata,function(m,item){
                         var url=dom.host+citem.code+"/"+item.code+".html";
                         dom.scrape(url,selecter[2],function(sdata){
                              ccount=ccount+1;
                              json[n].children[m]["children"]=sdata;
                              stotal=stotal+sdata.length;
                              $("#showdetail .detail .ccount").text(ccount);
                              $("#showdetail .detail .stotal").text(stotal);
                              callback(sdata,n,m,item);
                         },function(err){
                              errojson.push({level:2,n:n,m:m,item:item});
                              var errorstr='<p>县级错误:'+item.name+' &nbsp;错误类型:'+err.responseText+'</p>';
                              $("#showerror").append(errorstr);
                         });
                     })
                });
            },
            Street:function(){
                var dom=this;
                var selecter=this.selecter;
                dom.Area(function(sdata,n,m,sitem){
                    $.each(sdata,function(i,item){
                        var str1=sitem.code.substr(0,2);
                        var str2=sitem.code.substr(-2);
                        var url=dom.host+str1+"/"+str2+"/"+item.code+".html";
                        dom.scrape(url,selecter[3],function(tdata){
                            scount=scount+1
                            json[n].children[m].children[i]["children"]=tdata;
                            $("#showdetail .detail .scount").text(scount);
                        },function(err){
                            errojson.push({level:3,n:n,m:m,i,i,item:item});
                            var errorstr='<p>乡级错误:'+item.name+' &nbsp;错误类型:'+err.responseText+'</p>';
                            $("#showerror").append(errorstr);
                        });
                    });
                });
            },
            Error:function(){
                $.each(errojson,function(i,item){

                });
            }
        }
    }
</script>
