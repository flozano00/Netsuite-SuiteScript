function pageinit_estimatedTrackLandedCost(){

var landedCostPerLine = nlapiGetFieldValue('landedcostperline');
var landedCostValue = nlapiGetFieldValue('landedcostmethod');

var defaultLandedCost = nlapiSetFieldValue('landedcostmethod', 'VALUE');

  if (landedCostPerLine == 'T'){
    var itemCount = nlapiGetLineItemCount("item");

          for (var x = 1; x <= itemCount; x++){
              var estLandedCost = nlapiGetCurrentLineItemValue('item', 'custpage_scm_lc_autocalc');

              var setLandedCost = nlapiSetCurrentLineItemValue('item','custpage_scm_lc_autocalc', 'T');

}

}
//alert('Set CALCULATE EST. LANDED COST is True');

}

function saveRecord_estimateTrackLandedCost(){
 nlapiLogExecution('Debug', 'Saved Record: ', 'Entry');
 var landedCostLine = nlapiGetFieldValue('landedcostperline');
    if (landedCostLine == 'T'){
      var item_count = nlapiGetLineItemCount("item");
      nlapiLogExecution('Debug', 'item Count', item_count);
        for (var x = 1; x <= item_count; x++){
          var estimateLandedCost = nlapiGetCurrentLineItemValue('item', 'custpage_scm_lc_autocalc');
          nlapiLogExecution('Debug', 'Estimated Landed Cost', estimateLandedCost);
          nlapiLogExecution('AUDIT', 'Script Usage', 'RemainingUsage:'+nlapiGetContext().getRemainingUsage());
            if(estimateLandedCost != 'T'){
              alert("Please make sure that your CALCULATE EST. LANDED COST is checked");
              return false;
            }


        }
              return true;
    }

}




/**
function pageinit_estimatedTrackLandedCost(){
var landedCostPerLine = nlapiGetFieldValue('landedcostperline');
var landedCostValue = nlapiGetFieldValue('landedcostmethod');
var defaultLandedCost = nlapiSetFieldValue('landedcostmethod', 'VALUE');

  if (landedCostPerLine == 'T'){
    var itemCount = nlapiGetLineItemCount("item");
          for (var x = 1; x <= itemCount; x++){
              var estLandedCost = nlapiGetCurrentLineItemValue('item', 'custpage_scm_lc_autocalc');
              var setLandedCost = nlapiSetCurrentLineItemValue('item','custpage_scm_lc_autocalc', 'T');

}

}
//alert('Set CALCULATE EST. LANDED COST is True');

}

function saveRecord_estimateTrackLandedCost(){
 nlapiLogExecution('Debug', 'Saved Record: ', 'Entry');

    var createdFrom = nlapiGetFieldValue('createdfrom');
nlapiLogExecution('Debug', 'Created From Value: ', createdFrom);

if(createdFrom == null && createdFrom == '' && createdFrom == undefined){
     var landedCostLine = nlapiGetFieldValue('landedcostperline');
       if (landedCostLine == 'T'){
        var item_count = nlapiGetLineItemCount("item");
        nlapiLogExecution('Debug', 'item Count', item_count);
          for (var x = 1; x <= item_count; x++){
            var estimateLandedCost = nlapiGetCurrentLineItemValue('item', 'custpage_scm_lc_autocalc');
            nlapiLogExecution('Debug', 'Estimated Landed Cost', estimateLandedCost);
            nlapiLogExecution('AUDIT', 'Script Usage', 'RemainingUsage:'+nlapiGetContext().getRemainingUsage());
              if(estimateLandedCost != 'T'){
                alert("Please make sure that your CALCULATE EST. LANDED COST is checked");
                return false;
            }


        }

    }
 }
 return true;
}









**/
