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

function beforeLoadRecord_setBin(type) {

    /*  On before load:
	 - EXPLAIN THE PURPOSE OF THIS FUNCTION
	 -
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
    //  LOCAL VARIABLES

    //  BEFORE LOAD CODE BODY

    try {
       // if (type == 'print')
        {
            var RecordType = nlapiGetRecordType();

            if (RecordType == 'salesorder') {
                var sublistObj = form.getSubList('item');
                sublistObj.addField('custpage_binnumber', 'Select', 'Preferred Bin', 'bin').setDisplayType('disabled');
                //sublistObj.addField('custpage_fullfilledqty', 'text', 'FulFilled').setDisplayType('disabled');

                try {
                    var location = nlapiGetFieldValue('location');

                    var Item_Array = new Array();

                    var SearchBin = 'F';

                    var i_LineCount = nlapiGetLineItemCount('item');

                    Item_Array.push(0);

                    for (var i = 1; i <= i_LineCount; i++) {

                        var ItemWithoutBin = nlapiGetLineItemValue('item', 'item', i);
                        nlapiLogExecution('DEBUG', 'Before Load Set Bin', 'ItemWithoutBin-->' + ItemWithoutBin);

                        Item_Array.push(ItemWithoutBin);

                        SearchBin = 'T';

                    }
                    if (location != null && location != '' && location != undefined && SearchBin == 'T') {
                        var binFilters = new Array();
                        var binColumns = new Array();

                        // binFilters.push(new nlobjSearchFilter('preferredbin', null, 'is', 'T'));
                        binFilters.push(new nlobjSearchFilter('internalid', null, 'anyOf', Item_Array));
                        binFilters.push(new nlobjSearchFilter('location', 'binnumber', 'is', location));
                        binFilters.push(new nlobjSearchFilter('quantityonhand', 'binonhand', 'greaterthan', 0));

                        binColumns.push(new nlobjSearchColumn('internalid', 'binnumber'));
                        binColumns.push(new nlobjSearchColumn('internalid'));
                        binColumns.push(new nlobjSearchColumn('quantityonhand', 'binonhand'));


                        var binResults = nlapiSearchRecord('item', null, binFilters, binColumns);

                        if (binResults != null && binResults != '' && binResults != undefined)
                        {
                            var k_LineCount = nlapiGetLineItemCount('item');
                            for (var k = 1; k <= k_LineCount; k++)
                            {
                                var PreferredBin = nlapiGetLineItemValue('item', 'custcol_preferred_bin', k);
                                var tranitem = nlapiGetLineItemValue('item', 'item', k);


                                for (j = 0; j < binResults.length; j++) {
                                    var Bin = binResults[j].getValue('internalid', 'binnumber');
                                    var BinItem = binResults[j].getValue('internalid');
                                    var BinonHand = binResults[j].getValue('quantityonhand', 'binonhand');
                                    nlapiLogExecution('DEBUG', 'Before Submit Set Bin', 'Bin-->' + Bin);
                                    if (BinItem == tranitem)
                                    {
                                        nlapiSetLineItemValue('item', 'custpage_binnumber', k, Bin);
                                        //nlapiSetLineItemValue('item', 'custpage_fullfilledqty', k, BinonHand);

                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                catch (ex) {
                    nlapiLogExecution('DEBUG', 'Before Submit Set Bin', 'Error-->' + ex);
                }
            }
        }
    }
    catch (ex) {
        nlapiLogExecution('DEBUG', 'Before Submit Set Bin', 'ex-->' + ex);
    }

    return true;
}


// END BEFORE LOAD ====================================================
