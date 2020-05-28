(this["webpackJsonpturnips-tracker"]=this["webpackJsonpturnips-tracker"]||[]).push([[0],{13:function(e,t,n){},14:function(e,t,n){},15:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(7),l=n.n(o),i=(n(13),n(2)),u=n(3),s=n(1),c=n(5),f=n(4);n(14);var p=function(){var e=a.a.createRef();return a.a.createElement("div",null,a.a.createElement(d,{tableRef:e}),a.a.createElement(h,{ref:e}))},d=function(e){Object(c.a)(n,e);var t=Object(f.a)(n);function n(e){var r;return Object(i.a)(this,n),(r=t.call(this,e)).state={tableRef:e.tableRef},r.handleChange=r.handleChange.bind(Object(s.a)(r)),r}return Object(u.a)(n,[{key:"render",value:function(){return a.a.createElement("form",null,a.a.createElement("label",{htmlFor:"turnips-file"},"Open Turnips Data: "),a.a.createElement("input",{type:"file",id:"turnips-file",onChange:this.handleChange,title:"Open Turnips Data"}))}},{key:"handleChange",value:function(e){var t=e.target.files[0];if(t)if(t instanceof Blob){var n=new FileReader,r=this.state.tableRef.current;n.onload=function(e){var t=n.result;console.assert("string"===typeof t,"readAsText did not return a String result but a %s of value %s",t.constructor.name,t);try{var a=JSON.parse(t);r.setState({entries:a})}catch(l){console.error("Error occurred when parsing turnips data: %s",l);var o="more details in the console";l instanceof SyntaxError&&(o=l.message),r.setState({errorMessage:o})}},n.onerror=function(e){var t=n.error;console.error("Error occurred when reading turnips data file: %s",t),r.setState({errorMessage:"could not read file: ".concat(t.message)})},n.readAsText(t),e.preventDefault()}else console.log("Not a Blob, but a %s",t.constructor.name)}}]),n}(a.a.Component),h=function(e){Object(c.a)(n,e);var t=Object(f.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){if(!this.state)return a.a.createElement("p",null,"No Turnips Data Loaded");var e=this.state.errorMessage;if(e)return a.a.createElement("p",null,"Error when reading the turnips data: ",e);var t=this.state.entries.sort(m).map((function(e,t){return function(e){var t,n=e.bought,r=e.sold,o=e.price;t=null!=n?null!=o||o<=0?a.a.createElement("p",null,"Bought ",n," for ",o*n," (",o,"/unit)"):a.a.createElement("p",null,"Bought ",n," for an unknown price"):null!=r?null!=o||o<=0?a.a.createElement("p",null,"Sold ",r," for ",o*r," (",o,"/unit)"):a.a.createElement("p",null,"Sold ",r," for an unknown price"):a.a.createElement("p",null,"No data available");return a.a.createElement("li",{key:e.date+"-"+e.half},a.a.createElement("p",null,"Turnips of ",e.date," ",e.half),t)}(e)}));return a.a.createElement("ol",{id:"turnips-table"},t)}}]),n}(a.a.Component);function m(e,t){return e.date===t.date?"morning"===e.half&&"afternoon"===t.half?-1:1:function(e,t){if(!e||!t||"string"!==typeof e||"string"!==typeof t)return Number.MIN_SAFE_INTEGER;if(e===t)return 0;var n=e.split("-"),r=t.split("-");if(3!==n.length||3!==r.length)return Number.MIN_SAFE_INTEGER;for(var a=0;a<3;a++){var o=parseInt(n[a]),l=parseInt(r[a]);if(isNaN(o)||isNaN(l))return Number.MIN_SAFE_INTEGER;if(o!==l)return o<l?-1:1}return 0}(e.date,t.date)}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(p,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},8:function(e,t,n){e.exports=n(15)}},[[8,1,2]]]);
//# sourceMappingURL=main.ded7050b.chunk.js.map