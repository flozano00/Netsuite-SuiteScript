//Created by Frank Lozano
function billpay_afterSubmit(type)
{

    var recordId = nlapiGetRecordId();
    nlapiLogExecution('DEBUG',"Record ID " + recordId);
    var recordType = nlapiGetRecordType();
    nlapiLogExecution('DEBUG','Record Type ' + recordType);
    var recordObj = nlapiLoadRecord(recordType, recordId);
    var checknum = recordObj.getFieldValue('tranid');



    var vendorpaymentSearch = nlapiSearchRecord("vendorpayment",null,
[
   ["type","anyof","VendPymt"],
   "AND",
   ["mainline","is","F"],
   "AND",
   ["internalid","anyof",recordId]
],
[
   new nlobjSearchColumn("tranid"),
   new nlobjSearchColumn("trandate").setSort(false),
   new nlobjSearchColumn("paidtransaction"),
   new nlobjSearchColumn("createdfrom","paidTransaction",null),
   new nlobjSearchColumn("internalid")
]
);

var billid = vendorpaymentSearch[0].getValue("paidtransaction");
    nlapiLogExecution('DEBUG','aftersubmit()','billid ='+billid);
var billId2 = vendorpaymentSearch[1].getValue("paidtransaction")
    nlapiLogExecution('DEBUG','bill ID 2: ', billId2);
    // nlapiLogExecution('DEBUG','MedicAlert_SCH_RemoveItem_SO','itemID ='+itemID);
    var poId   = vendorpaymentSearch[0].getValue("createdfrom","paidTransaction",null);
    nlapiLogExecution('DEBUG','aftersubmit()','poId ='+poId);


   var poObj = nlapiLoadRecord('purchaseorder',poId);
               poObj.setFieldValue('custbodycheck_number',checknum);

  var id = nlapiSubmitRecord(poObj);

//Put the Saved Search here ?
 nlapiLogExecution('debug','Purchase Order Object', id);



  var invoiceObj = nlapiLoadRecord('vendorbill', billid);
  nlapiLogExecution('Debug','AfterSubmit()', invoiceObj);
   invoiceObj.setFieldValue('memo',checknum);
  nlapiSubmitRecord(invoiceObj);


  }



//I need 45 from the invoice.
