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
      <button @click="all">开始抓取所有数据</button>
      <button @click="save">保存数据</button>
     <div id="showdetail">
         <p class="p">省级数据获取：共<span class="total">0</span>条</p>
         <p class="c">地级数据获取：</p>
         <p class="s">县级数据获取：</p>
         <p class="t">乡级数据获取：</p>
         <p class="v">村级数据获取：</p>
     </div>
</div>
</template>
<script>
   var json=null;
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
                $.post("/api/savejson",JSON.stringify(json),function(data){
                    alert(data);
                });
            },
            all:function(){
                var level=$("#level").get(0).selectedIndex;;
                switch(level){
                    case 0:
                    {
                        this.Province(function(data){
                            $("#showdetail .p .total").text(data.length);
                            json=data;
                        });
                        break;
                    }
                    case 1:
                    {
                        this.City()
                        break;
                    }

                }
            },
            ajaxHandler:function(url, param){
                   return $.post(url, param).then(function (data) {
                       return data;
                    }, function (err) {
                        return $.Deferred().reject(err);
                    });
            },
            scrape:function (url,selecter,callback) {
                this.ajaxHandler(this.api, { url: url, selecter:selecter}).done(function (data) {
                    callback(data);
                })
            },
            Province: function (callback) {
                this.scrape(this.host,this.selecter[0],function(data){
                    callback(data);
                });
            },
            City:function(){
                var dom=this;
                var selecter=this.selecter;
                dom.Province(function(data){
                    $("#showdetail .p .total").text(data.length);
                     $.each(data,function(){
                        var url=dom.host+this.code+".html";
                        dom.scrape(url,selecter[1],function(data){
                            console.log(data);
                        });
                    });
                });
            }
        }
    }
</script>
