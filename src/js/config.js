(function(root){
  "use strict";
  const KEY="silverguard_api_base";
  const DEFAULT_API_BASE="https://silverguard-ai-agent.vercel.app";
  function apiBase(){
    const saved=(localStorage.getItem(KEY)||"").trim();
    return (saved || DEFAULT_API_BASE).replace(/\/$/,"");
  }
  function setApiBase(url){
    const v=(url||"").trim().replace(/\/$/,"");
    if(v) localStorage.setItem(KEY,v);
    else localStorage.removeItem(KEY);
  }
  function resetApiBase(){ localStorage.removeItem(KEY); }
  root.SilverGuardConfig={KEY,DEFAULT_API_BASE,apiBase,setApiBase,resetApiBase};
})(globalThis);