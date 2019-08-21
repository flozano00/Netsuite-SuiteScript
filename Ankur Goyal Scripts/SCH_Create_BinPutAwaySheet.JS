


function schedulerFunction_binputawaysheet(type)
{
    try
    {
        var Location = '27';
	// Location 27 is the internal Id for 27
        var Bin = '2';
	//Location for Bin 1 is 2.
        var SubmitBinPutaway = false;

        var filter = new Array();
        var column = new Array();

        //filter.push(new nlobjSearchFilter('internalid', null, 'anyOf', 89142));
        column[0] = new nlobjSearchColumn('internalid');
        column[1] = new nlobjSearchColumn('locationquantityonhand');
        column[2] = new nlobjSearchColumn('isserialitem');
//The saved search is called Warehouse 24P items Preferred Bin.*** DO Not Edit. Therefore the saved search is there.
        var ItemSearchRes = nlapiSearchRecord('item', 'customsearch_binputawaysheet', filter, column);
//If the reason that the item search is empty don't run the if execution statement.
//All this within the bracket.
        if (ItemSearchRes != null && ItemSearchRes != '' && ItemSearchRes != undefined)
        {
//Here we are creating a record called Bin Putaway record.
            var binPutAway = nlapiCreateRecord('binworksheet',
                {
                recordmode: 'dynamic',
                location: Location
            });
//Here we set a loop and define the itemrec as the variable. it could be i but the developer chose ItemRec
            for (var Itemrec = 0; Itemrec < ItemSearchRes.length; Itemrec++)
            {
                try
                {
//Here we are looping the internal Id to see the value of the internal Id. Therefore, here we see the execution logs.
                    var ItemId = ItemSearchRes[Itemrec].getValue('internalid');
                    nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'ItemId -->' + ItemId);
//Here we see the Is Serial Check box loop whole to see the value.
                    var IsSerial = ItemSearchRes[Itemrec].getValue('isserialitem');

                    nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'IsSerial -->' + IsSerial);
//Here we are seeing the line Item Value of the item.
                    var itemLine = binPutAway.findLineItemValue('item', 'item', ItemId);
//If the item Line is greater then or equal to 1 set the Submit Bin Putaway to true.
                    if (itemLine >= 1)
                    {
                        SubmitBinPutaway = true;
//If the item is Serialized therefore we do the following if execution.
                        if (IsSerial == 'T')
                        {
//Here we have a new array called item_filters
                            var item_filters = new Array();
//Therefore we are setting a new criteria for this filter and it states that the internal id is dynamic.
//var ItemId = ItemSearchRes[Itemrec].getValue('internalid');
                            item_filters.push(new nlobjSearchFilter('internalid', null, 'anyOf', ItemId));
//Item Serial Numbers Bin Putaway *** Do Not edit
                            var item_search = nlapiLoadSearch('item', 'customsearch_put_awayserialnumber');
//If this search is not empty please proceed.
                            if (item_search != null && item_search != '' && item_search != undefined)
                            {

                                var TotalQuantity = ItemSearchRes[Itemrec].getValue('locationquantityonhand');
                                nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'TotalQuantity -->' + TotalQuantity);

                                binPutAway.selectLineItem('item', itemLine);

                                binPutAway.setCurrentLineItemValue('item', 'quantity', TotalQuantity);

                                var inventoryDetails = binPutAway.createCurrentLineItemSubrecord('item', 'inventorydetail');
////Item Serial Numbers Bin Putaway *** Do Not edit
                                item_search.addFilters(item_filters); // Here we created a search and then added a filter to this search.

/** This Part I'm not sure.*/
/**Item Serial Numbers Bin Putaway *** Do Not edit*/
                                var resultset = item_search.runSearch();
                        //What does searchid mean here ?
                                var searchid = 0;
                        //What does j mean in this concept ?
                                var j = 0;
                      //Whats the reason for the do loop ?
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
                                            inventoryDetails.selectNewLineItem('inventoryassignment');
                                            inventoryDetails.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', NewSerialNumber);
                                            inventoryDetails.setCurrentLineItemValue('inventoryassignment', 'binnumber', Bin);
                                            inventoryDetails.setCurrentLineItemValue('inventoryassignment', 'quantity', Quantity);
                                            inventoryDetails.commitLineItem('inventoryassignment');
                                        }
                                    }
                                }
                                while (mapping_search.length >= 1000);
                            }
                        }
                        else
                        {
                            var TotalQuantity = ItemSearchRes[Itemrec].getValue('locationquantityonhand');
                            nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'TotalQuantity -->' + TotalQuantity);

                            binPutAway.selectLineItem('item', itemLine);

                            binPutAway.setCurrentLineItemValue('item', 'quantity', TotalQuantity);

                            var inventoryDetails = binPutAway.createCurrentLineItemSubrecord('item', 'inventorydetail');
                            inventoryDetails.selectNewLineItem('inventoryassignment');
                            inventoryDetails.setCurrentLineItemValue('inventoryassignment', 'binnumber', Bin);
                            inventoryDetails.setCurrentLineItemValue('inventoryassignment', 'quantity', TotalQuantity);
                            inventoryDetails.commitLineItem('inventoryassignment');
                        }
                            inventoryDetails.commit();
                            binPutAway.commitLineItem('item');
                    }
                    else {
                        nlapiLogExecution('DEBUG', 'No worksheet created', 'No Item found at Location');
                    }
                }
                catch (ex) {
                    nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', 'Inner Execption -->' + ex);

                }
            }
            if (SubmitBinPutaway == true) {
//At the beginning of the script he modified it set to false on line 12. Once submitBinPutaway is true.
//Allow to submit the record.
                var BinPutAwayid = nlapiSubmitRecord(binPutAway);
                nlapiLogExecution('DEBUG', 'BinPutAwayid', BinPutAwayid);
            }

        }
    }
    catch (Execption) {
        nlapiLogExecution('DEBUG', 'SCH Create Bin Putaway Sheet', ' Execption -->' + Execption);
    }
}
// Modified by 8/19/2019
// END SCHEDULED FUNCTION ===============================================
