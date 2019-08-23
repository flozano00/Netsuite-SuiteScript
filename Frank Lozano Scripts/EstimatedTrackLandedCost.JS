function pageinit_estimatedTrackLandedCost(){
nlapiLogExecution('Debug', 'Enter', 'Entry');
var landedCostPerLine = nlapiGetFieldValue('landedcostperline');
nlapiLogExecution('Debug', 'Landed Cost Per Line', landedCostPerLine);
if (landedCostPerLine == 'T'){
var itemCount = nlapiGetLineItemCount("item");
nlapiLogExecution('Debug', 'Item Count', itemCount);
for (var x = 1; x <= itemCount; x++){
var estLandedCost = nlapiGetCurrentLineItemValue('item', 'custpage_scm_lc_autocalc');
nlapiLogExecution('Debug', 'Estimated Track Landed Cost', estLandedCost);
nlapiLogExecution('Debug', 'Item Count Value:', estLandedCost);
var setLandedCost = nlapiSetCurrentLineItemValue('item','custpage_scm_lc_autocalc', 'T');
nlapiLogExecution('Debug', 'Landed Cost Value Must be True: ', estLandedCost);

}

}
//alert('Set CALCULATE EST. LANDED COST is True');

}
