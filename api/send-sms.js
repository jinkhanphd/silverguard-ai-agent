const { SolapiMessageService } = require("solapi");

function cors(req,res){
  const allowed=(process.env.ALLOWED_ORIGIN||"https://jinkhanphd.github.io").split(",").map(x=>x.trim());
  const origin=req.headers.origin||"";
  if(allowed.includes(origin)) res.setHeader("Access-Control-Allow-Origin",origin);
  res.setHeader("Vary","Origin");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");
}
module.exports=async function handler(req,res){
  cors(req,res);
  if(req.method==="OPTIONS") return res.status(204).end();
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

  const required=["SOLAPI_API_KEY","SOLAPI_API_SECRET","SOLAPI_FROM","GUARDIAN_NAME","GUARDIAN_PHONE"];
  const missing=required.filter(k=>!process.env[k]);
  if(missing.length) return res.status(503).json({error:"SMS server configuration incomplete"});

  const body=req.body||{};
  if(body.level!=="DANGER") return res.status(400).json({error:"Only DANGER incidents can send SMS"});

  const name=String(body.name||"대상자").slice(0,30);
  const score=Number(body.score||0);
  const reasons=Array.isArray(body.reasons)?body.reasons.slice(0,3).join(" / "):"위험상황";
  const guardian=process.env.GUARDIAN_NAME;
  const text="[SilverGuard 위기알림]\n"+guardian+" 보호자님, "+name+"에게 DANGER 위험상황이 감지되었습니다. 위험점수 "+score+"점. 주요원인: "+reasons+". 확인이 필요합니다.";

  try{
    const svc=new SolapiMessageService(process.env.SOLAPI_API_KEY,process.env.SOLAPI_API_SECRET);
    const result=await svc.send({to:process.env.GUARDIAN_PHONE.replace(/[^0-9]/g,""),from:process.env.SOLAPI_FROM.replace(/[^0-9]/g,""),text});
    return res.status(200).json({ok:true,provider:"SOLAPI",result});
  }catch(err){
    console.error("SOLAPI send failed",err);
    return res.status(502).json({error:"SMS provider send failed"});
  }
};