(function(root){
  "use strict";
  const KEY="silverguard_api_base";
  function apiBase(){ return (localStorage.getItem(KEY)||"").replace(/\/$/,""); }
  function setApiBase(url){ localStorage.setItem(KEY,(url||"").trim().replace(/\/$/,"")); }
  root.SilverGuardConfig={KEY,apiBase,setApiBase};
})(globalThis);