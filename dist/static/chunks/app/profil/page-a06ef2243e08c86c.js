(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[997],{556:(e,a,s)=>{Promise.resolve().then(s.bind(s,4244))},4244:(e,a,s)=>{"use strict";s.r(a),s.d(a,{default:()=>C});var t=s(5155),r=s(2115),i=s(5007),l=s(4085),n=s(2336),d=s(5785),o=s(3518),c=s(7401);let m=(0,c.A)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]),u=(0,c.A)("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]),x=(0,c.A)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);var h=s(1719);let f=(0,c.A)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);var p=s(750),g=s(3898),v=s(652),j=s(9602);let y=(0,v.F)("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function N(e){let{className:a,variant:s,...r}=e;return(0,t.jsx)("div",{className:(0,j.cn)(y({variant:s}),a),...r})}function w(e){let{className:a,...s}=e;return(0,t.jsx)("div",{className:(0,j.cn)("animate-pulse rounded-md bg-primary/10",a),...s})}var b=s(6046),k=s(7837);function C(){let e=(0,b.useRouter)(),[a,s]=(0,r.useState)(!0),[c,v]=(0,r.useState)(null),[j,y]=(0,r.useState)(!1),[C,z]=(0,r.useState)(0),[S,R]=(0,r.useState)({name:"",mail:""}),[A,P]=(0,r.useState)(!1),[_,E]=(0,r.useState)([]),[L,T]=(0,r.useState)(null),[J,M]=(0,r.useState)([]),[I,$]=(0,r.useState)(null),[B,H]=(0,r.useState)(""),[W,G]=(0,r.useState)(1),V=e=>{z(e)},Z=()=>{let e=localStorage.getItem("guid"),a=localStorage.getItem("guidExpires");return!!e&&!!a&&(!(new Date(a)<new Date)||(D(),!1))};(0,r.useEffect)(()=>{(async()=>{if(!Z()){e.push("/login");return}let a=localStorage.getItem("guid");if(!a){e.push("/login");return}try{await F(a)}catch(e){console.error("Kullanıcı bilgileri alınamadı:",e),D()}finally{s(!1)}})()},[e]),(0,r.useEffect)(()=>{if(c&&c.vehiclemodels&&c.vehiclemodels.length>0){let e=c.vehiclemodels.findIndex(e=>"1"===e.primary);z(-1!==e?e:0)}},[c]),(0,r.useEffect)(()=>{c&&j&&R({name:c.name,mail:c.mail})},[j,c]);let F=async e=>{let a=await fetch("https://instatistik.com/lixhium/getuserprofile.php",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"guid=".concat(e)});if(a.ok){var s,t;let e=await a.json(),r=(null===(s=e.vehiclemodels)||void 0===s?void 0:s[0])||[];v({...e,vehiclemodels:Array.isArray(r)?r:[],billingAddres:(null===(t=e.billingAddres)||void 0===t?void 0:t[0])||[]})}else throw Error("Kullanıcı bilgileri alınamadı")},O=async()=>{try{let e=localStorage.getItem("guid");if(!e||!c)return;(await fetch("https://instatistik.com/lixhium/updateuser.php",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({userguid:e,name:S.name,phonecode:c.phonecode,phone:c.phone,mail:S.mail}).toString()})).ok&&(await F(e),y(!1))}catch(e){console.error("G\xfcncelleme hatası:",e)}},D=()=>{document.cookie="guid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;",localStorage.removeItem("guid"),localStorage.removeItem("guidExpires"),e.push("/login")},q=async e=>{try{if((await fetch("https://instatistik.com/lixhium/deletevehicle.php",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"id=".concat(e)})).ok){let a=localStorage.getItem("guid");a&&await F(a),(null==X?void 0:X.uvmid)===e&&Array.isArray(null==c?void 0:c.vehiclemodels)&&c.vehiclemodels.length>1&&z(0)}else throw Error("Ara\xe7 silinirken bir hata oluştu")}catch(e){console.error("Ara\xe7 silme hatası:",e)}},K=async()=>{try{let e=await fetch("https://instatistik.com/lixhium/getvehiclebrands.php");if(e.ok){let a=await e.json();E(a)}}catch(e){console.error("Markalar y\xfcklenirken hata:",e)}},U=async e=>{try{let a=await fetch("https://instatistik.com/lixhium/getvehiclemodels.php?vehiclebrandsid=".concat(e));if(a.ok){let e=await a.json();M(e)}}catch(e){console.error("Modeller y\xfcklenirken hata:",e)}},Y=async()=>{if(!I||!B)return;let e=localStorage.getItem("guid");if(e)try{(await fetch("https://instatistik.com/lixhium/adduservehicle.php",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"userguid=".concat(e,"&vehiclemodelsid=").concat(I.id,"&plate=").concat(B)})).ok&&(await F(e),Q())}catch(e){console.error("Ara\xe7 eklenirken hata:",e)}},Q=()=>{P(!1),T(null),$(null),H(""),G(1)};if((0,r.useEffect)(()=>{A&&1===W&&K()},[A]),(0,r.useEffect)(()=>{L&&U(L.id)},[L]),a)return(0,t.jsx)("div",{className:"container mx-auto p-4 max-w-4xl",children:(0,t.jsx)(i.Zp,{children:(0,t.jsxs)(i.Wu,{className:"p-6 space-y-4",children:[(0,t.jsx)(w,{className:"h-12 w-[250px]"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(w,{className:"h-4 w-[200px]"}),(0,t.jsx)(w,{className:"h-8 w-full"})]})]})})});if(!c)return null;let X=c.vehiclemodels[C];return(0,t.jsxs)("div",{className:"container mx-auto p-4 space-y-6 max-w-4xl",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)(l.$,{variant:"ghost",size:"icon",onClick:()=>window.close(),className:"hover:bg-accent",children:(0,t.jsx)(o.A,{className:"h-6 w-6"})}),(0,t.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:"Profil"})]}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Hesap bilgilerinizi g\xf6r\xfcnt\xfcleyin ve y\xf6netin"})]}),(0,t.jsxs)(l.$,{variant:"destructive",onClick:D,className:"gap-2",children:[(0,t.jsx)(m,{className:"h-4 w-4"}),"\xc7ıkış Yap"]})]}),(0,t.jsxs)(i.Zp,{children:[(0,t.jsxs)(i.aR,{className:"flex flex-row items-center justify-between",children:[(0,t.jsx)(i.ZB,{children:"Bilgilerim"}),(0,t.jsxs)(k.lG,{open:j,onOpenChange:y,children:[(0,t.jsx)(k.zM,{asChild:!0,children:(0,t.jsx)(l.$,{variant:"ghost",size:"icon",children:(0,t.jsx)(u,{className:"h-4 w-4"})})}),(0,t.jsxs)(k.Cf,{className:"sm:max-w-[425px]",children:[(0,t.jsxs)(k.c7,{children:[(0,t.jsx)(k.L3,{children:"Profil Bilgilerini D\xfczenle"}),(0,t.jsx)(k.rr,{children:"İsim ve e-posta bilgilerinizi g\xfcncelleyebilirsiniz."})]}),(0,t.jsxs)("div",{className:"grid gap-4 py-4",children:[(0,t.jsxs)("div",{className:"grid gap-2",children:[(0,t.jsx)(d.J,{htmlFor:"name",children:"İsim"}),(0,t.jsx)(n.p,{id:"name",value:S.name,onChange:e=>R(a=>({...a,name:e.target.value}))})]}),(0,t.jsxs)("div",{className:"grid gap-2",children:[(0,t.jsx)(d.J,{htmlFor:"mail",children:"E-posta"}),(0,t.jsx)(n.p,{id:"mail",type:"email",value:S.mail,onChange:e=>R(a=>({...a,mail:e.target.value}))})]})]}),(0,t.jsxs)(k.Es,{children:[(0,t.jsx)(l.$,{variant:"outline",onClick:()=>y(!1),children:"İptal"}),(0,t.jsx)(l.$,{onClick:O,children:"Kaydet"})]})]})]})]}),(0,t.jsx)(i.Wu,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(d.J,{children:"İsim"}),(0,t.jsx)("p",{className:"text-lg font-medium",children:c.name})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(d.J,{children:"Telefon"}),(0,t.jsxs)("p",{className:"text-lg font-medium",children:[c.phonecode," ",c.phone]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(d.J,{children:"E-posta"}),(0,t.jsx)("p",{className:"text-lg font-medium",children:c.mail})]}),(0,t.jsxs)("div",{className:"flex flex-row items-center",children:[(0,t.jsx)(d.J,{children:"\xdcyelik Durumu"}),(0,t.jsx)("div",{className:"pl-2",children:(0,t.jsx)(N,{variant:"1"===c.lixhium_pro?"default":"secondary",className:"mt-1",children:"1"===c.lixhium_pro?"Lixhium Pro":"Standart \xdcye"})})]})]})})]}),(0,t.jsxs)(i.Zp,{children:[(0,t.jsxs)(i.aR,{className:"flex flex-row items-center justify-between",children:[(0,t.jsx)(i.ZB,{children:"Ara\xe7larım"}),c.vehiclemodels.length>0?(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(l.$,{variant:"outline",size:"icon",className:"h-8 w-8",onClick:()=>P(!0),children:(0,t.jsx)(x,{className:"h-4 w-4"})}),(0,t.jsxs)(p.rI,{children:[(0,t.jsx)(p.ty,{asChild:!0,children:(0,t.jsx)(l.$,{variant:"ghost",size:"icon",children:(0,t.jsx)(h.A,{className:"h-4 w-4"})})}),(0,t.jsx)(p.SQ,{align:"end",className:"w-[300px]",children:c.vehiclemodels.map((e,a)=>(0,t.jsxs)(p._2,{className:"flex items-center space-x-3 p-3",children:[(0,t.jsxs)("div",{className:"flex-1 flex items-center space-x-3 cursor-pointer",onClick:()=>V(a),children:[(0,t.jsxs)(g.eu,{className:"h-10 w-10",children:[(0,t.jsx)(g.BK,{src:e.image?"https://instatistik.com/lixhium/".concat(e.image):"",alt:e.name,className:"object-contain"}),(0,t.jsx)(g.q5,{children:e.brandname[0]})]}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("p",{className:"font-medium",children:[e.brandname," ",e.name]}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:e.plate})]}),"1"===e.primary&&(0,t.jsx)(N,{variant:"secondary",children:"Birincil"})]}),(0,t.jsx)(l.$,{variant:"ghost",size:"icon",className:"h-8 w-8 ml-2 hover:bg-destructive hover:text-destructive-foreground",onClick:a=>{a.stopPropagation(),q(e.uvmid)},children:(0,t.jsx)(f,{className:"h-4 w-4"})})]},"".concat(e.id,"-").concat(a)))})]})]}):(0,t.jsxs)(l.$,{variant:"outline",className:"gap-2",onClick:()=>P(!0),children:[(0,t.jsx)(x,{className:"h-4 w-4"}),"Ara\xe7 Ekle"]})]}),X?(0,t.jsx)(i.Wu,{children:(0,t.jsxs)("div",{className:"flex items-start space-x-4",children:[(0,t.jsxs)(g.eu,{className:"h-24 w-24",children:[(0,t.jsx)(g.BK,{src:X.image?"https://instatistik.com/lixhium/".concat(X.image):"",alt:X.name,className:"object-contain"}),(0,t.jsx)(g.q5,{className:"text-2xl",children:X.brandname[0]})]}),(0,t.jsxs)("div",{className:"flex-1 space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("h3",{className:"text-xl font-semibold",children:[X.brandname," ",X.name]}),"1"===X.primary&&(0,t.jsx)(N,{children:"Birincil Ara\xe7"})]}),(0,t.jsx)("p",{className:"text-muted-foreground",children:X.plate}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4 mt-4",children:[X.bataryakapasitesi&&(0,t.jsxs)("div",{children:[(0,t.jsx)(d.J,{children:"Batarya Kapasitesi"}),(0,t.jsxs)("p",{className:"text-lg font-medium",children:[X.bataryakapasitesi," kWh"]})]}),X.maxsarjhizi&&(0,t.jsxs)("div",{children:[(0,t.jsx)(d.J,{children:"Max Şarj Hızı"}),(0,t.jsxs)("p",{className:"text-lg font-medium",children:[X.maxsarjhizi," kW"]})]}),X.WLTP_menzil&&(0,t.jsxs)("div",{children:[(0,t.jsx)(d.J,{children:"WLTP Menzil"}),(0,t.jsxs)("p",{className:"text-lg font-medium",children:[X.WLTP_menzil," km"]})]}),X.menzil100&&(0,t.jsxs)("div",{children:[(0,t.jsx)(d.J,{children:"100 km T\xfcketim"}),(0,t.jsxs)("p",{className:"text-lg font-medium",children:[X.menzil100," kWh"]})]})]})]})]})}):(0,t.jsx)(i.Wu,{className:"text-center py-8 text-muted-foreground",children:"Hen\xfcz ara\xe7 eklenmemiş."})]}),(0,t.jsx)(k.lG,{open:A,onOpenChange:P,children:(0,t.jsxs)(k.Cf,{className:"max-w-[350px]",children:[(0,t.jsx)(k.c7,{children:(0,t.jsx)(k.L3,{children:1===W?"Marka Se\xe7in":2===W?"Model Se\xe7in":"Plaka Girin"})}),(0,t.jsxs)("div",{className:"py-4",children:[1===W&&(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2",children:_.map(e=>(0,t.jsxs)(l.$,{variant:"outline",className:"min-h-[100px] p-3 flex flex-col items-center gap-2 ".concat((null==L?void 0:L.id)===e.id?"border-primary":""),onClick:()=>{T(e),G(2)},children:[(0,t.jsx)("img",{src:"https://instatistik.com/lixhium/".concat(e.image),alt:e.name,className:"h-12 w-12 object-contain"}),(0,t.jsx)("span",{className:"text-sm font-medium text-center",children:e.name})]},e.id))}),2===W&&(0,t.jsx)("div",{className:"grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2",children:J.map(e=>(0,t.jsx)(l.$,{variant:"outline",className:"min-h-[120px] p-3 flex flex-col items-center ".concat((null==I?void 0:I.id)===e.id?"border-primary":""),onClick:()=>{$(e),G(3)},children:(0,t.jsxs)("div",{className:"flex-1 flex flex-col items-center justify-between h-full",children:[(0,t.jsx)("img",{src:"https://instatistik.com/lixhium/".concat(e.image),alt:e.name,className:"h-16 w-16 object-contain mb-2"}),(0,t.jsx)("div",{className:"w-full",children:(0,t.jsx)("span",{className:"text-sm font-medium text-center block overflow-hidden text-ellipsis whitespace-normal",style:{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"},children:e.name})})]})},e.id))}),3===W&&(0,t.jsxs)("div",{className:"grid gap-2",children:[(0,t.jsx)(d.J,{htmlFor:"plate",children:"Plaka"}),(0,t.jsx)(n.p,{id:"plate",placeholder:"34ABC123",value:B,onChange:e=>H(e.target.value)})]})]}),(0,t.jsxs)(k.Es,{className:"gap-2",children:[W>1&&(0,t.jsx)(l.$,{variant:"outline",onClick:()=>G(W-1),children:"Geri"}),3===W&&(0,t.jsx)(l.$,{onClick:Y,disabled:!B.trim(),children:"Ekle"})]})]})})]})}},3898:(e,a,s)=>{"use strict";s.d(a,{BK:()=>d,eu:()=>n,q5:()=>o});var t=s(5155),r=s(2115),i=s(4920),l=s(9602);let n=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i.bL,{ref:a,className:(0,l.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",s),...r})});n.displayName=i.bL.displayName;let d=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i._V,{ref:a,className:(0,l.cn)("aspect-square h-full w-full",s),...r})});d.displayName=i._V.displayName;let o=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i.H4,{ref:a,className:(0,l.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted",s),...r})});o.displayName=i.H4.displayName},4085:(e,a,s)=>{"use strict";s.d(a,{$:()=>o});var t=s(5155),r=s(2115),i=s(2317),l=s(652),n=s(9602);let d=(0,l.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),o=r.forwardRef((e,a)=>{let{className:s,variant:r,size:l,asChild:o=!1,...c}=e,m=o?i.DX:"button";return(0,t.jsx)(m,{className:(0,n.cn)(d({variant:r,size:l,className:s})),ref:a,...c})});o.displayName="Button"},5007:(e,a,s)=>{"use strict";s.d(a,{Wu:()=>o,ZB:()=>d,Zp:()=>l,aR:()=>n});var t=s(5155),r=s(2115),i=s(9602);let l=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)("div",{ref:a,className:(0,i.cn)("rounded-xl border bg-card text-card-foreground shadow",s),...r})});l.displayName="Card";let n=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)("div",{ref:a,className:(0,i.cn)("flex flex-col space-y-1.5 p-6",s),...r})});n.displayName="CardHeader";let d=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)("div",{ref:a,className:(0,i.cn)("font-semibold leading-none tracking-tight",s),...r})});d.displayName="CardTitle",r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)("div",{ref:a,className:(0,i.cn)("text-sm text-muted-foreground",s),...r})}).displayName="CardDescription";let o=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)("div",{ref:a,className:(0,i.cn)("p-6 pt-0",s),...r})});o.displayName="CardContent",r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)("div",{ref:a,className:(0,i.cn)("flex items-center p-6 pt-0",s),...r})}).displayName="CardFooter"},7837:(e,a,s)=>{"use strict";s.d(a,{Cf:()=>u,Es:()=>h,L3:()=>f,c7:()=>x,lG:()=>d,rr:()=>p,zM:()=>o});var t=s(5155),r=s(2115),i=s(7782),l=s(767),n=s(9602);let d=i.bL,o=i.l9,c=i.ZL;i.bm;let m=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i.hJ,{ref:a,className:(0,n.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",s),...r})});m.displayName=i.hJ.displayName;let u=r.forwardRef((e,a)=>{let{className:s,children:r,...d}=e;return(0,t.jsxs)(c,{children:[(0,t.jsx)(m,{}),(0,t.jsxs)(i.UC,{ref:a,className:(0,n.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",s),...d,children:[r,(0,t.jsxs)(i.bm,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,t.jsx)(l.A,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});u.displayName=i.UC.displayName;let x=e=>{let{className:a,...s}=e;return(0,t.jsx)("div",{className:(0,n.cn)("flex flex-col space-y-1.5 text-center sm:text-left",a),...s})};x.displayName="DialogHeader";let h=e=>{let{className:a,...s}=e;return(0,t.jsx)("div",{className:(0,n.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",a),...s})};h.displayName="DialogFooter";let f=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i.hE,{ref:a,className:(0,n.cn)("text-lg font-semibold leading-none tracking-tight",s),...r})});f.displayName=i.hE.displayName;let p=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i.VY,{ref:a,className:(0,n.cn)("text-sm text-muted-foreground",s),...r})});p.displayName=i.VY.displayName},750:(e,a,s)=>{"use strict";s.d(a,{SQ:()=>u,_2:()=>x,rI:()=>c,ty:()=>m});var t=s(5155),r=s(2115),i=s(9653),l=s(6967),n=s(8867),d=s(3565),o=s(9602);let c=i.bL,m=i.l9;i.YJ,i.ZL,i.Pb,i.z6,r.forwardRef((e,a)=>{let{className:s,inset:r,children:n,...d}=e;return(0,t.jsxs)(i.ZP,{ref:a,className:(0,o.cn)("flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",r&&"pl-8",s),...d,children:[n,(0,t.jsx)(l.A,{className:"ml-auto"})]})}).displayName=i.ZP.displayName,r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i.G5,{ref:a,className:(0,o.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",s),...r})}).displayName=i.G5.displayName;let u=r.forwardRef((e,a)=>{let{className:s,sideOffset:r=4,...l}=e;return(0,t.jsx)(i.ZL,{children:(0,t.jsx)(i.UC,{ref:a,sideOffset:r,className:(0,o.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md","data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",s),...l})})});u.displayName=i.UC.displayName;let x=r.forwardRef((e,a)=>{let{className:s,inset:r,...l}=e;return(0,t.jsx)(i.q7,{ref:a,className:(0,o.cn)("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",r&&"pl-8",s),...l})});x.displayName=i.q7.displayName,r.forwardRef((e,a)=>{let{className:s,children:r,checked:l,...d}=e;return(0,t.jsxs)(i.H_,{ref:a,className:(0,o.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",s),checked:l,...d,children:[(0,t.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,t.jsx)(i.VF,{children:(0,t.jsx)(n.A,{className:"h-4 w-4"})})}),r]})}).displayName=i.H_.displayName,r.forwardRef((e,a)=>{let{className:s,children:r,...l}=e;return(0,t.jsxs)(i.hN,{ref:a,className:(0,o.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",s),...l,children:[(0,t.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,t.jsx)(i.VF,{children:(0,t.jsx)(d.A,{className:"h-2 w-2 fill-current"})})}),r]})}).displayName=i.hN.displayName,r.forwardRef((e,a)=>{let{className:s,inset:r,...l}=e;return(0,t.jsx)(i.JU,{ref:a,className:(0,o.cn)("px-2 py-1.5 text-sm font-semibold",r&&"pl-8",s),...l})}).displayName=i.JU.displayName,r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i.wv,{ref:a,className:(0,o.cn)("-mx-1 my-1 h-px bg-muted",s),...r})}).displayName=i.wv.displayName},2336:(e,a,s)=>{"use strict";s.d(a,{p:()=>l});var t=s(5155),r=s(2115),i=s(9602);let l=r.forwardRef((e,a)=>{let{className:s,type:r,...l}=e;return(0,t.jsx)("input",{type:r,className:(0,i.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",s),ref:a,...l})});l.displayName="Input"},5785:(e,a,s)=>{"use strict";s.d(a,{J:()=>o});var t=s(5155),r=s(2115),i=s(6195),l=s(652),n=s(9602);let d=(0,l.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),o=r.forwardRef((e,a)=>{let{className:s,...r}=e;return(0,t.jsx)(i.b,{ref:a,className:(0,n.cn)(d(),s),...r})});o.displayName=i.b.displayName},9602:(e,a,s)=>{"use strict";s.d(a,{cn:()=>i});var t=s(3463),r=s(9795);function i(){for(var e=arguments.length,a=Array(e),s=0;s<e;s++)a[s]=arguments[s];return(0,r.QP)((0,t.$)(a))}},4920:(e,a,s)=>{"use strict";s.d(a,{H4:()=>N,_V:()=>y,bL:()=>j});var t=s(2115),r=s(8166),i=s(1524),l=s(6611),n=s(3360),d=s(5155),o="Avatar",[c,m]=(0,r.A)(o),[u,x]=c(o),h=t.forwardRef((e,a)=>{let{__scopeAvatar:s,...r}=e,[i,l]=t.useState("idle");return(0,d.jsx)(u,{scope:s,imageLoadingStatus:i,onImageLoadingStatusChange:l,children:(0,d.jsx)(n.sG.span,{...r,ref:a})})});h.displayName=o;var f="AvatarImage",p=t.forwardRef((e,a)=>{let{__scopeAvatar:s,src:r,onLoadingStatusChange:o=()=>{},...c}=e,m=x(f,s),u=function(e,a){let[s,r]=t.useState("idle");return(0,l.N)(()=>{if(!e){r("error");return}let s=!0,t=new window.Image,i=e=>()=>{s&&r(e)};return r("loading"),t.onload=i("loaded"),t.onerror=i("error"),t.src=e,a&&(t.referrerPolicy=a),()=>{s=!1}},[e,a]),s}(r,c.referrerPolicy),h=(0,i.c)(e=>{o(e),m.onImageLoadingStatusChange(e)});return(0,l.N)(()=>{"idle"!==u&&h(u)},[u,h]),"loaded"===u?(0,d.jsx)(n.sG.img,{...c,ref:a,src:r}):null});p.displayName=f;var g="AvatarFallback",v=t.forwardRef((e,a)=>{let{__scopeAvatar:s,delayMs:r,...i}=e,l=x(g,s),[o,c]=t.useState(void 0===r);return t.useEffect(()=>{if(void 0!==r){let e=window.setTimeout(()=>c(!0),r);return()=>window.clearTimeout(e)}},[r]),o&&"loaded"!==l.imageLoadingStatus?(0,d.jsx)(n.sG.span,{...i,ref:a}):null});v.displayName=g;var j=h,y=p,N=v}},e=>{var a=a=>e(e.s=a);e.O(0,[582,377,556,702,441,517,358],()=>a(556)),_N_E=e.O()}]);