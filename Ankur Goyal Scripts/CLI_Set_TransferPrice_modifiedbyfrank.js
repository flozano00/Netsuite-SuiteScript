// BEGIN SCRIPT DESCRIPTION BLOCK  ==================================
{
/*
Frank Lozano Modify the if Part on Netsuite so they are allowed to modify the script.

	Script Modification Log:

	-- Date --			-- Modified By --				--Requested By--				-- Description --




	Below is a summary of the process controls enforced by this script file.  The control logic is described
	more fully, below, in the appropriate function headers and code blocks.

     PAGE INIT
		- pageInit(type)


     SAVE RECORD
		- saveRecord()


     VALIDATE FIELD
		- validateField(type, name, linenum)


     FIELD CHANGED
		- fieldChanged(type, name, linenum)


     POST SOURCING
		- postSourcing(type, name)


	LINE INIT
		- lineInit(type)


     VALIDATE LINE
		- validateLine()


     RECALC
		- reCalc()


     SUB-FUNCTIONS
		- The following sub-functions are called by the above core functions in order to maintain code
            modularization:





*/
}
// END SCRIPT DESCRIPTION BLOCK  ====================================



// BEGIN SCRIPT UPDATION BLOCK  ====================================
/*


*/
// END SCRIPT UPDATION BLOCK  ====================================




// BEGIN GLOBAL VARIABLE BLOCK  =====================================
{

	//  Initialize any Global Variables, in particular, debugging variables...


}
// END GLOBAL VARIABLE BLOCK  =======================================





// BEGIN PAGE INIT ==================================================

function pageInit_TransferType(type)
{
    /*  On page init:

	- PURPOSE

		FIELDS USED:

		--Field Name--				--ID--			--Line Item Name--

    */

    //  LOCAL VARIABLES


    //  PAGE INIT CODE BODY
    RecType = type;
	nlapiDisableLineItemField('item','rate',true);
	nlapiDisableLineItemField('item','amount',true);

}

// END PAGE INIT ====================================================





// BEGIN SAVE RECORD ================================================

function saveRecord()
{
    /*  On save record:

	- PURPOSE



	  FIELDS USED:

		--Field Name--			--ID--		--Line Item Name--


    */


    //  LOCAL VARIABLES



    //  SAVE RECORD CODE BODY


	return true;

}

// END SAVE RECORD ==================================================





// BEGIN VALIDATE FIELD =============================================

function validateField(type, name, linenum)
{

	/*  On validate field:

          - EXPLAIN THE PURPOSE OF THIS FUNCTION


          FIELDS USED:

          --Field Name--				--ID--


    */


	//  LOCAL VARIABLES



	//  VALIDATE FIELD CODE BODY


	return true;

}

// END VALIDATE FIELD ===============================================





// BEGIN FIELD CHANGED ==============================================

function fieldChanged_OverwriteTransferPrice(type, name, linenum){
	/*  On field changed:
	 - PURPOSE
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
	//  LOCAL VARIABLES


	//  FIELD CHANGED CODE BODY

	if (type == 'item' && name == 'custcol_overwrite_transfer_price') {
			var Status = nlapiGetFieldValue('orderstatus');
		if (Status == 'A' || Status == 'B') {
			var Overwrite = nlapiGetCurrentLineItemValue('item', 'custcol_overwrite_transfer_price');

			if (Overwrite == 'T') {
				nlapiDisableLineItemField('item', 'rate', false);
				nlapiDisableLineItemField('item','amount',false);
			}
			else {
				nlapiDisableLineItemField('item', 'rate', true);
				nlapiDisableLineItemField('item','amount',true);
			}
		}
	}
}

// END FIELD CHANGED ================================================





// BEGIN POST SOURCING ==============================================

function postSourcing_setTransferPrice(type, name) {

    /*  On post sourcing:
	 - PURPOSE
	 FIELDS USED:
	 --Field Name--			--ID--		--Line Item Name--
	 */
    //  LOCAL VARIABLES


    //  POST SOURCING CODE BODY

   /*
 if (type == 'item' && name == 'item')
    {
        if (RecType == 'create' || RecType == 'copy') {
            var item = nlapiGetCurrentLineItemValue('item', 'item');

            var location = nlapiGetFieldValue('location');

            if (location != null && location != '' && location != undefined) {
                if (item != null && item != '' && item != undefined) {
                    var OverWritePrice = nlapiGetCurrentLineItemValue('item', 'custcol_overwrite_transfer_price');

                    if (OverWritePrice != 'T') {


                        var UseItemCost = nlapiGetFieldValue('useitemcostastransfercost');


                        if (UseItemCost != 'T') {
                            var filter = new Array();
                            var column = new Array();

                            filter.push(new nlobjSearchFilter('inventorylocation', null, 'anyOf', location));
                            filter.push(new nlobjSearchFilter('internalid', null, 'anyOf', item));

                            column[0] = new nlobjSearchColumn('internalid');
                            column[1] = new nlobjSearchColumn('locationaveragecost');

                            var Se_LocationPriceResult = nlapiSearchRecord('item', null, filter, column);

                            if (Se_LocationPriceResult != null && Se_LocationPriceResult != '' && Se_LocationPriceResult != undefined) {
                                var LocationAverageCost = Se_LocationPriceResult[0].getValue('locationaveragecost');
//                              alert('LocationAverageCost' + LocationAverageCost);
                                if (LocationAverageCost != null && LocationAverageCost != '' && LocationAverageCost != undefined) {
                                    nlapiSetCurrentLineItemValue('item', 'rate', LocationAverageCost, true, true);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
*/
}

// END POST SOURCING ================================================



// BEGIN LINE INIT ==============================================

function lineInit_setDisabled(type){

	/*  On Line Init:
	 - PURPOSE
	 FIELDS USED:
	 --Field Name--			--ID--		--Line Item Name--
	 */
	//  LOCAL VARIABLES


	//  LINE INIT CODE BODY

	nlapiDisableLineItemField('item', 'rate', true);
	nlapiDisableLineItemField('item','amount',true);

	var Status = nlapiGetFieldValue('orderstatus');
	if (Status == 'A' || Status == 'B') {
		var Overwrite = nlapiGetCurrentLineItemValue('item', 'custcol_overwrite_transfer_price');

		if (Overwrite == 'T') {
			nlapiDisableLineItemField('item', 'rate', false);
			nlapiDisableLineItemField('item','amount',false);
		}
		else {
			nlapiDisableLineItemField('item', 'rate', true);
			nlapiDisableLineItemField('item','amount',true);
		}
	}

}

// END LINE INIT ================================================


// BEGIN VALIDATE LINE ==============================================

function validateLine_setTransferPrice(type){

	/*  On validate line:
	 - EXPLAIN THE PURPOSE OF THIS FUNCTION
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
	//  LOCAL VARIABLES


	//  VALIDATE LINE CODE BODY

	if (type == 'item') {
		var Status = nlapiGetFieldValue('orderstatus');

		if (Status == 'A' || Status == 'B') {
			var item = nlapiGetCurrentLineItemValue('item', 'item');

			var location = nlapiGetFieldValue('location');

			if (location != null && location != '' && location != undefined) {
				if (item != null && item != '' && item != undefined) {
					var OverWritePrice = nlapiGetCurrentLineItemValue('item', 'custcol_overwrite_transfer_price');

					if (OverWritePrice != 'T') {
						var UseItemCost = nlapiGetFieldValue('useitemcostastransfercost');

						if (UseItemCost != 'T') {
							var FieldObj = ['isserialitem', 'costingmethod'];

							var ItemObj = nlapiLookupField('item', item, FieldObj);

							//alert(ItemObj.costingmethod);
//Remove this part.
							 //If ends here.

								var filter = new Array();
								var column = new Array();

								filter.push(new nlobjSearchFilter('inventorylocation', null, 'anyOf', location));
								filter.push(new nlobjSearchFilter('internalid', null, 'anyOf', item));

								column[0] = new nlobjSearchColumn('internalid');
								column[1] = new nlobjSearchColumn('locationaveragecost');

								var Se_LocationPriceResult = nlapiSearchRecord('item', null, filter, column);

								if (Se_LocationPriceResult != null && Se_LocationPriceResult != '' && Se_LocationPriceResult != undefined) {
									var LocationAverageCost = Se_LocationPriceResult[0].getValue('locationaveragecost');
									//                             alert('LocationAverageCost' + LocationAverageCost);
									if (LocationAverageCost != null && LocationAverageCost != '' && LocationAverageCost != undefined) {
										nlapiSetCurrentLineItemValue('item', 'rate', LocationAverageCost, true, true);
									}
								}

						}
					}
				}
			}
		}
	}
	return true;
}

// END VALIDATE LINE ================================================




// BEGIN RECALC =====================================================

function recalc(type)
{

	/*  On recalc:

          - EXPLAIN THE PURPOSE OF THIS FUNCTION


          FIELDS USED:

          --Field Name--				--ID--


    */


	//  LOCAL VARIABLES


	//  RECALC CODE BODY


}

// END RECALC =======================================================




// BEGIN FUNCTION ===================================================





// END FUNCTION =====================================================
