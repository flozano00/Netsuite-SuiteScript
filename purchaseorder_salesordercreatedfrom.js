/**
* Created: Frank Lozano 04/15/2019
* Put the sales order Amount on the Purchase Order and subtract both.
* Purchase Order 120979
* Sales Order amount : 284.68
*/

function beforeSubmit_purchaseorderLink(){
nlapiLogExecution('Debug','Entry','Entry');
try{
//Find it on the purchase order. Saved Search
var purchaseorderSearch = nlapiSearchRecord("purchaseorder",null,
[
   ["type","anyof","PurchOrd"],
   "AND",
   ["mainline","is","F"],
   "AND",
   ["status","anyof","PurchOrd:G","PurchOrd:H","PurchOrd:F","PurchOrd:D","PurchOrd:B","PurchOrd:A","PurchOrd:P","PurchOrd:C"]
],
[
   new nlobjSearchColumn("internalid"),
   new nlobjSearchColumn("createdfrom")
]
);

var salesOrderid = purchaseorderSearch[0].getValue('createdfrom');
nlapiLogExecution('debug','Sales Order ID',salesOrderid);
var salesOrderObj = nlapiLoadRecord('salesorder',salesOrderid);
nlapiLogExecution('debug',"Sales Order Object: ",JSON.stringify(salesOrderObj));
var salesOrderAmount = salesOrderObj.getFieldValue('total');

//Create a field to show the difference between the sales order and the purchase amount.
if (salesOrderAmount != undefined || salesOrderAmount != null){
  var salesOrderAmount = salesOrderObj.getFieldValue('total');
  nlapiLogExecution('Debug','Sales Order Amount',salesOrderAmount);
//Create a New Field.
}

}
catch(e){
nlapiLogExecution('debug', 'Exeception', e);
}
}
