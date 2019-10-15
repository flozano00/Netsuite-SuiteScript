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

function beforeLoadRecord(type, form)
{
	/*  On before load:
	 - EXPLAIN THE PURPOSE OF THIS FUNCTION
	 -
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
	//  LOCAL VARIABLES

	//  BEFORE LOAD CODE BODY

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

function afterSubmitRecord_SetLandedCost(type){
	/*  On after submit:
	 - PURPOSE
	 -
	 FIELDS USED:
	 --Field Name--				--ID--
	 */
	//  LOCAL VARIABLES


	//  AFTER SUBMIT CODE BODY

	try {
		var i_recordId = nlapiGetRecordId();
		var s_recordtype = nlapiGetRecordType();

		var o_recordObj = nlapiLoadRecord(s_recordtype, i_recordId);

		var CostingMethod = o_recordObj.getFieldValue('custbody_po_costing_method');

		if (LogValidation(CostingMethod)) {
			var Update = false;
			var b_shipping = false;
			var b_ImportTax = false;
			var b_ocean = false;
			var b_truck = false;
			var b_upcharge = false;
			var b_salestax = false;
			var b_ups = false;
			var b_Fedex = false;
			var b_refurbishment = false;

			var Shipping = o_recordObj.getFieldValue('custbody_po_shipping');
			if (LogValidation(Shipping)) {
				b_shipping = true;
				Update = true;
			}
			var ImportTax = o_recordObj.getFieldValue('custbody_po_import_tax');
			if (LogValidation(ImportTax)) {
				b_ImportTax = true;
				Update = true;
			}
			var OceanFreight = o_recordObj.getFieldValue('custbody_po_ocean_freight');
			if (LogValidation(OceanFreight)) {
				b_ocean = true;
				Update = true;
			}
			var TruckFreight = o_recordObj.getFieldValue('custbody_po_truck_freight');
			if (LogValidation(TruckFreight)) {
				b_truck = true;
				Update = true;
			}
			var Upcharge = o_recordObj.getFieldValue('custbody_po_upcharge');
			if (LogValidation(Upcharge)) {
				b_upcharge = true;
				Update = true;
			}
			var SalesTax = o_recordObj.getFieldValue('custbody_po_sales_tax');
			if (LogValidation(SalesTax)) {
				b_salestax = true;
				Update = true;
			}
			var UPSShipping = o_recordObj.getFieldValue('custbody_po_ups_shipping');
			if (LogValidation(UPSShipping)) {
				b_ups = true;
				Update = true;
			}
			var FedexShipping = o_recordObj.getFieldValue('custbody_po_fedex_shipping');
			if (LogValidation(FedexShipping)) {
				b_Fedex = true;
				Update = true;
			}
			var Refurbishment = o_recordObj.getFieldValue('custbody_po_refurbishment');
			if (LogValidation(Refurbishment)) {
				b_refurbishment = true;
				Update = true;
			}

			if (Update == true) {
				var GetIRS = new Array();

				GetIRS = o_recordObj.getFieldValues('custbody_po_item_receipts');
				nlapiLogExecution('DEBUG', 'afterSubmitRecord Update IF Ids', 'GetIRS-->' + GetIRS);

				if (GetIRS != '' && GetIRS != '' && GetIRS != undefined) {
					var IR_filter = new Array();
					var IR_Column = new Array();

					IR_filter.push(new nlobjSearchFilter('internalid', null, 'anyOf', GetIRS));
					IR_filter.push(new nlobjSearchFilter('createdfrom', null, 'anyOf', i_recordId));
					IR_filter.push(new nlobjSearchFilter('tracklandedcost', 'item', 'is', 'T'));
					IR_filter.push(new nlobjSearchFilter('mainline', null, 'is', 'F'));
					IR_filter.push(new nlobjSearchFilter('taxline', null, 'is', 'F'));
					IR_filter.push(new nlobjSearchFilter('shipping', null, 'is', 'F'));
					IR_filter.push(new nlobjSearchFilter('cogs', null, 'is', 'F'));
					IR_filter.push(new nlobjSearchFilter('custbody_landed_costupdated', null, 'is', 'F'));

					IR_Column[0] = new nlobjSearchColumn('quantity', null, 'sum');
					IR_Column[1] = new nlobjSearchColumn('formulanumeric', null, 'sum').setFormula('{item.weight}*{quantity}');
					IR_Column[2] = new nlobjSearchColumn('formulanumeric', null, 'sum').setFormula('{quantity}*{rate}');

					var PO_IRResult = nlapiSearchRecord('itemreceipt', null, IR_filter, IR_Column);

					if (PO_IRResult != null && PO_IRResult != '' && PO_IRResult != undefined) {
						var TotalQty = PO_IRResult[0].getValue(IR_Column[0]);
						nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'TotalQty -->' + TotalQty);

						var TotalWeight = PO_IRResult[0].getValue(IR_Column[1]);
						nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'TotalWeight -->' + TotalWeight)

						var TotalAmount = PO_IRResult[0].getValue(IR_Column[2]);
						nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'TotalAmount -->' + TotalAmount)


						var GRP_IR_Column = new Array();
						GRP_IR_Column[0] = new nlobjSearchColumn('quantity', null, 'sum');
						GRP_IR_Column[1] = new nlobjSearchColumn('formulanumeric', null, 'sum').setFormula('{item.weight}*{quantity}');
						GRP_IR_Column[2] = new nlobjSearchColumn('formulanumeric', null, 'sum').setFormula('{quantity}*{rate}');
						GRP_IR_Column[3] = new nlobjSearchColumn('internalid', null, 'group');

						var GRP_PO_IRResult = nlapiSearchRecord('itemreceipt', null, IR_filter, GRP_IR_Column);

						if (GRP_PO_IRResult != null && GRP_PO_IRResult != '' && GRP_PO_IRResult != undefined) {

						}


						var ItemRec_Column = new Array();

						ItemRec_Column[0] = new nlobjSearchColumn('internalid');
						ItemRec_Column[1] = new nlobjSearchColumn('quantity');
						ItemRec_Column[2] = new nlobjSearchColumn('formulanumeric').setFormula('{item.weight}*{quantity}');
						ItemRec_Column[3] = new nlobjSearchColumn('formulanumeric').setFormula('{quantity}*{rate}');
						ItemRec_Column[4] = new nlobjSearchColumn('item');

						var ItemRecResult = nlapiSearchRecord('itemreceipt', null, IR_filter, ItemRec_Column);

						if (ItemRecResult != null && ItemRecResult != '' && ItemRecResult != undefined) {

						}

						if (GRP_PO_IRResult != null && GRP_PO_IRResult != '' && GRP_PO_IRResult != undefined)
						{

							for (var p = 0; p < GRP_PO_IRResult.length; p++) {


								try {

									var IR_RecordID = GRP_PO_IRResult[p].getValue(GRP_IR_Column[3]);
									nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'IR_RecordID -->' + IR_RecordID);


									if (IR_RecordID != null && IR_RecordID != '' && IR_RecordID != undefined) {
										var IR_recordObj = nlapiLoadRecord('itemreceipt', IR_RecordID);

										var LandedCostLine = IR_recordObj.getFieldValue('landedcostperline');

										if (LandedCostLine == 'T') {

											var IR_LineCount = IR_recordObj.getLineItemCount('item');

											for (var i = 1; i <= IR_LineCount; i++) {
												var Item = IR_recordObj.getLineItemValue('item', 'item', i);
												var quantity = IR_recordObj.getLineItemValue('item', 'quantity', i);
												var TrackLandedcost = IR_recordObj.getLineItemValue('item', 'tracklandedcost', i);
												var rate = IR_recordObj.getLineItemValue('item', 'rate', i);

												if (TrackLandedcost == 'T') {
													AddLandedCost(Shipping, ImportTax, OceanFreight, TruckFreight, Upcharge, SalesTax, UPSShipping, FedexShipping, Refurbishment, IR_RecordID, ItemRecResult, ItemRec_Column, TotalQty, TotalWeight, TotalAmount, IR_recordObj, CostingMethod, Item, quantity, rate, i, b_shipping, b_ImportTax, b_ocean, b_truck, b_upcharge, b_salestax, b_ups, b_Fedex, b_refurbishment)
												}
											}
										}
										else {
											AddLandedCostHeaderLevel(Shipping, ImportTax, OceanFreight, TruckFreight, Upcharge, SalesTax, UPSShipping, FedexShipping, Refurbishment, IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, TotalQty, TotalWeight, TotalAmount, IR_recordObj, CostingMethod, b_shipping, b_ImportTax, b_ocean, b_truck, b_upcharge, b_salestax, b_ups, b_Fedex, b_refurbishment)
										}

										IR_recordObj.setFieldValue('custbody_landed_costupdated', 'T');

										var UpdatedIRID = nlapiSubmitRecord(IR_recordObj);
										nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'UpdatedIRID -->' + UpdatedIRID)
									}

								}
								catch (ex) {
									nlapiLogExecution('DEBUG', 'Update ID ids', 'Inner ex -->' + ex);
								}
							}
						}

						var User = nlapiGetUser();

						var O_LC_Log_Obj = nlapiCreateRecord('customrecord_landed_cost_alloc_logs');

						O_LC_Log_Obj.setFieldValue('custrecord_item_receipt', GetIRS);
						O_LC_Log_Obj.setFieldValue('custrecord_purchase_order', i_recordId);
						O_LC_Log_Obj.setFieldValue('custrecord_lclog_eneteredby', User);
						O_LC_Log_Obj.setFieldValue('custrecord_lc_costing_method', CostingMethod);


						if (LogValidation(Shipping)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_shipping', Shipping);
							o_recordObj.setFieldValue('custbody_po_shipping', '');
						}

						if (LogValidation(ImportTax)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_import_tax_duties', ImportTax);
							o_recordObj.setFieldValue('custbody_po_import_tax', '');
						}

						if (LogValidation(OceanFreight)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_ocean_fieght', OceanFreight);
							o_recordObj.setFieldValue('custbody_po_ocean_freight', '');
						}

						if (LogValidation(TruckFreight)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_truck_freight', TruckFreight);
							o_recordObj.setFieldValue('custbody_po_truck_freight', '');
						}

						if (LogValidation(Upcharge)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_upcharge', Upcharge);
							o_recordObj.setFieldValue('custbody_po_upcharge', '');
						}

						if (LogValidation(SalesTax)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_sales_tax', SalesTax);
							o_recordObj.setFieldValue('custbody_po_sales_tax', '');
						}

						if (LogValidation(UPSShipping)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_ups_shipping', UPSShipping);
							o_recordObj.setFieldValue('custbody_po_ups_shipping', '');
						}
						if (LogValidation(FedexShipping)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_fedex', FedexShipping);
							o_recordObj.setFieldValue('custbody_po_fedex_shipping', '');
						}

						if (LogValidation(Refurbishment)) {
							O_LC_Log_Obj.setFieldValue('custrecord_lc_refurbishment', Refurbishment);
							o_recordObj.setFieldValue('custbody_po_refurbishment', '');
						}
						var LC_LogsId = nlapiSubmitRecord(O_LC_Log_Obj);
						nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'LC_LogsId -->' + LC_LogsId)

						o_recordObj.setFieldValue('custbody_po_item_receipts', '');
						o_recordObj.setFieldValue('custbody_po_costing_method', '');

						var UpdatedPOID = nlapiSubmitRecord(o_recordObj);
						nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'UpdatedPOID -->' + UpdatedPOID)


					}
				}
			}
		}
	}
	catch (ex) {
		nlapiLogExecution('DEBUG', 'Update ID ids', 'ex -->' + ex);
	}
	return true;
}
// END AFTER SUBMIT ===============================================

function LogValidation(value)
{
    if (value != null && value != '' && value != undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function AddLandedCost(Shipping, ImportTax, OceanFreight, TruckFreight, Upcharge, SalesTax, UPSShipping, FedexShipping, Refurbishment, IR_RecordID, ItemRecResult, ItemRec_Column, TotalQty, TotalWeight, TotalAmount, IR_recordObj, CostingMethod, item, quantity, rate, i, b_shipping, b_ImportTax, b_ocean, b_truck, b_upcharge, b_salestax, b_ups, b_Fedex, b_refurbishment) {
    var amount = 0;
    IR_recordObj.selectLineItem('item', i)

    try {
        var LandedDetailObj = IR_recordObj.createCurrentLineItemSubrecord('item', 'landedcost');
    }
    catch (ex) {
        var LandedDetailObj = IR_recordObj.editCurrentLineItemSubrecord('item', 'landedcost');
    }


    if (b_shipping == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, Shipping, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 1, amount);
    }
    if (b_ImportTax == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, ImportTax, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 4, amount);
    }
    if (b_ocean == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, OceanFreight, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 5, amount);
    }
    if (b_truck == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, TruckFreight, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 6, amount);
    }
    if (b_upcharge == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, Upcharge, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 7, amount);
    }
    if (b_salestax == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, SalesTax, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 8, amount);
    }
    if (b_ups == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, UPSShipping, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 9, amount);
    }
    if (b_Fedex == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, FedexShipping, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 10, amount);
    }
    if (b_refurbishment == true) {
        amount = CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, Refurbishment, item, quantity, rate, TotalQty, TotalAmount, TotalWeight);
        AddLandedCostSublistLine(LandedDetailObj, 11, amount);
    }

    LandedDetailObj.commit();
    IR_recordObj.commitLineItem('item');
}

function CalculateLandedCostAmount(IR_RecordID, ItemRecResult, ItemRec_Column, CostingMethod, CostAmount, item, quantity, rate, TotalQty, TotalAmount, TotalWeight) {
    var amount = 0;

    nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'quantity -->' + quantity)
    nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'TOT quantity -->' + TotalQty)
    nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'TotalAmount -->' + TotalAmount)
    nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'TotalAmount -->' + TotalWeight)


    if (CostingMethod == 1)
    {
        for (var k = 0; k < ItemRecResult.length; k++) {
            var SE_Item = ItemRecResult[k].getValue('item');
            nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'SE_Item -->' + SE_Item);

            var SE_IRID = ItemRecResult[k].getValue('internalid');
            nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'SE_IRID -->' + SE_IRID);

            var SE_Quantity = ItemRecResult[k].getValue('quantity');
            nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'SE_Quantity -->' + SE_Quantity)

            var SE_Weight = ItemRecResult[k].getValue(ItemRec_Column[2]);
            nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'SE_Weight -->' + SE_Weight)

            if (IR_RecordID == SE_IRID && SE_Item == item && SE_Quantity == quantity) {
                amount = (parseFloat(SE_Weight) / parseFloat(TotalWeight)) * parseFloat(CostAmount);
                break;
            }
        }
    }
    if (CostingMethod == 2)
    {
        amount = (parseFloat(quantity) / parseFloat(TotalQty)) * parseFloat(CostAmount);
    }
    if (CostingMethod == 3)
    {
        var ItemAmount = parseFloat(parseFloat(quantity) * parseFloat(rate));

        amount = parseFloat((parseFloat(ItemAmount) / parseFloat(TotalAmount)) * parseFloat(CostAmount));
    }
    nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'amount -->' + amount)
    return amount;
}


function AddLandedCostSublistLine(LandedDetailObj, category, amount)
{
    var B_insert = true;

    var LandedCostLineCount = LandedDetailObj.getLineItemCount('landedcostdata');

    for (l = 1; l <= LandedCostLineCount; l++)
    {
        var CostCategory = LandedDetailObj.getLineItemValue('landedcostdata', 'costcategory', l);

        if (CostCategory == category)
        {
            LandedDetailObj.selectLineItem('landedcostdata', l);
            LandedDetailObj.setCurrentLineItemValue('landedcostdata', 'amount', amount);
            LandedDetailObj.commitLineItem('landedcostdata');
            B_insert = false;
            break;
        }
    }
    if (B_insert == true)
    {
        LandedDetailObj.selectNewLineItem('landedcostdata');
        LandedDetailObj.setCurrentLineItemValue('landedcostdata', 'costcategory', category);
        LandedDetailObj.setCurrentLineItemValue('landedcostdata', 'amount', amount);
        LandedDetailObj.commitLineItem('landedcostdata');
    }
}

function AddLandedCostHeaderLevel(Shipping, ImportTax, OceanFreight, TruckFreight, Upcharge, SalesTax, UPSShipping, FedexShipping, Refurbishment, IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, TotalQty, TotalWeight, TotalAmount, IR_recordObj, CostingMethod, b_shipping, b_ImportTax, b_ocean, b_truck, b_upcharge, b_salestax, b_ups, b_Fedex, b_refurbishment) {

    if (CostingMethod == 1) {
        IR_recordObj.setFieldValue('landedcostmethod', 'WEIGHT');
    }
    if (CostingMethod == 2) {
        IR_recordObj.setFieldValue('landedcostmethod', 'QUANTITY');
    }
    if (CostingMethod == 3) {
        IR_recordObj.setFieldValue('landedcostmethod', 'VALUE');
    }

    var amount = 0;
    if (b_shipping == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, Shipping, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount1', amount);
    }
    if (b_ImportTax == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, ImportTax, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount4', amount);
    }
    if (b_ocean == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, OceanFreight, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount5', amount);
    }
    if (b_truck == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, TruckFreight, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount6', amount);
    }
    if (b_upcharge == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, Upcharge, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount7', amount);
    }
    if (b_salestax == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, SalesTax, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount8', amount);
    }
    if (b_ups == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, Upcharge, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount9', amount);
    }
    if (b_Fedex == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, FedexShipping, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount10', amount);
    }
    if (b_refurbishment == true) {
        amount = CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, Refurbishment, TotalQty, TotalAmount, TotalWeight);
        IR_recordObj.setFieldValue('landedcostamount11', amount);
    }
}


function CalculateHeaderLandedCostAmount(IR_RecordID, GRP_PO_IRResult, GRP_IR_Column, CostingMethod, CostAmount, TotalQty, TotalAmount, TotalWeight) {
    var amount = 0;

    for (var k = 0; k < GRP_PO_IRResult.length; k++) {
        var SE_IRID = GRP_PO_IRResult[k].getValue(GRP_IR_Column[3]);
        nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'SE_IRID -->' + SE_IRID);

        var SE_Quantity = GRP_PO_IRResult[k].getValue(GRP_IR_Column[0]);
        nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'SE_Quantity -->' + SE_Quantity)

        var SE_Weight = GRP_PO_IRResult[k].getValue(GRP_IR_Column[1]);
        nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'SE_Weight -->' + SE_Weight)

        var SE_Amount = GRP_PO_IRResult[k].getValue(GRP_IR_Column[2]);
        nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'SE_Amount -->' + SE_Amount)

        if (IR_RecordID == SE_IRID) {
            if (CostingMethod == 1) {
                amount = (parseFloat(SE_Weight) / parseFloat(TotalWeight)) * parseFloat(CostAmount);
            }
            if (CostingMethod == 2) {
                amount = (parseFloat(SE_Quantity) / parseFloat(TotalQty)) * parseFloat(CostAmount);
            }
            if (CostingMethod == 3) {
                amount = parseFloat((parseFloat(SE_Amount) / parseFloat(TotalAmount)) * parseFloat(CostAmount));
            }
            break;
        }
    }

    if (LogValidation(amount))
    {

    }
    else
    {
        amount = 0;
    }
    nlapiLogExecution('DEBUG', 'Link PO Payment Amount', 'amount -->' + amount)
    return amount;
}




// END FUNCTION =====================================================
