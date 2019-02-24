<template>
  <div id="divisions">
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
      <span style="color:red;">注:最多获取到四级数据（乡级和村级可以数据可通过请求获取）</span>
     <div id="showdetail">
         <p class="detail">数据获取情况：<span class="total">0</span>/<span class="count">0</span>
         &nbsp; 获取<span class="remark" style="color:red;"></span>数据完毕！</p>
     </div>
      <div id="showerror">
     </div>
</div>
</template>
<script>
    var json=null;
    var pcount=0;
    var ptotal=0,ctotal=0,stotal=0,ttotal=0,vtotal=0;
    export default {
        data () {
            return {
                api1:"/api/cheerio",
                api2:"/api/puppeteer",
                api:"/api/cheerio",
                host:"http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/",
                selecter:[".provincetr td",".citytr td:last-child","countytr",".towntr td:last-child","villagetr"]
            }
        },
        methods:{
            save:function(){

                json.push({'code':"71","name":"台湾省"});
                json.push({'code':"81","name":"香港特别行政区"});
                json.push({'code':"82","name":"澳门特别行政区"});
                console.log(json);
                $.post("/api/savejson",JSON.stringify(json),function(data){
                    alert(data);
                });
            },
            all:function(){
                var level=$("#level").get(0).selectedIndex;
                pcount=0;
                switch(level){
                    case 0:
                    {
                        this.Province(function(data){});
                        break;
                    }
                    case 1:
                    {
                        this.City(function(data,n,item){})
                        break;
                    }
                    case 2:
                    {
                        this.Area(function(data,n,item){
                          
                        })
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
                    $("#showdetail .detail .total").text(data.length);
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
                            $("#showdetail .detail .count").text(pcount);
                            $("#showdetail .detail .remark").text(item.name);
                            callback(cdata,n,item);
                        },function(err){
                            console.log(n+";"+item.code+";"+item.name+";"+err.responseText);
                        });
                    });
                });
            },
            Area:function(callback){
                var dom=this;
                var selecter=this.selecter;
                dom.City(function(cdata,n,item){
                   
                });
            }
        }
    }
</script>
