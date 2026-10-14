(function(){
  var saved=null; try{saved=localStorage.getItem("zqm-scare");}catch(e){}
  if(saved) document.body.dataset.scare=saved;
  function paint(){document.querySelectorAll("[data-scare-pick]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.scarePick===document.body.dataset.scare?"true":"false");});}
  document.querySelectorAll("[data-scare-pick]").forEach(function(b){b.addEventListener("click",function(){document.body.dataset.scare=b.dataset.scarePick;try{localStorage.setItem("zqm-scare",b.dataset.scarePick);}catch(e){}paint();});});
  paint();
})();
