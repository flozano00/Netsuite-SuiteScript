// BEGIN SCRIPT DESCRIPTION BLOCK  ==================================
{
/*
   	Script Name: Create Open Invoice Payment


     SUB-FUNCTIONS
		- The following sub-functions are called by the above core functions in order to maintain code
            modularization:


*/
}



// BEGIN SCHEDULED FUNCTION =============================================

function schedulerFunction_CreateInvoicePay(type){
	/*  On scheduled function:
	 - PURPOSE
	 -
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
	//==== CODE FOR DESGNING POP UP XL ======
	try {
 //What is nlapiGetContext use for ?
		var i_context = nlapiGetContext();
//Why are you adding more filters to a saved search already filtered?

		var inv_filters = new Array();
		//inv_filters.push(new nlobjSearchFilter('internalid', null, 'anyOf', 1536774));
		//Here he can add a filter to the saved search allowing for internal ID.
		//Open Invoice *** Do Not Edit
		var invoice_search = nlapiLoadSearch('transaction', 'customsearch_create_open_invpayment');
		//What is the criteria for the saved search ?
		//Main line is true
		//Date is within 8/1/2013 and 5/1/2018
		//Status is Invoice:Open
		//Name is any of 6195096 ATHQ(Amazon) FBA, 6191676 ATHQ (NO LONGER USED)
		//Type is Invoice

		if (invoice_search != null && invoice_search != '' && invoice_search != undefined) {
		//Invoice_search add the other filter to reduce the number of rows.
			invoice_search.addFilters(inv_filters);
   //Why are we running a search ? what is .runsearch(); for?
			var resultset = invoice_search.runSearch();
	//What is the use of searchid for ?
			var searchid = 0;
	//What is the variable j for ?
			var j = 0;

			do {
	//I'm not sure about this search why is the second parameter at 1000?
				var mapping_search = resultset.getResults(searchid, searchid + 1000);

				if (mapping_search != null && mapping_search != '' && mapping_search != undefined) {
	//This part im confused in why var rs in mapping_search for ?
					for (var rs in mapping_search) {
						var result = mapping_search[rs];
						var columns = result.getAllColumns();
						var columnLen = columns.length;

						var internalid = '';
						var TranDate = '';

						for (var i = 0; i < columnLen; i++) {
							var column = columns[i];
							var LabelName = column.getLabel();
							var fieldName = column.getName();
							var value = result.getValue(column);
							//var text = result.getText(column);

							if (fieldName == 'internalid') {
								internalid = value
							}
							if (fieldName == 'trandate') {
								TranDate = value;
							}
						}
						try {
							nlapiLogExecution('DEBUG', 'SCH Create Invoice Payment', 'internalid -->' + internalid);
							var o_paymentObj = nlapiTransformRecord('invoice', internalid, 'customerpayment');
							o_paymentObj.setFieldValue('customform', 70);
							o_paymentObj.setFieldValue('trandate', TranDate);
							o_paymentObj.setFieldValue('account', 921);
							o_paymentObj.setFieldValue('paymentmethod', 12);
							o_paymentObj.setFieldValue('custbody_auto_create_trans', 'T');
							var PaymentId = nlapiSubmitRecord(o_paymentObj,true,false);
							nlapiLogExecution('DEBUG', 'SCH Create Invoice Payment', 'PaymentId -->' + PaymentId);
						}
						catch (ex) {
							nlapiLogExecution('DEBUG', 'SCH Create Invoice Payment', 'Inner Execption -->' + ex);
						}

						var i_usage_end = i_context.getRemainingUsage();
						//nlapiLogExecution('DEBUG', 'scheduler_CopyItems', ' *********** Usage end **********-->' + i_usage_end);

						if (i_usage_end <= 500) {
							var stateMain = nlapiYieldScript();

							if (stateMain.status == 'RESUME') {
								nlapiLogExecution('DEBUG', 'Resum Scripts', ' *********** Resume an scripts **********-->');
							}
						}
						searchid++;

					}
				}
			}
			while (mapping_search.length >= 1000);
		}
	}
	catch (Execption) {
		nlapiLogExecution('DEBUG', 'SCH Create Invoice Payment', ' Execption -->' + Execption);
	}
}

// END SCHEDULED FUNCTION ===============================================
