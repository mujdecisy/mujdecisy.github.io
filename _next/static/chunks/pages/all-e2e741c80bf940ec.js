(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[599],{145:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/all",function(){return t(1866)}])},3606:function(e,n,t){"use strict";t.d(n,{Z:function(){return E}});var r=t(5893),o=t(1953),i=t(9756),l=t(2122),a=t(7294),s=t(6010),c=t(4780),u=t(6622),d=t(1719),x=t(8884),m=t(1625),p=t(8155),f=t(9630),h=t(1588),Z=t(4867);function y(e){return(0,Z.Z)("MuiLink",e)}let b=(0,h.Z)("MuiLink",["root","underlineNone","underlineHover","underlineAlways","button","focusVisible"]);var j=t(4844),g=t(1796);let k={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},v=e=>k[e]||e,w=({theme:e,ownerState:n})=>{let t=v(n.color),r=(0,j.DW)(e,`palette.${t}`,!1)||n.color,o=(0,j.DW)(e,`palette.${t}Channel`);return"vars"in e&&o?`rgba(${o} / 0.4)`:(0,g.Fq)(r,.4)},_=["className","color","component","onBlur","onFocus","TypographyClasses","underline","variant","sx"],S=e=>{let{classes:n,component:t,focusVisible:r,underline:o}=e,i={root:["root",`underline${(0,u.Z)(o)}`,"button"===t&&"button",r&&"focusVisible"]};return(0,c.Z)(i,y,n)},T=(0,d.ZP)(f.Z,{name:"MuiLink",slot:"Root",overridesResolver(e,n){let{ownerState:t}=e;return[n.root,n[`underline${(0,u.Z)(t.underline)}`],"button"===t.component&&n.button]}})(({theme:e,ownerState:n})=>(0,l.Z)({},"none"===n.underline&&{textDecoration:"none"},"hover"===n.underline&&{textDecoration:"none","&:hover":{textDecoration:"underline"}},"always"===n.underline&&(0,l.Z)({textDecoration:"underline"},"inherit"!==n.color&&{textDecorationColor:w({theme:e,ownerState:n})},{"&:hover":{textDecorationColor:"inherit"}}),"button"===n.component&&{position:"relative",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none","&::-moz-focus-inner":{borderStyle:"none"},[`&.${b.focusVisible}`]:{outline:"auto"}})),C=a.forwardRef(function(e,n){let t=(0,x.Z)({props:e,name:"MuiLink"}),{className:o,color:c="primary",component:u="a",onBlur:d,onFocus:f,TypographyClasses:h,underline:Z="always",variant:y="inherit",sx:b}=t,j=(0,i.Z)(t,_),{isFocusVisibleRef:g,onBlur:v,onFocus:w,ref:C}=(0,m.Z)(),[D,A]=a.useState(!1),N=(0,p.Z)(n,C),W=e=>{v(e),!1===g.current&&A(!1),d&&d(e)},z=e=>{w(e),!0===g.current&&A(!0),f&&f(e)},E=(0,l.Z)({},t,{color:c,component:u,focusVisible:D,underline:Z,variant:y}),F=S(E);return(0,r.jsx)(T,(0,l.Z)({color:c,className:(0,s.Z)(F.root,o),classes:h,component:u,onBlur:W,onFocus:z,ref:N,ownerState:E,variant:y,sx:[...Object.keys(k).includes(c)?[]:[{color:c}],...Array.isArray(b)?b:[b]]},j))});var D=t(562),A=t(4412),N=t(5084),W=t(5449),z=t(8005);function E(){let e=[{icon:N.Z,link:"https://twitter.com/mujdecisy"},{icon:W.Z,link:"https://github.com/mujdecisy"},{icon:z.Z,link:"https://linkedin.com/in/mujdecisy"}];return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(o.Z,{mt:3,sx:{display:"flex",justifyContent:"space-between",alignItems:"flex-end"},children:[(0,r.jsx)(o.Z,{sx:{alignItems:"flex-end",paddingBottom:"5px"},children:(0,r.jsxs)(C,{href:"/",sx:{textDecoration:"none",fontSize:"larger",fontWeight:"200",color:"black",display:"flex"},children:[(0,r.jsx)(f.Z,{fontSize:"1rem",fontWeight:"light",children:"safa yasin"}),(0,r.jsx)(f.Z,{fontSize:"1.05rem",fontWeight:"bold",sx:{marginLeft:"4px"},children:"mujdeci"})]})}),(0,r.jsx)(o.Z,{sx:{display:"flex",justifyContent:"flex-end"},children:e.map(e=>(0,r.jsx)(D.Z,{"aria-label":e.link,href:e.link,target:"_blank",children:(0,r.jsx)(e.icon,{fontSize:"small"})},e.link))})]}),(0,r.jsx)(A.Z,{})]})}},1866:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return x}});var r=t(5893),o=t(6336),i=t(1953),l=t(5214),a=t(3447),s=t(8069),c=t(4087),u=t(4591),d=t(3606);function x(){let e=[...c.c8,...c.Vr,...c.R6].map(e=>({...e,type:e.contentType,link:e.url,date:new Date(e.date)}));return e.sort((e,n)=>n.date.getTime()-e.date.getTime()),(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)(o.Z,{maxWidth:"sm",children:[(0,r.jsx)(d.Z,{}),(0,r.jsx)("h2",{children:"All"}),(0,r.jsx)(i.Z,{children:(0,r.jsx)(l.Z,{sx:{width:"100%"},children:e.map(e=>(0,r.jsx)(s.Z,{item:{...e,color:u.POST_ATTRIBUTES[e.type].color,date:e.date.toISOString().substring(2,10)}},e.link))})}),(0,r.jsx)(a.Z,{})]})})}}},function(e){e.O(0,[427,371,591,774,888,179],function(){return e(e.s=145)}),_N_E=e.O()}]);