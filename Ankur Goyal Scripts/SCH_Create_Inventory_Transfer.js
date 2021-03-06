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

function schedulerFunction_createinventorytrans(type) {
    /*  On scheduled function:
	 - PURPOSE
	 -
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
    //==== CODE FOR DESGNING POP UP XL ======
    try {
        var Location = '1';
        var Bin = '7';
        var SubmitBinPutaway = false;

        var ItemSearchRes = nlapiLoadSearch('item', 'customsearch_binputawaysheet');

        if (ItemSearchRes != null && ItemSearchRes != '' && ItemSearchRes != undefined) {
            var invTransferhObj = nlapiCreateRecord('inventorytransfer', {
                recordmode: 'dynamic',
            });

            invTransferhObj.setFieldValue('subsidiary', 1)
            //nlapiLogExecution('DEBUG', 'schedulerFunction_createinventorytransfer item', 'i_subsidiary' + i_subsidiary);

            invTransferhObj.setFieldValue('location', 26)
            //nlapiLogExecution('DEBUG', 'schedulerFunction_createinventorytransfer item', 'i_fromlocation' + i_fromlocation);

            invTransferhObj.setFieldValue('transferlocation', 1)
            invTransferhObj.setFieldValue('custbody5', 6)
            //nlapiLogExecution('DEBUG', 'schedulerFunction_createinventorytransfer item', 'i_tolocation' + i_tolocation);


            var Itemresultset = ItemSearchRes.runSearch();
            var Itemsearchid = 0;

            do {
                var Itemmapping_search = Itemresultset.getResults(Itemsearchid, Itemsearchid + 1000);

                if (Itemmapping_search != null && Itemmapping_search != '' && Itemmapping_search != undefined) {
                    for (var Itemrs in Itemmapping_search) {
                        var result = Itemmapping_search[Itemrs];
                        var columns = result.getAllColumns();
                        var columnLen = columns.length;

                        var ItemId = '';
                        var IsSerial = '';
                        var TotalQuantity = '';

                        for (var t = 0; t < columnLen; t++) {
                            var column = columns[t];
                            var LabelName = column.getLabel();
                            var fieldName = column.getName();
                            var value = result.getValue(column);
                            //var text = result.getText(column);

                            if (fieldName == 'internalid') {
                                ItemId = value
                            }
                            if (fieldName == 'isserialitem') {
                                IsSerial = value;
                            }
                            if (fieldName == 'locationquantityonhand') {
                                TotalQuantity = value;
                            }
                        }

                        try {

                            nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'ItemId -->' + ItemId);

                            nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'IsSerial -->' + IsSerial);
                            nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'TotalQuantity -->' + TotalQuantity);


                            if (IsSerial == 'T') {
                                var item_filters = new Array();
                                item_filters.push(new nlobjSearchFilter('internalid', null, 'anyOf', ItemId));

                                var item_search = nlapiLoadSearch('item', 'customsearch_put_awayserialnumber');

                                if (item_search != null && item_search != '' && item_search != undefined) {

                                    //var TotalQuantity = ItemSearchRes[Itemrec].getValue('locationquantityonhand');
                                    nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'TotalQuantity -->' + TotalQuantity);

                                    invTransferhObj.selectNewLineItem('inventory')

                                    invTransferhObj.setCurrentLineItemValue('inventory', 'item', ItemId);

                                    invTransferhObj.setCurrentLineItemValue('inventory', 'adjustqtyby', TotalQuantity);

                                    var inventoryDetailObj = invTransferhObj.createCurrentLineItemSubrecord('inventory', 'inventorydetail');

                                    item_search.addFilters(item_filters);

                                    var resultset = item_search.runSearch();
                                    var searchid = 0;
                                    var j = 0;

                                    do {
                                        var mapping_search = resultset.getResults(searchid, searchid + 1000);

                                        if (mapping_search != null && mapping_search != '' && mapping_search != undefined) {
                                            for (var rs in mapping_search) {
                                                var result = mapping_search[rs];
                                                var columns = result.getAllColumns();
                                                var columnLen = columns.length;

                                                var SerialNumber = '';
                                                var Quantity = '';

                                                for (var i = 0; i < columnLen; i++) {
                                                    var column = columns[i];
                                                    var LabelName = column.getLabel();
                                                    var fieldName = column.getName();
                                                    var value = result.getValue(column);
                                                    //var text = result.getText(column);

                                                    if (LabelName == 'inventorynumber') {
                                                        SerialNumber = value
                                                    }
                                                    if (fieldName == 'quantityavailable') {
                                                        Quantity = value;
                                                    }
                                                }
                                                var NewSerialNumber = SerialNumber.trim();

                                                searchid++;

                                                inventoryDetailObj.selectNewLineItem('inventoryassignment');
                                                //nlapiLogExecution('DEBUG', 'create return Authoriazation', 'after line select ');

                                                inventoryDetailObj.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', NewSerialNumber);
                                                //nlapiLogExecution('DEBUG', 'create return Authoriazation', 'i_serial_no' + NewSerialNumber);

                                                inventoryDetailObj.setCurrentLineItemValue('inventoryassignment', 'tobinnumber', Bin);
                                                //nlapiLogExecution('DEBUG', 'create return Authoriazation', 'i_binumber');
                                                inventoryDetailObj.setCurrentLineItemValue('inventoryassignment', 'toinventorystatus', 10);

                                                inventoryDetailObj.setCurrentLineItemValue('inventoryassignment', 'quantity', '1');

                                                inventoryDetailObj.commitLineItem('inventoryassignment');
                                                /*
												 nlapiLogExecution('DEBUG', 'create return Authoriazation', 'after line commit');

												 inventoryDetails.selectNewLineItem('inventoryassignment');
												 inventoryDetails.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', NewSerialNumber);
												 inventoryDetails.setCurrentLineItemValue('inventoryassignment', 'binnumber', Bin);
												 inventoryDetails.setCurrentLineItemValue('inventoryassignment', 'quantity', Quantity);
												 inventoryDetails.commitLineItem('inventoryassignment');
												 */
                                            }
                                        }
                                    }
                                    while (mapping_search.length >= 1000);
                                }
                            }
                            else {
                                //var TotalQuantity = ItemSearchRes[Itemrec].getValue('locationquantityonhand');
                                nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'TotalQuantity -->' + TotalQuantity);

                                invTransferhObj.selectNewLineItem('inventory')

                                invTransferhObj.setCurrentLineItemValue('inventory', 'item', ItemId);

                                invTransferhObj.setCurrentLineItemValue('inventory', 'adjustqtyby', TotalQuantity);

                                var inventoryDetailObj = invTransferhObj.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
                                nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'inventoryDetailObj -->' + inventoryDetailObj);

                                inventoryDetailObj.selectNewLineItem('inventoryassignment');
                                inventoryDetailObj.setCurrentLineItemValue('inventoryassignment', 'tobinnumber', Bin);
                                inventoryDetailObj.setCurrentLineItemValue('inventoryassignment', 'quantity', TotalQuantity);
                                inventoryDetailObj.setCurrentLineItemValue('inventoryassignment', 'toinventorystatus', 10);
                                inventoryDetailObj.commitLineItem('inventoryassignment');
                                //inventoryDetailObj.commit();
                            }
                            inventoryDetailObj.commit();
                            invTransferhObj.commitLineItem('inventory');
                            nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'test');

                        }
                        catch (ex) {
                            nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'Inner Execption -->' + ex);
                        }
                    }
                    Itemsearchid++;
                }

            }
            while (Itemmapping_search.length >= 1000);

            var InventoryTransferid = nlapiSubmitRecord(invTransferhObj);
            nlapiLogExecution('DEBUG', 'InventoryTransferid', InventoryTransferid);

        }
    }
    catch (Execption) {
        nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', ' Execption -->' + Execption);
    }
}

// END SCHEDULED FUNCTION ===============================================
