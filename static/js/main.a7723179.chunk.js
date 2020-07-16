(this["webpackJsonpturnips-tracker"]=this["webpackJsonpturnips-tracker"]||[]).push([[0],{150:function(e,t,r){"use strict";r.r(t);var a=r(0),n=r.n(a),o=r(10),l=r.n(o),i=(r(54),r(28)),s=r(29),c=r(4),u=r(31),d=r(30);r(55);var f=r(17),p=r(27),h=r.n(p);var m=function(){var e=n.a.createRef(),t=n.a.createRef(),r=n.a.createRef();return f.b.global.maintainAspectRatio=!1,n.a.createElement("div",null,n.a.createElement(v,{tableRef:e,priceChartRef:t,profitChartRef:r}),n.a.createElement("div",{style:{display:"none",position:"relative",height:"40vh",width:"95vw"}},n.a.createElement(f.a,{ref:t,data:{}})),n.a.createElement("div",{style:{display:"none",position:"relative",height:"40vh",width:"95vw"}},n.a.createElement(f.a,{ref:r,data:{}})),n.a.createElement(b,{ref:e}))},v=function(e){Object(u.a)(r,e);var t=Object(d.a)(r);function r(e){var a;return Object(i.a)(this,r),(a=t.call(this,e)).state={tableRef:e.tableRef,priceChartRef:e.priceChartRef,profitChartRef:e.profitChartRef},a.useSample=a.useSample.bind(Object(c.a)(a)),a.handleChange=a.handleChange.bind(Object(c.a)(a)),a.parseAndOpenJson=a.parseAndOpenJson.bind(Object(c.a)(a)),a.reportError=a.reportError.bind(Object(c.a)(a)),a.clearError=a.clearError.bind(Object(c.a)(a)),a}return Object(s.a)(r,[{key:"render",value:function(){return n.a.createElement("form",null,n.a.createElement("label",{htmlFor:"turnips-file"},"Open Turnips Data: "),n.a.createElement("input",{type:"file",id:"turnips-file",onChange:this.handleChange,title:"Open Turnips Data"}),n.a.createElement("button",{onClick:this.useSample},"Open Sample"))}},{key:"useSample",value:function(e){var t=this;fetch("/turnips-tracker/sample.json").then((function(e){if(e.ok)return e.text();t.reportError("Could not get sample data: ".concat(e.status," ").concat(e.statusText))})).then(this.parseAndOpenJson),e.preventDefault()}},{key:"handleChange",value:function(e){var t=this,r=e.target.files[0];if(r)if(r instanceof Blob){var a=new FileReader,n=this.state.tableRef.current;a.onload=function(e){var r=a.result;console.assert("string"===typeof r,"readAsText did not return a String result but a %s of value %s",r.constructor.name,r),t.parseAndOpenJson(r)},a.onerror=function(e){var t=a.error;console.error("Error occurred when reading turnips data file: %s",t),n.setState({errorMessage:"could not read file: ".concat(t.message)})},a.readAsText(r),e.preventDefault()}else console.log("Not a Blob, but a %s",r.constructor.name)}},{key:"parseAndOpenJson",value:function(e){try{var t=JSON.parse(e);this.openJson(t)}catch(a){console.error("Error occurred when opening turnips data: %s",a);var r="more details in the console";a instanceof SyntaxError&&(r=a.message),this.reportError(r)}}},{key:"openJson",value:function(e){var t=this.state.priceChartRef.current,r=this.state.profitChartRef.current;this.state.tableRef.current.setState({entries:e}),t.chartInstance.data=function(e){var t=[],r=[],a=[];function n(e,t,r){return{label:e,data:t,pointRadius:4,pointHoverRadius:6,borderWidth:4,spanGaps:!0,pointBackgroundColor:r,backgroundColor:r,borderColor:r}}return e.forEach((function(e){var n=e.price;if(null!=e.sold){var o="morning"===e.half?"am":"pm";t.push(e.date+o),r.push(n),a.push(null)}else t.push(e.date),r.push(null),a.push(n)})),{labels:t,datasets:[n("Selling Price",r,"rgba(30, 144, 255, 0.2)"),n("Buying Price",a,"rgba(255, 215, 0, 0.2)")],options:{scales:{yAxes:[{stacked:!0}]}}}}(e),t.chartInstance.update(),l.a.findDOMNode(t).parentNode.style.removeProperty("display"),r.chartInstance.data=function(e){var t=[],r=[],a=0,n=0;e.sort(E).forEach((function(e){if(null!=e.sold){if(0===t.length)return;n+=e.sold*e.price}else 0!==t.length&&r.push(n-a),t.push(e.date),a=e.bought*e.price,n=0})),(a>0||n>0)&&r.push(n-a);return{labels:t,datasets:[{label:"Profit",data:r}]}}(e),r.chartInstance.update(),l.a.findDOMNode(r).parentNode.style.removeProperty("display"),this.clearError()}},{key:"reportError",value:function(e){this.state.tableRef.current.setState({errorMessage:e})}},{key:"clearError",value:function(){this.state.tableRef.current.setState({errorMessage:null})}}]),r}(n.a.Component),b=function(e){Object(u.a)(r,e);var t=Object(d.a)(r);function r(){return Object(i.a)(this,r),t.apply(this,arguments)}return Object(s.a)(r,[{key:"render",value:function(){if(!this.state)return n.a.createElement("p",null,"No Turnips Data Loaded");var e=this.state.errorMessage;if(e)return n.a.createElement("p",null,"Error when reading the turnips data: ",e);var t=this.state.entries.sort(E).map((function(e){return function(e){var t,r,a=e.bought,o=e.sold,l=e.price;if(null!=a)if(r=a.toLocaleString(),a<=0)t="Bought none";else if(null!=l&&l>0){var i=(l*a).toLocaleString();t="Bought ".concat(r," for ").concat(i," (").concat(l,"/unit)")}else t="Bought ".concat(r," for an unknown price");else if(null!=o)if(r=o.toLocaleString(),o<=0)t="Sold none";else if(null!=l&&l>0){var s=(l*o).toLocaleString();t="Sold ".concat(r," for ").concat(s," (").concat(l,"/unit)")}else t="Sold ".concat(r," for an unknown price");else r="unknown",t="No data available";return n.a.createElement("tr",{key:e.date+"-"+e.half},n.a.createElement("td",null,e.date," (",(c=e.date,h()(c,"yyyy-MM-DD").format("dddd")),") ",e.half),n.a.createElement("td",null,l),n.a.createElement("td",null,r),n.a.createElement("td",null,t));var c}(e)}));return n.a.createElement("table",{id:"turnips-table"},n.a.createElement("thead",null,n.a.createElement("tr",null,n.a.createElement("th",null,"Date"),n.a.createElement("th",null,"Price"),n.a.createElement("th",null,"Bought / Sold"),n.a.createElement("th",null,"Detail"))),n.a.createElement("tbody",null,t))}}]),r}(n.a.Component);function E(e,t){return e.date===t.date?"morning"===e.half&&"afternoon"===t.half?-1:1:function(e,t){if(!e||!t||"string"!==typeof e||"string"!==typeof t)return Number.MIN_SAFE_INTEGER;if(e===t)return 0;var r=e.split("-"),a=t.split("-");if(3!==r.length||3!==a.length)return Number.MIN_SAFE_INTEGER;for(var n=0;n<3;n++){var o=parseInt(r[n]),l=parseInt(a[n]);if(isNaN(o)||isNaN(l))return Number.MIN_SAFE_INTEGER;if(o!==l)return o<l?-1:1}return 0}(e.date,t.date)}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(m,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},49:function(e,t,r){e.exports=r(150)},54:function(e,t,r){},55:function(e,t,r){}},[[49,1,2]]]);
//# sourceMappingURL=main.a7723179.chunk.js.map