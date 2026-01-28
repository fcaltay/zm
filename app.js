const dhikrs = [
  {id:1,name:"Serbest Sayaç",free:true,today:0,total:0,desc:"Hedefsiz sayaç"},
  {id:2,name:"Ya Latif (c.c.)",target:100,today:0,total:0,desc:"Rızık ve ferahlık için"},
  {id:3,name:"Ya Şafi (c.c.)",target:100,today:0,total:0,desc:"Şifa için"},
  {id:4,name:"Salât-ı Tefriciye",target:11,today:0,total:0,desc:"Sıkıntıların açılması için"}
];

const freeSlot=document.getElementById("freeSlot");
const dhikrList=document.getElementById("dhikrList");
const menuView=document.getElementById("menuView");
const counterView=document.getElementById("counterView");

const countEl=document.getElementById("count");
const ring=document.getElementById("ringTap");
const backBtn=document.getElementById("backBtn");

let active=null;

function render(){
  freeSlot.innerHTML="";
  dhikrList.innerHTML="";

  dhikrs.forEach(d=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <div class="title">${d.name}</div>
      <div class="meta">Bugün: ${d.today} ${d.target?"/ "+d.target:""}</div>
      <div class="descPreview">${d.desc}</div>
    `;
    card.onclick=()=>{
      active=d;
      openCounter();
    };

    if(d.free) freeSlot.appendChild(card);
    else dhikrList.appendChild(card);
  });
}

function openCounter(){
  menuView.classList.add("hidden");
  counterView.classList.remove("hidden");
  countEl.textContent=active.today;
}

ring.onclick=()=>{
  if(!active)return;
  active.today++;
  active.total++;
  countEl.textContent=active.today;
};

backBtn.onclick=()=>{
  menuView.classList.remove("hidden");
  counterView.classList.add("hidden");
};

render();
