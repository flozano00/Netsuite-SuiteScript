/**
Created by Frank Lozano 5/30/2019.

0462-789-N
*/

/*[SANDBOX] Alert: Inventory Adjustment E-mail Alert (Record Created) (originally To: frusso@telquestintl.com)

/**
1. Script Requirement on the alert system.
2. The locationquantity available has to be greater then 0.
3. The Locations that I want to see within Netsuite is
    1. Warehouse A.
    2. Warehouse B.
    3. Warehouse 24P.
4. Please modify the Saved Search criteria to the following.
    1. Location is Warehouse A, Warehouse B, and Warehouse 24P.

*/




function cl_itemavailable(type,name)
{
	if(type == 'item' && name == 'custcol_telquest_so_allinventory')
	{
		nlapiLogExecution('Debug','Enter','Entry');
		var subsidiary = nlapiGetFieldValue('subsidiary');
		nlapiLogExecution('Debug','Enter','Subsidiary ' + subsidiary);
		var itemInternalId = nlapiGetCurrentLineItemValue('item','item');
		nlapiLogExecution('Debug','Item Internal ID',itemInternalId);
		var itemSearch = nlapiSearchRecord("item",null,
			[
			["internalid","anyof",itemInternalId],
			"AND",
			["locationquantityavailable","greaterthan","0"],
			"AND",
			["subsidiary","anyof",subsidiary]
			],
			[
			new nlobjSearchColumn("internalid"),
			new nlobjSearchColumn("displayname"),
			new nlobjSearchColumn("salesdescription"),
			new nlobjSearchColumn("type"),
			new nlobjSearchColumn("baseprice"),
			new nlobjSearchColumn("name","inventoryLocation",null),
			new nlobjSearchColumn("locationquantityavailable")
			]
		)
		var locationString = "";
		for(var i=0 ; i<itemSearch.length ; i++)
		{
			var colsAll = itemSearch[i].getAllColumns();
			var location = itemSearch[i].getValue(colsAll[5]);
			var qtyAvail = itemSearch[i].getValue(colsAll[6]);
			var locAvail = location+" Quantity Available : "+qtyAvail;
			locationString = locationString+""+locAvail+"\n";
		}
		var result = itemSearch[0].getValue('type');
		nlapiLogExecution('debug','result: ', result);
		alert('Here is your Result \n\n' + locationString + '\n\n Created by : Frank ');
		// Iventory Location  : Warehouse A Qunatity Avaiable: 3
		// Inventory Location : Warehouse B Quantity Avaiable : 4
		// Inventory Location : Warehouse 24P Quantity Available: 4
		nlapiLogExecution('Debug','Exit', 'Exit');
	}



}
