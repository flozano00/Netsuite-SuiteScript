function AfterSubmitRecord_SetSalesAmt(type) {
    try {
        if (type != 'delete') {

            var s_rectype = nlapiGetRecordType();
            var i_recordId = nlapiGetRecordId();

            var loadRec_Obj = nlapiLoadRecord(s_rectype, i_recordId);

            var customer_id = loadRec_Obj.getFieldValue('entity');
            var Trandate = loadRec_Obj.getFieldValue('trandate');

            var DateObj = nlapiStringToDate(Trandate);

            var Year = DateObj.getFullYear();
            nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', 'Year=>' + Year);

            var NewYear = Year.toString();
            nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', 'NewYear=>' + NewYear);

            var Current_yr_salesAmt = 0;

            var FilterExpression = [["type", "anyof", "CustInvc", "CashRfnd", "CashSale", "CustCred"], "AND", ["shipping", "is", "F"], "AND", ["taxline", "is", "F"], "AND", ["mainline", "is", "F"], "AND", ["cogs", "is", "F"], "AND", ["name", "anyof", customer_id], "AND", [String("formulanumeric: case when TO_CHAR({trandate},'YYYY') = '" + NewYear + "' then 1 else 0 end"), "equalto", "1"]];

            nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', 'FilterExpression=>' + FilterExpression);

            // -------------------Calculate sales Amount------------------------//
            var Current_year_sale = nlapiSearchRecord("transaction", null, FilterExpression, [new nlobjSearchColumn("amount", null, "SUM")]);
            nlapiLogExecution('Debug', 'after_submit_update_total', 'Current_year_sale=>' + Current_year_sale);
            if (Current_year_sale) {
                var TranSearch = Current_year_sale[0];

                var SearchColumns = TranSearch.getAllColumns();

                Current_yr_salesAmt = Current_year_sale[0].getValue(SearchColumns[0]);
                nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', 'Current_yr_salesAmt=>' + Current_yr_salesAmt);
            }

            if (Year == '2015') {
                var UpdatedCustId = nlapiSubmitField('customer', customer_id, 'custentity19', Current_yr_salesAmt);
                nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', '2015 = UpdatedCustId=>' + UpdatedCustId);
            }
            if (Year == '2016') {
                var UpdatedCustId = nlapiSubmitField('customer', customer_id, 'custentity20', Current_yr_salesAmt);
                nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', '2016 = UpdatedCustId=>' + UpdatedCustId);
            }
            if (Year == '2017') {
                var UpdatedCustId = nlapiSubmitField('customer', customer_id, 'custentity21', Current_yr_salesAmt);
                nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', '2017 = UpdatedCustId=>' + UpdatedCustId);
            }
            if (Year == '2018') {
                var UpdatedCustId = nlapiSubmitField('customer', customer_id, 'custentity22', Current_yr_salesAmt);
                nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', '2018 = UpdatedCustId=>' + UpdatedCustId);
            }
            if (Year == '2019') {
                var UpdatedCustId = nlapiSubmitField('customer', customer_id, 'custentity25', Current_yr_salesAmt);
                nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', '2019 = UpdatedCustId=>' + UpdatedCustId);
            }
          if (Year == '2020') {
                var UpdatedCustId = nlapiSubmitField('customer', customer_id, 'custentity_sales_2020', Current_yr_salesAmt);
                nlapiLogExecution('Debug', 'AfterSubmitRecord_SetSalesAmt', '2020 = UpdatedCustId=>' + UpdatedCustId);
            }
        }
    }
    catch (e) {
        nlapiLogExecution("Debug", "ERROR", e);
    }
}
