var Editor = Vue.component('editor',{
    props: ['content','fields'],
    template: '#editor-template',
    mounted:function(){
      console.log("content",this.content);
    },
    methods: {
      edited: function(content, obj, idx){
        obj[idx] = JSON.parse(JSON.stringify(obj[idx]));
      }
    }
})

var DataLabel = Vue.component('datalabel',{
    props: ['name','config'],
    template: '#datalabel-template',
    methods:{
      changed: function(ev,obj,idx){
      },
      typeDesc : function(type){
        return fieldTypes[type]
      }
    }
})

var StringEdit = Vue.component('string_edit',{
    props: ['object','name','config','placeholder'],
    template: '#string_edit-template',
    methods:{
      changed: function(ev,obj,idx){
      }
    }
})

var TextEdit = Vue.component('text_edit',{
    extends: StringEdit,
    template: '#text_edit-template'
})

var TextEdit = Vue.component('object_edit',{
    props: ['object','name','config'],
    template: '#object_edit-template',
    computed: {
      fieldMeta: function(){
        if (this['lastFields']){
          return this['lastFields'];
        }
        this.lastFields = getFields(this.object[this.name])
        return this.lastFields
      }
    }
})

var HtmlEdit = Vue.component('html_edit',{
    props: ['object','name','config','placeholder'],
    template: '#html_edit-template',
    data: function(){
      return {
        visual: true
      }
    },
    methods:{
      changed: function(ev,obj,idx){
        console.log("Changed",ev.srcElement.innerHTML);
        obj[idx] = ev.srcElement.innerHTML;
        this.$emit("contentchanged",this.object)
      },
      execCommand: function(ev, cmd, value){
        console.log(ev)
        document.execCommand(cmd, true, value)
      }
    }
})

var NumberEdit = Vue.component('number_edit',{
    extends: StringEdit,
    template: '#number_edit-template',
    methods:{
      changed: function(ev,obj,idx){
        if (obj[idx]==""){
          obj[idx] = null;
        }else{
          obj[idx] = obj[idx]*1;
        }
      }
    }
})

var BooleanEdit = Vue.component('boolean_edit',{
    extends: StringEdit,
    template: '#boolean_edit-template',
    methods:{
      changed: function(ev,obj,idx){
        if (obj[idx]==""){
          obj[idx]=null;
        }else{
          obj[idx] = obj[idx]*1;
        }
      }
    }
})

var StringArrayEdit = Vue.component('string_array_edit',{
    props: ['object','name','config'],
    data: function() {
      return {
        defaultItem: '',
        newItem: {
          value: ''
        },
        newKey: {
          value: ''
        },
        subtype: 'string'
      }
    },
    template: '#data_array_edit-template',
    methods:{
      remove:function(obj,item){
        console.log("removing",item)
        obj.splice(item,1)
      },
      add:function(obj){
        obj.push(this.newItem.value)
        this.newKey.value = ''
        this.newItem.value = JSON.parse(JSON.stringify(this.defaultItem))
      },
      addKey:function(obj){
        obj[this.newKey.value]=this.newItem.value;
        obj = JSON.parse(JSON.stringify(obj));
        this.newKey.value = ''
        this.newItem.value = JSON.parse(JSON.stringify(this.defaultItem))
        this.$emit("change",obj)
      },
      changed:function(content,obj,item){
        this.$emit("change",content)
      },
      isArray:function(obj){
        return typeof(obj)=="object" && Array.isArray(obj)
      }
    }
})

var NumberArrayEdit = Vue.component('number_array_edit',{
  extends: StringArrayEdit,
  data: function() {
    return {
      newItem: {
        value: ''
      },
      subtype: 'number'
    }
  },
})

var BooleanArrayEdit = Vue.component('boolean_array_edit',{
  extends: StringArrayEdit,
  data: function() {
    return {
      newItem: {
        value: ''
      },
      subtype: 'boolean'
    }
  },
})

var TextArrayEdit = Vue.component('text_array_edit',{
  extends: StringArrayEdit,
  data: function() {
    return {
      newItem: {
        value: ''
      },
      subtype: 'text'
    }
  },
})

var ObjectArrayEdit = Vue.component('object_array_edit',{
  extends: StringArrayEdit,
  data: function() {
    var item = {};
    if (Array.isArray(this.object[this.name]) && this.object[this.name].length){
      item=JSON.parse(JSON.stringify(this.object[this.name][0]));
    }
    item = clearValue(item);
    return {
      defaultItem: item,
      newItem: {value: JSON.parse(JSON.stringify(item))},
      subtype: 'object'
    }
  },
  created: function(){
  },
})

var HtmlArrayEdit = Vue.component('html_array_edit',{
    props: ['object','name','config'],
    data: function() {
      return {
        newItem: {
          value: ''
        },
        newKey: {
          value: ''
        },
        subtype: 'html'
      }
    },
    template: '#data_array_edit-template',
    methods:{
      remove:function(obj,item){
        obj.splice(item,1)
      },
      add:function(obj){
        if (this.isArray(obj)){
          obj.push(this.newItem.value)
        }else{
          obj[this.newKey.value]=this.newItem.value;
        }
        this.newItem.value=''
        this.newKey.value=''
      },
      changed:function(content,obj,item){
        this.$emit("change",content)
      },
      isArray:function(obj){
        return typeof(obj)=="object" && Array.isArray(obj)
      }
    }
})

var fieldTypes = {
  "string" : "Regular text",
  "text" : "Text",
  "number" : "Number",
  "boolean" : "Boolean",
  "html" : "HTML formatted",
  "string_array" : "String list",
  "text_array" : "Text list",
  "html_array" : "HTML list",
  "number_array" : "Number list",
  "object_array" : "Object list",
}

var localData = {
  content : [{items:[]}],
  fields : {
    items: {
          label: "Items",
          type: "string_array"
      }
  },
  fieldMeta: {
    fields : {
      label: "Fields",
      type: "object_array"
    }
  }
}

var fieldMeta = {
}

var lastSave = localData;

var isOriginalArray = true;

function saveData(){
  if (localStorage.getItem('localdata')){
    lastSave = JSON.parse(localStorage.getItem('localdata'));
    document.getElementById('restore-button').disabled=false;
  }
  localStorage.setItem('localdata',JSON.stringify(localData));
}

function clearData(){
  localStorage.removeItem('localdata');
  document.location.reload();
}

function restoreData(){
  localStorage.setItem('localdata',JSON.stringify(lastSave));
  document.location.reload();
}

function exportData(){
  var data = localData.content;
  if (!isOriginalArray){
    data = data[0];
  }
  var content = JSON.stringify(data,null," ");
  var link=document.createElement("a");
  link.setAttribute("download","export.json");
  link.setAttribute("href","data:text/plain;base64,"+btoa(content));
  link.style.display='none';
  document.body.appendChild(link);
  link.click();
  setTimeout(function(){ document.body.removeChild(link);},5000);
}

function loadHttpData(target){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function(){
    var data = JSON.parse(this.responseText)
    loadData(data,target)
  });
  oReq.open("GET", "data.json");
  oReq.send();
}

function loadData(data, target){
  if (typeof(data.length)!="number"){
    data = [data]
    isOriginalArray = false;
  }
  var fields = getFields(data[0]);
  target.content = data;
  target.fields = fields;
}

function loadFile(target){
  var file=document.createElement("input");
  file.setAttribute("type","file");
  file.setAttribute("accept",".json");
  file.style.display = 'none';
  file.onchange=function(ev){
    var loadfile = file.files[0];
    if (loadFile){
      var reader = new FileReader();
      reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
          var data=JSON.parse(evt.target.result.toString())
          if (data){
            loadData(data,target)
          }
          document.body.removeChild(file);
        }
      }
      reader.readAsBinaryString(loadfile);
    }
  }
  document.body.appendChild(file);
  file.click()
}

function getType(content){
  var fldtype = typeof(content);
  var type = "string"
  if (fldtype=="number"){
    type = "number"
  }
  if (fldtype=="boolean"){
    type = "boolean"
  }
  if (fldtype=="string" && (content.length>64 || content.indexOf('\n')>-1)){
    type = "text"
  }
  if (fldtype=="string" && content.indexOf('<')>-1 && content.indexOf('>')>-1){
    type = "html"
  }
  if (fldtype=="object"){
    type = "object"
    if (Array.isArray(content)){
      type = getType(content[0]) + "_array"
    }
  }
  //console.log("fldtype",fldtype,type,content);
  return type
}

function clearValue(obj){
  if (obj==null){
    return null;
  }
  var fldtype=typeof(obj);
  if (fldtype=="number"){
    return 0;
  }
  if (fldtype=="boolean"){
    return false;
  }
  if (fldtype=="string"){
    return "";
  }
  if (fldtype=="object"){
    if (Array.isArray(obj)){
      return [clearValue(obj[0])];
    }else{
      var newObj=JSON.parse(JSON.stringify(obj));
      for(var key in newObj){
        newObj[key]=clearValue(newObj[key]);
      }
      return newObj;
    }
  }
}

function getFields(data){
  console.log("getFields",data);
  var fields = {}
  var fieldMeta = {}
  for (var field in data){
    var fld={}
    fld.label = field.substring(0,1).toUpperCase() + field.substring(1);
    fld.type = getType(data[field]);
    fields[field]=fld
  }
  return fields
}