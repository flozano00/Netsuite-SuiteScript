function beforeLoad_payment(){
  try{
nlapiLogExecution('Debug','Before Submit Payment','Entry');
var undepositfunds = nlapigetFieldValue('undepfunds');
nlapiLogExecution('Debug','Account: ', undepositfunds);

  }
  catch(e){
    nlapiLogExecution('debug','Exception:',e);
  }
}
