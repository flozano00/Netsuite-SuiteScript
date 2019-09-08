case
when {class} = 'Website'
     and {sibsidiary} = 'West Coast'
      then {department}
when {class} = 'Website'
      then 'From Web'
when {salesrep.supervisor} is null
      then {location} || ' Walk - In' //These get concatenated.
else {salesrep.supervisor}
end

//⁸Testing for {department} = '' wil lnot work.To test for an unpopulated field, always use is null or is not null
/*
When retrieving the values of list/select fields, your
formula will have to work with the current text value
of that field, which can vary by the current user’s
language, or can be changed arbitrarily at any time
as records or list entries are re-named. A more robust
practice may be to use the internal id of the value. You
can retrieve this by appending .id to the field’s script
id. For instance, instead of referencing {location}
which may be “Tuscon, AZ” today, but “South Tucson” tomorrow when the new North Tuscon branch
opens, you can retrieve {location.id} which for that
location, will always be ‘22’ no matter how it is
renamed.*/


/*
First, the syntax is very unforgiving. You may not use double quotes
(“) only single quotes (‘), or the expression will be invalid.*/
