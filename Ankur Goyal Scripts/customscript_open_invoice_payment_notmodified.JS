// BEGIN SCRIPT DESCRIPTION BLOCK  ==================================
{
/*
   	Script Name:


	Script Modification Log:

	-- Date --			-- Modified By --				--Requested By--				-- Description --




Below is a summary of the process controls enforced by this script file.  The control logic is described
more fully, below, in the appropriate function headers and code blocks.


     SCHEDULED FUNCTION
		- scheduledFunction(type)


     SUB-FUNCTIONS
		- The following sub-functions are called by the above core functions in order to maintain code
            modularization:

               - NOT USED

*/
}
// END SCRIPT DESCRIPTION BLOCK  ====================================


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
		var i_context = nlapiGetContext();

		var inv_filters = new Array();
		//inv_filters.push(new nlobjSearchFilter('internalid', null, 'anyOf', 1536774));

		var invoice_search = nlapiLoadSearch('transaction', 'customsearch_create_open_invpayment');

		if (invoice_search != null && invoice_search != '' && invoice_search != undefined) {
			invoice_search.addFilters(inv_filters);

			var resultset = invoice_search.runSearch();
			var searchid = 0;
			var j = 0;

			do {
				var mapping_search = resultset.getResults(searchid, searchid + 1000);

				if (mapping_search != null && mapping_search != '' && mapping_search != undefined) {
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
