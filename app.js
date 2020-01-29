


  var app = new Vue({
    el: '#app',
    data: localData,
    created: function(){
      var tmpData = localStorage.getItem("localdata");
      if (tmpData && tmpData!=""){
        var data = JSON.parse(tmpData);
        this.content = data.content;
        this.fields = data.fields;
      }
    },
    methods: {
      loadData:function(){
        loadHttpData(this);
      },
      loadFile:function(){
        loadFile(this);
      }
    }
  })