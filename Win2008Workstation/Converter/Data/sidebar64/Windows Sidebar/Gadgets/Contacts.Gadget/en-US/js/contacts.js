////////////////////////////////////////////////////////////////////////////////
//
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
var BIDI = "";
var L_VIEWCONTACTDETAILS_text = "View contact details";
var L_BEGINSEARCH_text = "Type to search the current view";
var L_SENDEMAIL_text = "Click to send an email to ABC@MICROSOFT.COM";
var bMyFirstPass = true;
var g_IsDirectionLTR = true;

////////////////////////////////////////////////////////////////////////////////
//
// Initialize
//
////////////////////////////////////////////////////////////////////////////////
BIDI = document.getElementsByTagName("HTML")(0).dir;

function myOnLoad()
{
    try
    {
        setTimeout(reFilter);
        
        L_VIEWCONTACTDETAILS.title = L_VIEWCONTACTDETAILS_text;
        L_VIEWCONTACTDETAILSDOCKED.title = L_VIEWCONTACTDETAILS_text;
        tFilter.title = L_BEGINSEARCH_text;
        searchText.innerHTML = L_LOCEARCHWORD_text.innerHTML;

        if (BIDI == "rtl" || BIDI == "RTL")
        {
            g_IsDirectionLTR = false;
            BIDI = "rtl";
            document.getElementsByTagName("BODY")(0).dir = BIDI;
        }
        else
        {
            BIDI = "ltr";
        }
        
        searchImage.src = "images\\" + BIDI +"-stocks_search_rest.png";
         
        System.Gadget.onDock=Dock;
        System.Gadget.onUndock=unDock;
        Contacts=new daContacts();

        if (System.Gadget.docked)
        {
            Dock();
        }
        else
        {
            unDock();
        }   
    }
    catch(err)
    {
        Contacts=new daContacts();
        window.onload=reDock;
        function reDock()
        {
            document.body.offsetWidth<281?Dock():unDock();
        }
        window.onresize=function()
        {
            clearTimeout(this.tmz);
            this.tmz=setTimeout(reDock,100);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
//
//  Docked
//
////////////////////////////////////////////////////////////////////////////////
function Dock(){
    with(document.body.style)
        width=130,
        height=168,
        position="absolute",
        zIndex = -1;
        
    with(contactsBg.style)
        width=130,
        height=168,
        position="absolute",
        zIndex = -1;
        
    contactsBg.src="url(images/"+ BIDI + "-dock.png)";

    hd.style.display="none";
    hrLine.style.display = "none";
    hrLineDetail.style.display="none";
    divDetail.style.display="none"; 

    divList.style.display="";
    searchTab.style.display="";
    detailTab.style.display="";

    hrLineDetail.className = "hrLineDetail_docked_"+BIDI;
    divDetail.className = "divDetail_docked_" + BIDI;
    hList.className = "hList_docked_" + BIDI;
    divList.className = "divList_docked_" + BIDI ;
    sb.className = "sb_" + BIDI;
    searchText.className = "searchText_docked_"+BIDI;
    detailTab.className = "detailTab_docked_" + BIDI;
    searchTab.className = "searchTab_docked_" + BIDI;
    phoneNumberTable.className = "phoneNumberTable_docked_"+BIDI;
    hNoHits.className = "hNoHits_docked_"+BIDI;
  
}
////////////////////////////////////////////////////////////////////////////////
//
// UnDocked
//
////////////////////////////////////////////////////////////////////////////////
function unDock()
{
    with(document.body.style)
        width=309,
        height=198,
        osition="absolute",
        zIndex = -1;
        
    with(contactsBg.style)
        width=309,
        height=198,
        osition="absolute",
        zIndex = -1;
        
    contactsBg.src="url(images/"+ BIDI + "-desk.png)";
    
    hd.style.display="";
    divList.style.display="";
    hrLine.style.display = ""; 
    hrLineDetail.style.display="none";
    detailTab.style.display="none";
    searchTab.style.display="none";
    detailTab.style.display="none";
    divDetail.style.display="none";
    hd.className = "hd_undocked_" + BIDI;
    hList.className = "hList_undocked_" + BIDI;
    divList.className = "divList_undocked_" + BIDI ;
    sb.className = "sb_" + BIDI;   
    searchText.className = "searchText_undocked_"+BIDI;
    hrLine.className = "hrLine_undocked_" + BIDI;
    phoneNumberTable.className = "phoneNumberTable_undocked_"+BIDI;
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function showDockedList()
{
    contactsBg.src="url(images/" + BIDI + "-dock.png)";
    divDetail.style.display="none";
    divList.style.display = "";    
    hrLineDetail.style.display = "none";
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function showDetail()
{
    hrLineDetail.style.display="";
    divDetail.style.display="";
    
    divList.style.display = "none";
    contactsBg.src="url(images/" + BIDI + "-dock-detail.png)";
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function details(q)
{

    var name = q.contactName.split(" ");
    var fName = name[0];
    var lName = name[1]; 

    if(qsel)
    {
        qsel.className=qsel.className.replace(/ sel/,"");
    }
    
    qsel=q;
    
    qsel.className+=" sel";

    if (fName == undefined)
    {
        fName = "";
    }
    
    if (lName == undefined)
    {
        lName = "";
    }
    
    firstName.title = fName;
    firstName.innerText = fName;
    
    lastName.title = lName
    lastName.innerText = lName;
    
    email.innerText = q.email;
    
    if (q.email == "" | q.email == null)
    {
        email.href = "javascript:void(0);";
        email.title = "";
    }
    else
    {
        email.href = "mailto:" + q.email;
        email.title = L_SENDEMAIL_text.replace("ABC@MICROSOFT.COM",q.email);
    }
    
    hdImage.src = "gimage:///" + encodeURIComponent(q.filePath) + "?width=32&height=32";
   
    L_VIEWCONTACTDETAILS.filePath = q.filePath;
    
    deleteTableRows(phoneNumberTable);
    addTableRow(phoneNumberTable,"homePhone",q.homePhone);
    addTableRow(phoneNumberTable,"workPhone",q.workPhone);
    addTableRow(phoneNumberTable,"mobilePhone",q.mobilePhone);     
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function getDetailView(q)
{
    details(q);
    detailsDocked(q); 
    if (System.Gadget.docked)
    {
        contactsBg.src="url(images/" + BIDI + "-dock-detail.png)";    
        divList.style.display="none";
        divDetail.style.display="";
        hrLineDetail.style.display=""; 
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function detailsDocked(q)
{
    var name = q.contactName.split(" ");
    var firstName = name[0];
    var lastName = name[1]; 

    if(qsel)
    {
        qsel.className=qsel.className.replace(/ sel/,"");
    }
    
    qsel=q;
    qsel.className+=" sel";

    if (firstName == undefined)
    {
        firstName = "";
    }
    
    if (lastName == undefined)
    {
        lastName = "";
    }
    
    firstName_docked.title = firstName;
    firstName_docked.innerText = firstName;  
    
    lastName_docked.title = lastName;
    lastName_docked.innerText= lastName;
    
    email_docked.innerText = q.email;
    
    if (q.email == "" | q.email == null)
    {
        email_docked.href = "javascript:void(0);";
        email_docked.title = "";
    }
    else
    {
        email_docked.href = "mailto:" + q.email;
        email_docked.title = L_SENDEMAIL_text.replace("ABC@MICROSOFT.COM",q.email);
    }
    
    L_VIEWCONTACTDETAILSDOCKED.filePath = q.filePath;
    
    divDetailImage.src = "gimage:///" + encodeURIComponent(q.filePath) + "?width=32&height=32";
    
    deleteTableRows(phoneNumberTable_docked);
    addTableRow(phoneNumberTable_docked,"homePhone",q.homePhone);
    addTableRow(phoneNumberTable_docked,"workPhone",q.workPhone);
    addTableRow(phoneNumberTable_docked,"mobilePhone",q.mobilePhone);    
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function addTableRow(table,rowType,phoneNumber)
{
    var newRow = null;
    var newCell = null;
    var imageSource = "";
    var id = "";
    
    if (phoneNumber == "" || phoneNumber == undefined)
    {
        return null;
    }
    
    switch (rowType)
    {
        case "homePhone":
                imageSource = "images\\homePhone.png";
                id = "imageSource";                
                break;
        case "workPhone":
                imageSource = "images\\workPhone.png";
                id = "workPhone";                
                break;        
        case "mobilePhone":
                imageSource = "images\\mobilePhone.png";
                id = "mobilePhone";
                break;
    }
    
    if (imageSource != "")
    {
        newRow = table.insertRow();
        newCell = newRow.insertCell();
        newCell.innerHTML = "<image src='"+ imageSource + "'/>";
        newCell.className = "phoneStyle";
        newCell = newRow.insertCell();
        newCell.innerHTML = "<span class='phone' title='"+phoneNumber+"'></span>";
        newCell.childNodes[0].innerText = phoneNumber;
     }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function deleteTableRows(table)
{
    while (table.rows.length > 0)
    {
        table.deleteRow()
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function displayProperties(o)
{
    if (o.filePath != "" || o.filePath != undefined)
    {
        System.Shell.execute(o.filePath);
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function resetDisplayImage()
{
    searchImage.mode = "search";
    searchImage.src = "images\\" + BIDI +"-stocks_clear_rest.png";
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function reFilter()
{
    var re=new RegExp(tFilter.value,"i");
    var i=0;
    var a="";
   
    cksearchText(tFilter);
    hList.innerHTML="";
    
    if (tFilter.value.length > 0)
    {
        resetDisplayImage();
    }
    else
    {
        searchImage.mode = "";
        searchImage.src = "images\\"+BIDI+"-stocks_search_rest.png";
    }

    Contacts.enumAll(_f);  
 
    sbth.scrollTo(0);
    hNoHits.style.display=i?"none":"";
    tFilter.focus();
        
    createBlankLines();

    function _f(o)
    {
        var s = o.name;
        if(re.test(s))
        {           
            a="";
            a=" contactName='' title=''"+
              " email=''"+
              " workPhone=''"+
              " homePhone=''"+
               " mobilePhone=''"+
               " filePath=''"+
              (i++&1?" style='background-color:#d6e0fd'":"")+
              " onmouseover=omo(this) onkeydown=processKey(this) onclick=getDetailView(this)";
            hList.insertAdjacentHTML("beforeEnd","<q tabindex=1 unselectable=on "+a+">"+(re.source?s.replace(re,cite):s)+"</q>");
            hList.lastChild.contactName = o.name;
            hList.lastChild.title = o.name;
            hList.lastChild.email = o.email;
            hList.lastChild.workPhone = o.workPhone;
            hList.lastChild.homePhone = o.homePhone;
            hList.lastChild.mobilePhone = o.mobilePhone;
            hList.lastChild.filePath = o.filePath;
            function cite($1){
                return "<cite>"+$1+"</cite>";
            };        
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function evalDisplayProperties(o)
{
    var key = event.keyCode;
    
    if (key == 32)
    {
        displayProperties(o);
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function evalDisplayImage(o,mode)
{
    var key = event.keyCode;
    
    if (key == 32)
    {          
       displayImage(o,mode);
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function evalEmail(o)
{
    var key = event.keyCode;
    
    if (key == 32)
    {
        o.click();
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function evalShowDetail()
{
    var key = event.keyCode;
    
    if (key == 32)
    {
        showDetail();
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function evalShowDockedList()
{
    var key = event.keyCode;
    
    if (key == 32)
    {
        showDockedList();
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function processKey(o)
{
    var key = event.keyCode;
    
    if (key == 32)
    {
        getDetailView(o);
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function createBlankLines()
{
    var blankLine;
    var ii = hList.children.length - 6;
    var bRetVal = false;

    if (ii < 0)
    {
        bRetVal = true;
        ii = Math.abs(ii);
        for (var n=ii; n > 0 ; n-- )
            {   
                blankLine =" contactName='' title=''"+
                          " email=''"+
                          " workPhone=''"+
                          " homePhone=''"+
                           " mobilePhone=''"+
                           " filePath=''"+
                          (ii--&1?" style='background-color:#d6e0fd'":"");
                          
                        hList.insertAdjacentHTML("beforeEnd","<q  unselectable=on "+blankLine+"></q>");    
            }
    }
    return bRetVal;
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function daContacts()
{
    var contactMgr = null;
    var contacts = null;
    
    this.enumAll=function(cb)
    {
        contactMgr = System.ContactManager;
        contacts = contactMgr.Contacts;
        
        for(var i=0; i < contacts.count; i++)
        {
            cb(new Contact(contacts.item(i) ) );
        }
        
        if (bMyFirstPass)
        {
            if (hList.children.length > 0)
           {
              details( hList.children[0] );  
              detailsDocked( hList.children[0] );           
           }
           bMyFirstPass = false;
        }
        
       
    }
    
    this.Contact=function Contact(contact)
    {
        this.name = contact.name;
        this.first= contact.name;
        this.last= contact.name;
        try
        {
            this.email= contact.defaultEmail;
        }
        catch(e)
        {
            this.email = "";
        }
        this.phone= contact.workPhone;
        this.workPhone = contact.workPhone;
        this.homePhone = contact.homePhone;
        this.mobilePhone = contact.mobilePhone;
        this.filePath = contact.filePath;  
      
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function cksearchText(o)
{
    if (o.value == "")
    {
        searchText.style.display = "";
    }
    else
    {
        searchText.style.display = "none";
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function omo(e)
{
    e.className+=" hot";
    e.onmouseout=function()
    {
        e.className=e.className.replace(/ hot/,"");
        e.onmouseout=null;
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
function displayImage(o,state)
{
    switch (state)
    {
        case "over": o.src = (o.mode=="" ? "images\\" + BIDI +"-stocks_search_hover.png"   : "images\\" + BIDI +"-stocks_clear_hover.png");break;
        case "out" : o.src = (o.mode=="" ? "images\\"+BIDI+"-stocks_search_rest.png"    : "images\\" + BIDI +"-stocks_clear_rest.png");break;
        case "down": o.src = (o.mode=="" ? "images\\" + BIDI +"-stocks_search_pressed.png" : "images\\" + BIDI +"-stocks_clear_pressed.png");break;
    }
    
    if (o.mode == "search" && state == "up")
    {
        tFilter.value = "";
        reFilter();
    }
}


var Contacts;
var qsel;

////////////////////////////////////////////////////////////////////////////////
//
// Filter
//
////////////////////////////////////////////////////////////////////////////////
tFilter.onkeyup=function()
{
    clearTimeout(tFilter.tm);
    tFilter.tm=setTimeout(reFilter,300);
}

////////////////////////////////////////////////////////////////////////////////
//
// Scroll bar
//
////////////////////////////////////////////////////////////////////////////////
sbth.scrollTo=function(y)
{
    if(hList.scrollHeight>hList.clientHeight)
    {
        var maxy=this.offsetParent.clientHeight-this.offsetHeight;
        y=Math.min(maxy,Math.max(0,y));
        hList.scrollTop=(hList.scrollHeight-hList.clientHeight)*y/maxy;
        this.style.posTop=y;
        this.parentElement.style.display="";
    }
    else
    {
        this.parentElement.style.display="none";
    }
}
////////////////////////////////////////////////////////////////////////////////
sbth.onmousedown=function()
{
    event.cancelBubble=true;
    this.setCapture();
    var dy=event.y-this.style.posTop;
    this.onmousemove=function()
    {
        this.scrollTo(event.y-dy);
    }
    this.onmouseup=function()
    {
        this.releaseCapture();
        if(document.elementFromPoint(event.x,event.y)!=this)
            sb.onmouseout();
        this.onmousemove=null;
    }
}
////////////////////////////////////////////////////////////////////////////////
sb.onmouseover=function fadeIn()
{
    clearTimeout(sb.tm);
    if(sb.filters(0).opacity<90){
        sb.filters(0).opacity+=10;
        sb.tm=setTimeout(fadeIn,25);
    }
}
////////////////////////////////////////////////////////////////////////////////
sb.onmouseout=function()
{
    clearTimeout(sb.tm);
    
    sb.tm=setTimeout(function fadeOut()
    {
        if(sb.filters(0).opacity>50)
        {
            sb.filters(0).opacity-=10;
            sb.tm=setTimeout(fadeOut,25);
        }
    },
    sb.filters(0).opacity<90?0:750);
}
////////////////////////////////////////////////////////////////////////////////
sb.onmousedown=sb.ondblclick=function()
{
    var dy=sbth.offsetHeight;
    
    if(event.offsetY<sbth.offsetTop)
    {
        dy=-dy;
    }
    
    sbth.scrollTo(sbth.offsetTop+dy);
}
////////////////////////////////////////////////////////////////////////////////
sb.onmousewheel=hList.onmousewheel=function()
{
    var dy=sbth.offsetHeight/(hList.scrollHeight/hList.clientHeight-1);
    
    sbth.scrollTo(sbth.offsetTop+(event.wheelDelta<0?dy:-dy));
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
document.ondragstart=document.onselectstart=function()
{
    return event.srcElement.tagName=="INPUT";
}
////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////
document.body.onfocus=function()
{
    status+=event.fromElement?event.fromElement.tagName+"!":"?";
    setTimeout(tFilter.focus);
}
