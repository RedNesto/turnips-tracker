(this["webpackJsonpturnips-tracker"]=this["webpackJsonpturnips-tracker"]||[]).push([[0],{150:function(e,t,r){"use strict";r.r(t);var a=r(0),n=r.n(a),o=r(9),l=r.n(o),i=(r(54),r(28)),s=r(29),u=r(16),c=r(31),f=r(30);r(55);var d=r(17),p=r(27),h=r.n(p);var m=function(){var e=n.a.createRef(),t=n.a.createRef(),r=n.a.createRef();return d.b.global.maintainAspectRatio=!1,n.a.createElement("div",null,n.a.createElement(v,{tableRef:e,priceChartRef:t,profitChartRef:r}),n.a.createElement("div",{style:{display:"none",position:"relative",height:"40vh",width:"95vw"}},n.a.createElement(d.a,{ref:t,data:{}})),n.a.createElement("div",{style:{display:"none",position:"relative",height:"40vh",width:"95vw"}},n.a.createElement(d.a,{ref:r,data:{}})),n.a.createElement(g,{ref:e}))},v=function(e){Object(c.a)(r,e);var t=Object(f.a)(r);function r(e){var a;return Object(i.a)(this,r),(a=t.call(this,e)).state={tableRef:e.tableRef,priceChartRef:e.priceChartRef,profitChartRef:e.profitChartRef},a.handleChange=a.handleChange.bind(Object(u.a)(a)),a}return Object(s.a)(r,[{key:"render",value:function(){return n.a.createElement("form",null,n.a.createElement("label",{htmlFor:"turnips-file"},"Open Turnips Data: "),n.a.createElement("input",{type:"file",id:"turnips-file",onChange:this.handleChange,title:"Open Turnips Data"}))}},{key:"handleChange",value:function(e){var t=e.target.files[0];if(t)if(t instanceof Blob){var r=new FileReader,a=this.state.tableRef.current,n=this.state.priceChartRef.current,o=this.state.profitChartRef.current;r.onload=function(e){var t=r.result;console.assert("string"===typeof t,"readAsText did not return a String result but a %s of value %s",t.constructor.name,t);try{var i=JSON.parse(t);a.setState({entries:i}),n.chartInstance.data=function(e){var t=[],r=[],a=[];function n(e,t,r){return{label:e,data:t,pointRadius:4,pointHoverRadius:6,borderWidth:4,spanGaps:!0,pointBackgroundColor:r,backgroundColor:r,borderColor:r}}return e.forEach((function(e){var n=e.price;if(null!=e.sold){var o="morning"===e.half?"am":"pm";t.push(e.date+o),r.push(n),a.push(null)}else t.push(e.date),r.push(null),a.push(n)})),{labels:t,datasets:[n("Selling Price",r,"rgba(30, 144, 255, 0.2)"),n("Buying Price",a,"rgba(255, 215, 0, 0.2)")],options:{scales:{yAxes:[{stacked:!0}]}}}}(i),n.chartInstance.update(),l.a.findDOMNode(n).parentNode.style.removeProperty("display"),o.chartInstance.data=function(e){var t=[],r=[],a=0,n=0;return e.sort(b).forEach((function(e){if(null!=e.sold){if(0===t.length)return;n+=e.sold*e.price}else 0!==t.length&&r.push(n-a),t.push(e.date),a=e.bought*e.price,n=0})),{labels:t,datasets:[{label:"Profit",data:r}]}}(i),o.chartInstance.update(),l.a.findDOMNode(o).parentNode.style.removeProperty("display")}catch(u){console.error("Error occurred when parsing turnips data: %s",u);var s="more details in the console";u instanceof SyntaxError&&(s=u.message),a.setState({errorMessage:s})}},r.onerror=function(e){var t=r.error;console.error("Error occurred when reading turnips data file: %s",t),a.setState({errorMessage:"could not read file: ".concat(t.message)})},r.readAsText(t),e.preventDefault()}else console.log("Not a Blob, but a %s",t.constructor.name)}}]),r}(n.a.Component),g=function(e){Object(c.a)(r,e);var t=Object(f.a)(r);function r(){return Object(i.a)(this,r),t.apply(this,arguments)}return Object(s.a)(r,[{key:"render",value:function(){if(!this.state)return n.a.createElement("p",null,"No Turnips Data Loaded");var e=this.state.errorMessage;if(e)return n.a.createElement("p",null,"Error when reading the turnips data: ",e);var t=this.state.entries.sort(b).map((function(e,t){return function(e){var t,r=e.bought,a=e.sold,o=e.price;t=null!=r?null!=o||o<=0?n.a.createElement("p",null,"Bought ",r," for ",o*r," (",o,"/unit)"):n.a.createElement("p",null,"Bought ",r," for an unknown price"):null!=a?null!=o||o<=0?n.a.createElement("p",null,"Sold ",a," for ",o*a," (",o,"/unit)"):n.a.createElement("p",null,"Sold ",a," for an unknown price"):n.a.createElement("p",null,"No data available");return n.a.createElement("li",{key:e.date+"-"+e.half},n.a.createElement("p",null,"Turnips of ",e.date," (",(l=e.date,h()(l,"yyyy-MM-DD").format("dddd")),") ",e.half),t);var l}(e)}));return n.a.createElement("ol",{id:"turnips-table"},t)}}]),r}(n.a.Component);function b(e,t){return e.date===t.date?"morning"===e.half&&"afternoon"===t.half?-1:1:function(e,t){if(!e||!t||"string"!==typeof e||"string"!==typeof t)return Number.MIN_SAFE_INTEGER;if(e===t)return 0;var r=e.split("-"),a=t.split("-");if(3!==r.length||3!==a.length)return Number.MIN_SAFE_INTEGER;for(var n=0;n<3;n++){var o=parseInt(r[n]),l=parseInt(a[n]);if(isNaN(o)||isNaN(l))return Number.MIN_SAFE_INTEGER;if(o!==l)return o<l?-1:1}return 0}(e.date,t.date)}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(m,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},49:function(e,t,r){e.exports=r(150)},54:function(e,t,r){},55:function(e,t,r){}},[[49,1,2]]]);
//# sourceMappingURL=main.fa1675a6.chunk.js.map