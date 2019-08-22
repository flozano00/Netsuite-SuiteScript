




// BEGIN AFTER SUBMIT =============================================

function afterSubmitRecord_SetPOPaymentAmt(type){


	try {
	// Only run the function when the type is either 'create' or 'edit'
		if (type == 'create' || type == 'edit') {
			var i_recordId = nlapiGetRecordId();
			var s_recordtype = nlapiGetRecordType();
			//var o_recordObj = nlapiLoadRecord(s_recordtype, i_recordId);

  // If the record type is vendorpayment then run this function.
			if (s_recordtype == 'vendorpayment') {
//Here we created a Purchase Order Array. Pushing in the PO Internal Id. Here we are pushing the PO internal ID.
				var POArray = new Array();
//Now we are creating a filter and a column for the saved search. Here we did 2 variables filter and column.
				var filter = new Array();
				var column = new Array();
/**Here we are pushing within the array the record ID number which is just the filter of it. Thererefore.
   filter = 12345
*/

				filter.push(new nlobjSearchFilter('internalid', null, 'anyOf', i_recordId));
/**
  On the columns we are showing the results. Therefore our results are:
	Internal ID:
	Created From:
	Paid Amount:
*/
				column[0] = new nlobjSearchColumn('internalid', null, 'group');
				column[1] = new nlobjSearchColumn('createdfrom', 'paidtransaction', 'group');
				column[2] = new nlobjSearchColumn('paidamount', null, 'sum');
/**
Here we are loading a saved search that will allow us to see the results.
*/
				var SE_BillPaymentResult = nlapiSearchRecord('transaction', 'customsearch_billpayment_withpobill', filter, column);
//Only run the saved search when it's not null nor blank nor undefined.
				if (SE_BillPaymentResult != null && SE_BillPaymentResult != '' && SE_BillPaymentResult != undefined)
				{
				    for (var i = 0; i < SE_BillPaymentResult.length; i++)
				    {
						var InternalId = SE_BillPaymentResult[i].getValue('internalid', null, 'group');
						nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'InternalId -->' + InternalId);

						var POID = SE_BillPaymentResult[i].getValue('createdfrom', 'paidtransaction', 'group');
						nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'POID -->' + POID);

						POArray.push(POID);

						PO_Payment_and_billCredit_Amount(POID);
					}
					var UpdatedPaymentID = nlapiSubmitField(s_recordtype, i_recordId, 'custbody_po_payment_link', POArray);
					nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'UpdatedPaymentID -->' + UpdatedPaymentID);
				}
			}//Vendor Prepayment

			if (s_recordtype == 'vendorcredit') {
				var POID = nlapiLookupField(s_recordtype, i_recordId, 'custbody_billcredit_linked_po'); //Where is the field at ?
				if (POID != null && POID != '' && POID != undefined) {
					PO_Payment_and_billCredit_Amount(POID);
				}
			}
		}
	}
	catch (ex) {
		nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'ex -->' + ex);

	}
	return true;
}
// END AFTER SUBMIT ===============================================





// BEGIN FUNCTION ===================================================
function PO_Payment_and_billCredit_Amount(POID) {
    try {
        var Paytext = '';
        var PaidAmount = 0;
        var BillCreditAmount = 0;
        var UpdatePO = false;

        var POfilter = new Array();
        var POcolumn = new Array();

        POfilter.push(new nlobjSearchFilter('createdfrom', 'paidtransaction', 'anyOf', POID));

        POcolumn[0] = new nlobjSearchColumn('createdfrom', 'paidtransaction', 'group');
        POcolumn[1] = new nlobjSearchColumn('internalid', null, 'group');
        POcolumn[2] = new nlobjSearchColumn('trandate', null, 'group');
        POcolumn[3] = new nlobjSearchColumn('tranid', null, 'group');
        POcolumn[4] = new nlobjSearchColumn('paidamount', null, 'sum');
        POcolumn[5] = new nlobjSearchColumn('tranid', 'paidtransaction', 'group');

        var PO_BillPaymentResult = nlapiSearchRecord('transaction', 'customsearch_billpayment_withpobill', POfilter, POcolumn);

        if (PO_BillPaymentResult != null && PO_BillPaymentResult != '' && PO_BillPaymentResult != undefined)
        {
            for (var j = 0; j < PO_BillPaymentResult.length; j++)
            {
                var PaymentInternalId = PO_BillPaymentResult[j].getValue('internalid', null, 'group');
                nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'PaymentInternalId -->' + PaymentInternalId);

                var CheckNumber = PO_BillPaymentResult[j].getValue('tranid', null, 'group');
                //nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'CheckNumber -->' + CheckNumber);

                var TransactionDate = PO_BillPaymentResult[j].getValue('trandate', null, 'group');
               // nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'TransactionDate -->' + TransactionDate);

                var FinalPOID = PO_BillPaymentResult[j].getValue('createdfrom', 'paidtransaction', 'group');
               // nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'FinalPOID -->' + FinalPOID);

                var BillNo = PO_BillPaymentResult[j].getValue('tranid', 'paidtransaction', 'group');
                //nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'BillNo -->' + BillNo);

                PaidAmount = PO_BillPaymentResult[j].getValue('paidamount', null, 'sum');
               // nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'PaidAmount -->' + PaidAmount);

                var PaymentText = 'Paid with check ' + CheckNumber + '\n' + 'inv. ' + BillNo + '\n' + PaidAmount + '\n' + TransactionDate;

                Paytext = Paytext + '\n' + PaymentText;

            }
            UpdatePO = true;

        }

        var BillCredit_filter = new Array();
        var BillCredit_Column = new Array();

        BillCredit_filter.push(new nlobjSearchFilter('custbody_billcredit_linked_po', null, 'anyOf', POID));
        BillCredit_filter.push(new nlobjSearchFilter('mainline', null, 'is', 'T'));

        BillCredit_Column[0] = new nlobjSearchColumn('amount');
        BillCredit_Column[1] = new nlobjSearchColumn('internalid');
        BillCredit_Column[2] = new nlobjSearchColumn('memo');
        BillCredit_Column[3] = new nlobjSearchColumn('tranid');
        BillCredit_Column[4] = new nlobjSearchColumn('trandate');

        var PO_BillCreditResult = nlapiSearchRecord('vendorcredit', null, BillCredit_filter, BillCredit_Column);

        if (PO_BillCreditResult != null && PO_BillCreditResult != '' && PO_BillCreditResult != undefined) {
            for (var k = 0; k < PO_BillCreditResult.length; k++) {
                var BillCreditId = PO_BillCreditResult[k].getValue('internalid');
                nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'BillCreditId -->' + BillCreditId);

                var TranID = PO_BillCreditResult[k].getValue('tranid');
                //nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'TranID -->' + TranID);

                var trandate = PO_BillCreditResult[k].getValue('trandate');
                //nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'trandate -->' + trandate);

                var memo = PO_BillCreditResult[k].getValue('memo');
               // nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'memo -->' + memo);

                BillCreditAmount = PO_BillCreditResult[k].getValue('amount');
               // nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'BillCreditAmount -->' + BillCreditAmount);

                BillCreditAmount = (parseFloat(BillCreditAmount) * parseFloat((-1)))

                var PaymentText = 'Received ' + TranID + '-' + memo + '-' + BillCreditAmount + '-' + trandate;

                Paytext = Paytext + '\n' + PaymentText;
            }
            UpdatePO = true;
        }

        if (UpdatePO == true) {
            var UpdatedPOID = nlapiSubmitField('purchaseorder', POID, 'custbodycheck_number', Paytext);
            nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'UpdatedPOID -->' + UpdatedPOID);

        }
    }
    catch (ex) {
        nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'Inner ex -->' + ex);

    }
}


// END FUNCTION =====================================================
