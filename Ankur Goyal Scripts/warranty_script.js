// BEGIN SCRIPT DESCRIPTION BLOCK  ==================================
{
/*
   	Script Name:
	Author:
	Company:
	Date:
	Description:


	Script Modification Log:

	-- Date --			-- Modified By --				--Requested By--				-- Description --



Below is a summary of the process controls enforced by this script file.  The control logic is described
more fully, below, in the appropriate function headers and code blocks.


     BEFORE LOAD
		- beforeLoadRecord(type)



     BEFORE SUBMIT
		- beforeSubmitRecord(type)


     AFTER SUBMIT
		- afterSubmitRecord(type)



     SUB-FUNCTIONS
		- The following sub-functions are called by the above core functions in order to maintain code
            modularization:

               - NOT USED

*/
}
// END SCRIPT DESCRIPTION BLOCK  ====================================



// BEGIN GLOBAL VARIABLE BLOCK  =====================================
{
	//  Initialize any Global Variables, in particular, debugging variables...




}
// END GLOBAL VARIABLE BLOCK  =======================================





// BEGIN BEFORE LOAD ==================================================

function beforeLoadRecord_setWarrantyField(type, form){
	/*  On before load:
	 - EXPLAIN THE PURPOSE OF THIS FUNCTION
	 -
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
	//  LOCAL VARIABLES

	//  BEFORE LOAD CODE BODY
	try {

		if (type == 'create' || type == 'copy') {
			//var CreatedFrom = nlapiGetFieldValue('createdfrom');
			//nlapiLogExecution('DEBUG', 'UES Create Invoice', 'createdfrom -->' + CreatedFrom);
			//if (CreatedFrom == '15618600')
			{
				//nlapiLogExecution('DEBUG', 'UES Create Invoice', 'CreatedFrom -->' + CreatedFrom);
				//nlapiSetFieldValue('custbodywarranty', '');
				//nlapiSetFieldValue('custbody_warrantyexpirationdate', '');
				//nlapiSetFieldValue('customform', '');

				var LineCount = nlapiGetLineItemCount('item')
				nlapiLogExecution('DEBUG', 'UES Create Invoice', 'LineCount -->' + LineCount);
				for (var i = 1; i <= LineCount; i++) {
					nlapiSelectLineItem('item', i)


					nlapiSetCurrentLineItemValue('item', 'custcol_wrm_reg_warrantyexpire', '');
					nlapiSetCurrentLineItemValue('item', 'custcol_wrm_reg_warrantyterms', '');
					nlapiSetCurrentLineItemValue('item', 'custcol_wrm_reg_warrantyreg', '');
					nlapiSetCurrentLineItemValue('item', 'custcol_wrm_reg_hid_terms', '');
					nlapiSetCurrentLineItemValue('item', 'custcol_wrm_claimitem', '');
					nlapiSetCurrentLineItemValue('item', 'custcol_wrm_reg_hid_registerflag', '');
					nlapiCommitLineItem('item');

				}

			}
		}
	}
	catch (Execption) {
		nlapiLogExecution('DEBUG', 'SCH Create Invoice', ' Execption -->' + Execption);
	}
	return true;
}

// END BEFORE LOAD ====================================================





// BEGIN BEFORE SUBMIT ================================================

function beforeSubmitRecord(type){
	/*  On before submit
	 - PURPOSE
	 -
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
	//  LOCAL VARIABLES


	//  BEFORE SUBMIT CODE BODY

	return true;
}

// END BEFORE SUBMIT ==================================================





// BEGIN AFTER SUBMIT =============================================

function afterSubmitRecord_CreateWarrantyInv(type){
	/*  On after submit:
	 - PURPOSE
	 -
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
	//  LOCAL VARIABLES


	//  AFTER SUBMIT CODE BODY

	//try {
	//	if (type == 'create' || type == 'edit') {
	//		var i_recordId = nlapiGetRecordId();
	//		var s_recordtype = nlapiGetRecordType();

	//		var o_recordObj = nlapiLoadRecord(s_recordtype, i_recordId);

	//		var o_INVObj = nlapiTransformRecord(s_recordtype, i_recordId, 'invoice');
	//		//o_paymentObj.setFieldValue('customform', 70);
	//		//o_paymentObj.setFieldValue('trandate', TranDate);
	//		//o_paymentObj.setFieldValue('account', 163);
	//		//o_paymentObj.setFieldValue('paymentmethod', 12);
	//		//o_paymentObj.setFieldValue('custbody_auto_create_trans', 'T');
	//		var InvoiceId = nlapiSubmitRecord(o_INVObj);
	//		nlapiLogExecution('DEBUG', 'UES Create Warrenty Invoice', 'InvoiceId -->' + InvoiceId);

	//	}
	//}
	//catch (ex) {
	//	nlapiLogExecution('DEBUG', 'Remove Spam Leads', 'ex -->' + ex);
	//}
	return true;
}
// END AFTER SUBMIT ===============================================







// END FUNCTION =====================================================
