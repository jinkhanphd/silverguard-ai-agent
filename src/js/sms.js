(function(root){
  "use strict";
  async function sendIncident(event){
    const base=SilverGuardConfig.apiBase();
    if(!base) return {ok:false,message:"Backend URL 미설정"};
    try{
      const res=await fetch(base+"/api/send-sms",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          incidentId:event.id,
          time:event.time,
          name:event.data.name,
          level:event.level,
          score:event.score,
          reasons:event.reasons
        })
      });
      const data=await res.json().catch(()=>({}));
      if(!res.ok) return {ok:false,message:data.error||("HTTP "+res.status)};
      return {ok:true,message:"SENT",provider:data.provider||"SOLAPI"};
    }catch(err){
      return {ok:false,message:"Backend 연결 실패"};
    }
  }
  root.SilverGuardSms={sendIncident};
})(globalThis);