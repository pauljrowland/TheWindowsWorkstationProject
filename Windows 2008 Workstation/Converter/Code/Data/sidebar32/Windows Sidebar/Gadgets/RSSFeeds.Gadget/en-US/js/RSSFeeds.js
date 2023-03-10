////////////////////////////////////////////////////////////////////////////////
//
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
// LOCALIZABLE VARIABLES
//
////////////////////////////////////////////////////////////////////////////////
var L_MS_ERRORMESSAGE           = "The Internet Explorer Feedstore is unavailable.";
var L_RRFD_ERRORMESSAGE         = "The gadget displays feeds you've subscribed to in Internet Explorer.";
var L_FCE_ERRORMESSAGE          = "View headlines";
var L_FCEHOVER_ERRORMESSAGE     = "View headlines (turns on automatic feed updates)";
var L_LOADING_TEXT              = "Loading";
var L_SHOWNEXT_TEXT             = "Next";
var L_SHOWPREV_TEXT             = "Previous";
var L_NAVTITLE_TEXT             = "Headlines ";
var L_TITLEFORDROP_TEXT         = "All feeds";
var L_ARTICLES_TEXT             = " headlines";
var L_LINKTEXT_TEXT             = "What are feeds?";
var articleArray                = new Array(10, 20, 40, 100);
var L_ARTICLES_TEXT             = new Array();
L_ARTICLES_TEXT[0]              = "10 headlines";
L_ARTICLES_TEXT[1]              = "20 headlines";
L_ARTICLES_TEXT[2]              = "40 headlines";
L_ARTICLES_TEXT[3]              = "100 headlines";
////////////////////////////////////////////////////////////////////////////////
//
// GLOBAL VARIABLES
//
////////////////////////////////////////////////////////////////////////////////
var g_msFeedManagerProgID       = "Microsoft.FeedsManager";
var g_msFeedManager             = null;
var g_returnFeed                = null;
var g_viewElements              = null;
var g_noFeeds                   = true;
var g_downloadErrorFlag         = false;
var g_feedNameLength;
var g_showInBrowser             = "";
var g_currentFeedPath           = "";
var g_currentFeedUrl            = "";
var g_totalViewableItems        = "";
var g_feedTitleCharLength       = 36;
var g_stringTitleLength         = 20;
var g_countToView               = 4;
var g_feedTotal                 = 0;
var g_currentArrayIndex         = 0;
var g_timerMilliSecs            = 10000;
var g_loadingMilliSecs          = 10000;
var g_lastCalledArrayIndex; 
var g_lastClickedUrl;
var g_feedURL;
var g_feedTitle;
var g_feedForFlyout;
var g_gadgetErrorFlag;
var g_timer;
var g_timerFlag;
var g_drawerTimer;
var g_alphaInTimer;
var g_loadFirstTime;
var g_feedClicked;
var g_feedLocalID;
var g_timerFlyoutFlag;
////////////////////////////////////////////////////////////////////////////////
//
// System - Object Model settings
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
// SETTINGS
//
////////////////////////////////////////////////////////////////////////////////
function loadSettings()
{
    var tempSettings = new getRssSettings();
    g_currentFeedPath = tempSettings.rssFeedPath;
    g_currentFeedUrl  = tempSettings.rssFeedUrl;
    g_totalViewableItems = tempSettings.rssFeedCount;
    g_loadFirstTime = tempSettings.loadFirstTime;
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function createFeedDropDown()
{ 
    loadMSFeedManager();  
    AddFeedToDropDown(L_TITLEFORDROP_TEXT,"defaultGadg");
    getFeedsFolders(g_msFeedManager.RootFolder);
    g_msFeedManager = null;
    for(var i = 0; i < L_ARTICLES_TEXT.length; i++)
    {
        rssTotalsSelection.options[i]=new Option(L_ARTICLES_TEXT[i], articleArray[i]);
        rssTotalsSelection.options[i].title = L_ARTICLES_TEXT[i];
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function getFeedsFolders(folderToAdd)
{
    var currentFolder;
    var currentFeeds;
    try
    {
        if (folderToAdd.IsRoot)
        {
            currentFeeds = folderToAdd.Feeds;
            for (var feedIndex = 0; feedIndex < currentFeeds.Count; feedIndex++)
            {
                AddFeedToDropDown(currentFeeds.Item(feedIndex).Name, currentFeeds.Item(feedIndex).Url);
            }
            getFeedsFolders(folderToAdd.SubFolders);
            return;
        }
        for (var folderIndex = 0; folderIndex < folderToAdd.Count; folderIndex++)
        {
            currentFolder = folderToAdd.Item(folderIndex);
            currentFeeds = currentFolder.Feeds;
            AddFeedToDropDown(currentFolder.Path, currentFolder.Path);
            for (var feedIndex = 0; feedIndex < currentFeeds.Count; feedIndex++)
            {
                AddFeedToDropDown(currentFeeds.Item(feedIndex).Path, currentFeeds.Item(feedIndex).Url);
            }
            if (currentFolder.Subfolders.Count > 0)
            {
                getFeedsFolders(currentFolder.Subfolders);
            }
         }
     }
     catch(e)
     {
        return;
     }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function AddFeedToDropDown(_feedText, _feedValue)
{
    var tempChckSettings = new getRssSettings();
    var objEntry = document.createElement("option");
    objEntry.text = _feedText;
    objEntry.value = _feedValue; 
    objEntry.title = _feedText;
    if(_feedText == tempChckSettings.rssFeedPath)
    {
        objEntry.selected = true;
    }
    rssFeedSelection.add(objEntry);
}
////////////////////////////////////////////////////////////////////////////////
//
// GADGET
//
////////////////////////////////////////////////////////////////////////////////
function viewElementsObject()
{
    this.FeedItems = new Array();
    this.FeedTitleLink = document.getElementById("FeedTitleLink");
    this.FeedTitleCount = document.getElementById("FeedTitleCount");
    for(var i = 0; i < 4; i++)
    {
        var newElement = document.getElementById("FeedItemLink" + i);
        newElement.onfocusin = newElement.onmouseover;
        newElement.onfocusout = newElement.onmouseout;
        newElement.hideFocus = true;
        this.FeedItems.push(newElement);
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// set's alt tabs for navigation;
//
////////////////////////////////////////////////////////////////////////////////
function setAltLabels()
{    
    buttonRightNarrator.alt = buttonRightNarrator.title = L_SHOWNEXT_TEXT;
    buttonLeftNarrator.alt = buttonLeftNarrator.title = L_SHOWPREV_TEXT;
}
////////////////////////////////////////////////////////////////////////////////
//
// Clear HTML elements from ViewElements Object
//
////////////////////////////////////////////////////////////////////////////////
function clearViewElements()
{
    for(i=0; i < 4; i++)
    {
        g_viewElements.FeedItems[i].innerHTML = "";
        g_viewElements.FeedItems[i].href = "";
        eval("FeedItemName"+i).innerHTML = "";
        eval("FeedItemName"+i).style.backgroundColor = "";
        eval("FeedItemDate"+i).innerHTML = "";
        eval("FeedItemDate"+i).style.backgroundColor = "";
        eval("FeedItemLink"+i).style.textOverflow = "";
        eval("FeedItemLink"+i).style.overflow = "";  
        eval("FeedItemLink"+i).style.whiteSpace = "";
        eval("FeedItemLink"+i).style.width = "0px";
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function startTimer()
{
    if(g_timerFlag)
    {
        stopTimer();
        g_timer = setInterval(setNextViewItems, g_timerMilliSecs);
    }
 }
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function stopTimer()
{
    if(g_timerFlag)
    {
        clearInterval(g_timer);
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// create New FeedItem Object which gets pushed into MakeFeed.FeedItems
//
////////////////////////////////////////////////////////////////////////////////
function feedItem(_feedItemName, _feedItemUrl, _feedItemIsRead, _feedItemID, _feedItemParent, _feedItemParentPath, _feedItemDate)
{     
    this.feedItemDate       = _feedItemDate;
    this.feedItemName       = _feedItemName;
    this.feedItemUrl        = _feedItemUrl;
    this.feedItemIsRead     = _feedItemIsRead;
    this.feedItemID         = _feedItemID;
    this.feedItemParent     = _feedItemParent;
    this.feedItemParentPath = _feedItemParentPath;
}
////////////////////////////////////////////////////////////////////////////////
//
// create New MakeFeed Object
//
////////////////////////////////////////////////////////////////////////////////
function makeFeed(_feedName, _feedUrl, _feedCount)
{
    this.feedItems      = new Array();
    this.feedName       = _feedName;
    this.feedUrl        = _feedUrl;
    this.feedCount      = _feedCount;
}
////////////////////////////////////////////////////////////////////////////////
//
// determine if gadget is visible
//
////////////////////////////////////////////////////////////////////////////////
function checkVisibility()
{
    isVisible = System.Gadget.visible;
    if (!isVisible)
    {
        stopTimer();
    }
    if(isVisible)
    {
        startTimer();
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// Gadget specific settings
// determine if gadget is in sidebar - docked or on the desktop - undocked
//
////////////////////////////////////////////////////////////////////////////////
function checkStateLite()
{
    if(!System.Gadget.docked) 
    {
        g_curLinkWidth = "250px";  
        with(document.body.style)
        {   
            height = "232px";
            width = "296px";
        }
        with(rssfeedBg.style)
        {
            height = "232px";
            width = "296px";
        }  
        rssfeedBg.src = "url(images/rssBackBlue_undocked.png)";
    } 
    else if (System.Gadget.docked)
    {
        g_curLinkWidth = "113px"; 
        with(document.body.style)
        {
            height = "173px";
            width = "130px";
        }
        with(rssfeedBg.style)
        {
            height = "173px";
            width = "130px";
        }  
        rssfeedBg.src = "url(images/rssBackBlue_docked.png)";
    }
}

////////////////////////////////////////////////////////////////////////////////
//
// Gadget specific settings
// determine if gadget is in sidebar - docked or on the desktop - undocked
//
////////////////////////////////////////////////////////////////////////////////
function checkState()
{
    if(!System.Gadget.docked) 
    {
        undockedState();
    } 
    else if (System.Gadget.docked)
    {
        dockedState(); 
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// Gadget specific settings
// determine if gadget is in sidebar - docked or on the desktop - undocked
//
////////////////////////////////////////////////////////////////////////////////
function checkFlyforTimer()
{
    if(!System.Gadget.Flyout.show)
    {
        startTimer();    
    }
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function loadMain()
{
    // Check direction
    var pageDir = document.getElementsByTagName("html")[0].dir;
    
    if (pageDir == "rtl")
    {
        buttonLeftNarrator.style.right = "5px";
        buttonRightNarrator.style.left = "-1px";
    }
    else
    {
        buttonLeftNarrator.style.left = "2px";
        buttonRightNarrator.style.right = "2px";
    }
    g_timerFlag = true;
    g_gadgetErrorFlag = 0;
    loadSettings();
    g_viewElements = new viewElementsObject();
    g_currentArrayIndex = 0; 
    setAltLabels();
    System.Gadget.visibilityChanged = checkVisibility;
    System.Gadget.Flyout.file = "flyout.html";
    System.Gadget.onShowSettings = loadSettings;    
    checkStateLite(); 
    showSpinner('35%');
    setTimeout(loadData, 1000);
    document.body.focus();
}
////////////////////////////////////////////////////////////////////////////////
//
// GADGET FUNCTIONS
//
////////////////////////////////////////////////////////////////////////////////
function loadData()
{              
    errorTextHldr.style.visibility = "hidden"; 
    navHolder.style.visibility = "visible";
    refreshRssFeedData();
    checkState();        
    checkFlyforTimer();    
    System.Gadget.onUndock = checkState;
    System.Gadget.onDock = checkState;  
}
////////////////////////////////////////////////////////////////////////////////
//
// Check Path Get path
//
////////////////////////////////////////////////////////////////////////////////
function refreshRssFeedData()
{
    if(g_loadFirstTime == "defaultGadget")
    {
        displayMessage(L_FCE_ERRORMESSAGE, "");  
        g_timerFlag = false;
    }
    else
    {    
        loadMSFeedManager();
        g_feedTotal = 0;
        countFeeds(g_msFeedManager.RootFolder);
        if(g_feedTotal > 0)
        {
            g_returnFeed = null;
            g_returnFeed = new makeFeed("", "", "");        
            if (g_currentFeedPath == "")
            {
                getAllRssFeedItems(g_msFeedManager.RootFolder);
            }
            else
            {
                if(g_msFeedManager.ExistsFeed(g_currentFeedPath) || g_msFeedManager.ExistsFolder(g_currentFeedPath))
                {
                    getRssFeedItems(g_currentFeedPath);
                }
                else
                {
                    displayMessage(L_RRFD_ERRORMESSAGE, "");
                    g_timerFlag = false;
                    g_msFeedManager = null;
                    return null;
                }
            }
            g_returnFeed.feedItems.sort(sortDates);
            g_returnFeed.feedItems.reverse();
            setNextViewItems();
        }
        else
        {
            displayMessage(L_RRFD_ERRORMESSAGE, "");
            g_timerFlag = false;
        }
        g_msFeedManager = null;
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function sortDates(a,b)
{
    return(b.feedItemDate<a.feedItemDate)-(a.feedItemDate<b.feedItemDate);
}
////////////////////////////////////////////////////////////////////////////////
//     
// Load feed from FeedManager
//
////////////////////////////////////////////////////////////////////////////////
function loadMSFeedManager()
{        
    // Make sure we have a handle to the feed manager
    if (g_msFeedManager == null)
    {
        try
        {
            g_msFeedManager = new ActiveXObject(g_msFeedManagerProgID);
            if (g_msFeedManager == null)
            {
                displayMessage(L_MS_ERRORMESSAGE);
                g_timerFlag = false;
                return null;
            }
         }
         catch(e)
         {
            displayMessage(L_MS_ERRORMESSAGE); 
            g_timerFlag = false;
         }
    }    
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function getAllRssFeedItems(folderToCheck)
{    
    getFeeds(folderToCheck);
    for(var i=1;i<=folderToCheck.Subfolders.Count;i++)
    {
       getAllRssFeedItems(folderToCheck.Subfolders.Item(i-1));
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function countFeeds(folderToCheck)
{    
    g_feedTotal = g_feedTotal + folderToCheck.Feeds.Count;
    for(var i=1;i<=folderToCheck.Subfolders.Count;i++)
    {
       countFeeds(folderToCheck.Subfolders.Item(i-1));  
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function getFeeds(folderToAdd)
{
    var currentFolder;
    var currentFeeds;
    
    if (folderToAdd.IsRoot)
    {
        currentFeeds = folderToAdd.Feeds;
        for (var feedIndex = 0; feedIndex < currentFeeds.Count; feedIndex++)
        {
            getRssFeedItems(currentFeeds.Item(feedIndex).Path);
        }
        getFeeds(folderToAdd.SubFolders);
        return;
    }
    
    for (var folderIndex = 0; folderIndex < folderToAdd.Count; folderIndex++)
    {
        currentFolder = folderToAdd.Item(folderIndex);
        currentFeeds = currentFolder.Feeds;
        for (var feedIndex = 0; feedIndex < currentFeeds.Count; feedIndex++)
        {
            getRssFeedItems(currentFeeds.Item(feedIndex).Path);
        }
        if (currentFolder.Subfolders.Count > 0)
        {
            getFeeds(currentFolder.Subfolders);
        }
    }
    
    if (g_returnFeed.feedItems < 1)
    {
        displayMessage(L_FCE_ERRORMESSAGE, "");
        g_timerFlag = false;
    }
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function getFirstFeed(folderToCheck)
{
    if(folderToCheck.Feeds.Count > 0)
    {
        for(var i=0;i<folderToCheck.Feeds.Count;i++)
        {
           if(g_msFeedManager.ExistsFeed(folderToCheck.Feeds.Item(i).path))
           {
                g_currentFeedPath = folderToCheck.Feeds.Item(i).path;
                return null;
           }
        }
    }
    for(var i=1;i<=folderToCheck.Subfolders.Count;i++)
    {
       if(g_currentFeedPath != "")
       {
            return null;
       }
       getFirstFeed(folderToCheck.Subfolders.Item(i-1));
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//  Add Feed Items to an Array, then start to release feedsmanager, feeds first
//
////////////////////////////////////////////////////////////////////////////////
function getRssFeedItems(Path)
{
    if(g_msFeedManager.ExistsFolder(Path))
    {
        getRssByFolder(Path);
    }
    else if(g_msFeedManager.ExistsFeed(Path))
    {
        getRssByFeed(Path);
    } 
}

////////////////////////////////////////////////////////////////////////////////
//
//  Bug #1779555: NULL Bstr can cause MS Feed manager crash because it doesn't
//                accept NULL BSTR. Feed team won't change in their code. So we 
//                have to make sure no NULL BSTR passed into GetFeed().
//              
//  !!! Always call safeGetFeed, NOT g_msFeedManager.GetFeed() !!!
//
////////////////////////////////////////////////////////////////////////////////
function safeGetFeed(Path)
{
    if (Path == null || Path.Length == 0)
    {
        return g_msFeedManager.GetFeed("");
    }
    else
    {
        return g_msFeedManager.GetFeed(Path);
    }
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function getRssByFeed(Path)
{
    try
    {
        var feed = safeGetFeed(Path);
        if(feed.Items.Count > 0)
        {
            for (var i = 0; i < feed.Items.Count; i++)
            {
                var tempFeedTitle = feed.Items.item(i).Title;
                if(tempFeedTitle != "")
                {
                    var tempFeedLink              = feed.Items.item(i).Link;
                    var tempFeedIsRead            = feed.Items.item(i).IsRead;
                    var tempFeedItemID            = feed.Items.item(i).LocalId;
                    var tempFeedItemParent        = feed.name;
                    var tempFeedItemParentPath    = feed.path;
                    var tempFeedItemDate          = feed.Items.item(i).PubDate;
                    var tempFeedItem              = new feedItem(
                                                        tempFeedTitle, 
                                                        tempFeedLink, 
                                                        tempFeedIsRead, 
                                                        tempFeedItemID, 
                                                        tempFeedItemParent,
                                                        tempFeedItemParentPath,
                                                        tempFeedItemDate
                                                    ); 
                    g_returnFeed.feedItems.push(tempFeedItem);
                }
            }
            g_returnFeed.feedCount = '&nbsp;(<b>'+feed.UnreadItemCount+'</b>)&nbsp;';
            g_returnFeed.feedName = feed.name;
            g_returnFeed.feedUrl = feed.url;
            feed = null;
        } 
    }
    catch(e)
    {
        return;
    }

}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function getRssByFolder(Path)
{
    var countFeeds = 0;
    var emptyFeeds = 0;
    var folder = g_msFeedManager.GetFolder(Path);
    for (var folderIndex = 0; folderIndex < folder.Feeds.Count; folderIndex++)
    {
        var feed = safeGetFeed(folder.Feeds.item(folderIndex).Path);
        if(feed.Items.Count > 0)
        {
            for (var i = 0; i < feed.Items.Count; i++)
            {
                    var tempFeedTitle = feed.Items.item(i).Title;
                    if(tempFeedTitle != "")
                    {
                        var tempFeedLink              = feed.Items.item(i).Link;
                        var tempFeedIsRead            = feed.Items.item(i).IsRead;
                        var tempFeedItemID            = feed.Items.item(i).LocalId;
                        var tempFeedItemParent        = feed.name;
                        var tempFeedItemParentPath    = feed.path;
                        var tempFeedItemDate          = feed.Items.item(i).PubDate;
                        var tempFeedItem              = new feedItem(
                                                            tempFeedTitle, 
                                                            tempFeedLink, 
                                                            tempFeedIsRead, 
                                                            tempFeedItemID, 
                                                            tempFeedItemParent,
                                                            tempFeedItemParentPath,
                                                            tempFeedItemDate
                                                        );
                        g_returnFeed.feedItems.push(tempFeedItem);
                    }
            }
            countFeeds = countFeeds + feed.UnreadItemCount;
            feed = null;     
        }
        else
        {
            emptyFeeds = emptyFeeds + 1;
        }
    }
    if(emptyFeeds < folder.Feeds.Count)
    {
        g_returnFeed.feedCount = '&nbsp;(<b>'+countFeeds+'</b>)&nbsp;';
        g_returnFeed.feedName = folder.name;
        g_returnFeed.feedUrl = '';  
        folder=null
    }
    else
    {
        displayMessage(L_FCE_ERRORMESSAGE, "");  
        g_timerFlag = false;
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function setPreviousViewItems()
{
    g_currentArrayIndex = g_currentArrayIndex - (g_countToView * 2);
    setNextViewItems();
}
////////////////////////////////////////////////////////////////////////////////
//
// Add Feed Items to View Elements HTML Object to be displayed in Gadget
//
////////////////////////////////////////////////////////////////////////////////
function setNextViewItems()
{
    if(g_timerFlag)
    {
        var headlineCount = g_returnFeed.feedItems.length;
        var titleTextLong = g_returnFeed.feedName;
        g_lastCalledArrayIndex = g_currentArrayIndex;
        if(g_totalViewableItems < headlineCount)
        {
            headlineCount = g_totalViewableItems;
        }
        if(g_currentArrayIndex > g_returnFeed.feedItems.length || g_currentArrayIndex >= headlineCount)
        {  
            g_currentArrayIndex = 0;
            refreshRssFeedData();
            return;
        } 
        if(g_currentArrayIndex < 0)
        {    
            var countDiff = headlineCount%g_countToView;
            if(countDiff == 0)
            { 
                g_currentArrayIndex = headlineCount - g_countToView;
            }
            else
            {
                g_currentArrayIndex = headlineCount - countDiff;
            }
            refreshRssFeedData();
            return;
        } 
        clearViewElements();
        System.Gadget.settingsUI = "settings.html";
        for(var i = 0; i < g_countToView; i++)
        {
            var positionContentArray = new Array();
            positionContentArray[0] = (g_currentArrayIndex + 1) - i;
            positionContentArray[1] = "-";
            positionContentArray[2] = g_currentArrayIndex + 1;
            var pageDir = document.getElementsByTagName("html")[0].dir;
            if (pageDir == "rtl")
            {
                 positionContentArray.reverse();
            }    
            var positionContent = positionContentArray[0]+positionContentArray[1]+positionContentArray[2];
            if(g_currentArrayIndex == headlineCount)
            {
                for (var j = i; j < g_countToView; j++)
                {
                    if(j < g_countToView)
                    {
                        eval("FeedItem"+j).style.border = "";
                    }
                    g_currentArrayIndex++;
                }
                return;
            }
            
            eval("FeedItem"+i).style.borderBottom = "dotted 1px #3b4458";
            eval("FeedItemLink"+i).style.textOverflow = "ellipsis";
            eval("FeedItemLink"+i).style.overflow = "hidden";  
            eval("FeedItemLink"+i).style.whiteSpace = "nowrap"; 
            eval("FeedItemLink"+i).style.width = g_curLinkWidth;
            positionNumbers.innerHTML = positionContent;
            var countNow = g_returnFeed.feedItems[g_currentArrayIndex].feedItemCount;
            var feedItemName = g_returnFeed.feedItems[g_currentArrayIndex].feedItemName;
            g_viewElements.FeedItems[i].setAttribute("title",feedItemName);
            if(!g_returnFeed.feedItems[g_currentArrayIndex].feedItemIsRead)
            {
                feedItemName = "<b>"+feedItemName+"</b>";
            }
            g_viewElements.FeedItems[i].innerHTML = feedItemName;
            g_viewElements.FeedItems[i].href = g_returnFeed.feedItems[g_currentArrayIndex].feedItemUrl;
            g_viewElements.FeedItems[i].setAttribute("name", g_returnFeed.feedItems[g_currentArrayIndex].feedItemParentPath);
            g_viewElements.FeedItems[i].setAttribute("localId", g_returnFeed.feedItems[g_currentArrayIndex].feedItemID);            
            eval("FeedItemName"+i).innerHTML = g_returnFeed.feedItems[g_currentArrayIndex].feedItemParent;
            eval("FeedItemName"+i).setAttribute("title",g_returnFeed.feedItems[g_currentArrayIndex].feedItemParent);                
            eval("FeedItemName"+i).style.textOverflow = "ellipsis";
            eval("FeedItemName"+i).style.overflow = "hidden";  
            eval("FeedItemName"+i).style.whiteSpace = "nowrap"; 
            eval("FeedItemDate"+i).innerHTML = g_returnFeed.feedItems[g_currentArrayIndex].feedItemDate;
            eval("FeedItemDate"+i).setAttribute("title",g_returnFeed.feedItems[g_currentArrayIndex].feedItemDate);
            eval("FeedItemDate"+i).style.overflow = "hidden";        
            g_currentArrayIndex++;
            clearBack();
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function displayMessage(errorText, urlForTitle)
{
    System.Gadget.settingsUI = "";
    clearBorder();
    stopTimer();
    clearViewElements(); 
    errorTextHldr.style.visibility = "visible";
    errorTextHldr.style.textAlign = "center";
    navHolder.style.visibility = "hidden";
    if(errorText == L_FCE_ERRORMESSAGE)
    {
        errorTextHldr.style.top = "30%";
        errorTextLink.innerHTML = "<p style=\"margin:0px;padding-bottom:5px;\">"
                                + "<img src=\"images/rssLogo.gif\" border=\"0\" />"
                                + "</p>"+errorText;
        errorTextLink.className = "textView";
        errorTextLink.style.cursor = "pointer";
        errorTextLink.title = L_FCEHOVER_ERRORMESSAGE;
        g_gadgetErrorFlag = 1;
    }
    else
    {
        errorTextHldr.style.top = "15%";
        errorTextHldr.style.width = "85%";
        errorTextHldr.style.left = "7%";
        errorTextHldr.innerHTML = errorText; 
        errorTextHldr.innerHTML += "<p style=\"margin:0px;padding-top:10px;\">"
                                 + "<a id=\"errorLink\" href=\"http://go.microsoft.com/fwlink/?LinkId=69153\">"
                                 + L_LINKTEXT_TEXT+"</a></p>";
        g_gadgetErrorFlag = 0;
        return null;
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function clearBorder()
{
    for (var i = 0; i < 4; i++)
    {                   
        if(eval("FeedItem"+i) != undefined)
        {
            eval("FeedItem"+i).style.border = "";
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function showSpinner(posTop)
{
    clearViewElements();
    navHolder.style.visibility = "hidden";
    clearBorder();
    errorTextLink.innerHTML = "<p style=\"margin:0px;padding-bottom:10px;\">"
                            + "<img border=\"0\" src=\"images/16-on-black.gif\" />"
                            + "</p>"+L_LOADING_TEXT;
    errorTextLink.className = "textLoad";
    errorTextLink.style.cursor = "default";
    errorTextLink.title = L_LOADING_TEXT;
    errorTextHldr.style.visibility = "visible";
    errorTextHldr.style.textAlign = "center";
    errorTextHldr.style.top = posTop;
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function OnItemClick()
{        
    if(g_gadgetErrorFlag > 0)
    {
        if(g_gadgetErrorFlag == 1)
        {
           System.Gadget.Settings.write("rssFeedPath", "");
           showSpinner('35%');
           this.blur();
           loadMSFeedManager();
           downloadAllFeeds(g_msFeedManager.RootFolder);
           g_msFeedManager = null;          
           g_loadFirstTime = "existingGadget";
           System.Gadget.Settings.write("loadFirstTime", g_loadFirstTime);
           if(g_downloadErrorFlag)
           {
                setTimeout(loadMain, g_loadingMilliSecs);
           }
           else
           {
                loadMain();
           }
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function downloadAllFeeds(folderToAdd)
{ 
    loadMSFeedManager();
    var currentFolder;
    var currentFeeds;        
    var feedDefault;            
    
    if (folderToAdd.IsRoot)
    {
        currentFeeds = folderToAdd.Feeds;
        for (var feedIndex = 0; feedIndex < currentFeeds.Count; feedIndex++)
        {
            try
            {
                feedDefault = safeGetFeed(currentFeeds.Item(feedIndex).Path);
            }
            catch(e)
            {
                displayMessage(L_RRFD_ERRORMESSAGE, "");
                g_timerFlag = false;
            }
            try
            {
                feedDefault.Download();
            }
            catch(e)
            {
                g_downloadErrorFlag = true;
            }
        }
        downloadAllFeeds(folderToAdd.SubFolders);
        return;
    }
    for (var folderIndex = 0; folderIndex < folderToAdd.Count; folderIndex++)
    {
        currentFolder = folderToAdd.Item(folderIndex);
        currentFeeds = currentFolder.Feeds;
        for (var feedIndex = 0; feedIndex < currentFeeds.Count; feedIndex++)
        {
            try
            {
                feedDefault = safeGetFeed(currentFeeds.Item(feedIndex).Path);
            }
            catch(e)
            {
                displayMessage(L_RRFD_ERRORMESSAGE, "");
                g_timerFlag = false;
            }
            try
            {
                feedDefault.Download();
            }
            catch(e)
            {
                g_downloadErrorFlag = true;
            }
        }
        if (currentFolder.Subfolders.Count > 0)
        {
            downloadAllFeeds(currentFolder.Subfolders);
        }
    }
    if(g_msFeedManager.BackgroundSyncStatus == 0)
    {
        g_msFeedManager.BackgroundSync(1);
    }
    g_msFeedManager = null;
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function showFlyout(feedAll)
{
    g_feedForFlyout = feedAll.name;
    g_feedURL = feedAll.href;
    g_feedTitle = feedAll.innerText;
    g_feedID = feedAll;
    g_feedLocalId = feedAll.localId;
    g_feedID.innerHTML=g_feedTitle;
    g_timerFlyoutFlag = true;
    markAsRead();
    if(event.type == "dblclick")
    {
        System.Gadget.Flyout.show = false;
        g_lastClickedUrl = "";
        System.Shell.execute(g_feedURL);
        g_timerFlyoutFlag = false;
    }
    else if (event.type == "click")
    {
        if(g_feedURL == g_lastClickedUrl)
        {
            stopTimer();
            System.Gadget.Flyout.show = false;
            g_lastClickedUrl = "";
            g_timerFlyoutFlag = false;
        }    
        if(System.Gadget.Flyout.show)
        {
            addContentToFlyout();
            g_lastClickedUrl = feedAll.href;
        }
        else
        {
            System.Gadget.Flyout.show = true;
            System.Gadget.Flyout.onShow = function()
            {
                stopTimer();
                addContentToFlyout();
            }
            System.Gadget.Flyout.onHide = function()
            {
                g_feedClicked = null;
                clearBack();
                if(g_timerFlyoutFlag)
                {
                    startTimer();
                }
                g_timerFlyoutFlag = true;
            }
            g_lastClickedUrl = feedAll.href;
        }

    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function markAsRead()
{
    for(var i = 0; i < g_returnFeed.feedItems.length; i++)
    {   
        if(g_returnFeed.feedItems[i].feedItemUrl == g_feedURL)
        {
            g_returnFeed.feedItems[i].feedItemIsRead = true;
        }
    }
    loadMSFeedManager();
    try
    {
        var currentFeeds = safeGetFeed(g_feedForFlyout);
        var currentFeed = currentFeeds.getItem(g_feedLocalId);
        currentFeed.IsRead = true;
    }
    catch(e)
    {
    }
    g_msFeedManager = null;
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function hideFlyout()
{
   System.Gadget.Flyout.show = false;
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function addContentToFlyout()
{
    try
    {
        if(System.Gadget.Flyout.show)
        {
            var flyoutDiv =  System.Gadget.Flyout.document;
            loadMSFeedManager();
            try
            {
                var currentFeeds = safeGetFeed(g_feedForFlyout);
                var currentFeed = currentFeeds.getItem(g_feedLocalId);
                var tempTitle = currentFeed.title;
                flyoutDiv.getElementById("flyoutTitleLink").innerHTML = tempTitle;
                flyoutDiv.getElementById("flyoutTitleLink").href = g_feedURL;
                flyoutDiv.getElementById("flyoutTitleLink").setAttribute("title", tempTitle);
                flyoutDiv.getElementById("flyoutTitleLink").style.textOverflow = "ellipsis";
                flyoutDiv.getElementById("flyoutTitleLink").style.overflow = "hidden";  
                flyoutDiv.getElementById("flyoutTitleLink").style.whiteSpace = "nowrap"; 
                flyoutDiv.getElementById("flyoutPubDate").innerHTML = currentFeeds.Name;
                flyoutDiv.getElementById("flyoutPubDate").href = currentFeeds.URL;
                flyoutDiv.getElementById("flyoutPubDate").setAttribute("title", currentFeeds.Name);
                flyoutDiv.getElementById("flyoutPubDate").style.textOverflow = "ellipsis";
                flyoutDiv.getElementById("flyoutPubDate").style.overflow = "hidden";  
                flyoutDiv.getElementById("flyoutPubDate").style.whiteSpace = "nowrap"; 
                flyoutDiv.getElementById("flyoutMain").innerHTML = currentFeed.Description;
            }
            catch(e)
            {
            }
            g_msFeedManager = null;
        }
    }
    catch(e)
    {
        //catch slow flyout - no div object will be available.
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// Gadget DOCKED
//
////////////////////////////////////////////////////////////////////////////////

function dockedState()
{    
    g_curLinkWidth              = "113px";
    g_feedNameLength            = 10;
    if(g_lastCalledArrayIndex)
    {
        g_currentArrayIndex = g_lastCalledArrayIndex;
    }
    else
    {
        g_currentArrayIndex = 0;
    }
    setNextViewItems();
    with(document.body.style)
    {
        height = "173px";
        width = "130px";
    }  
    with(rssfeedBg.style)
    {
        height = "173px";
        width = "130px";
    }  
    rssfeedBg.src = "url(images/rssBackBlue_docked.png)";
      //styleSwitch (name backgroundColor top left height width, fontWeight, fontSize, color, 
      //             paddingTop, paddingBottom, paddingRight, paddingLeft, borderbottom, bordercolor)

    styleSwitch("FeedItemHldr", false, 3, 3, false, false, false, false, false, false, false, 4, false, false, false);    
    styleSwitch("navHolder", false, 147, 25, 20, 75, false, false, false, false, false, false, false, false, false);   
    for (i=0; i < g_countToView; i++)
    {        
        styleSwitch(eval("FeedItem"+i), false, false, false, 35, 123, false, 12, '#ffffff', 5, 1, 4, 6, false, false);
        styleSwitch(eval("FeedItemName"+i), false, false, false, 14, 55, false, 11, '#67788a', 0, 0, 0, 0, false, false);
        styleSwitch(eval("FeedItemDate"+i), false, false, false, 14, 55, false, 11, '#67788a', 0, 0, 0, 0, false, false);
        eval("FeedItem"+i).style.lineHeight = "13px";
        eval("FeedItem"+i).style.overflow = "hidden";           
        eval("FeedItemName"+i).style.lineHeight = "12px";
        eval("FeedItemDate"+i).style.lineHeight = "12px";
        eval("FeedItemDate"+i).style.textAlign = "right";
   }    
}
////////////////////////////////////////////////////////////////////////////////
//
// Gadget UNDOCKED
//
////////////////////////////////////////////////////////////////////////////////
function undockedState()
{
    g_curLinkWidth              = "250px";
    g_feedNameLength            = 15;
    if(g_lastCalledArrayIndex)
    {
        g_currentArrayIndex = g_lastCalledArrayIndex;
    }
    else
    {
        g_currentArrayIndex = 0;
    }
    setNextViewItems();
    with(document.body.style)
    {
        height = "232px";
        width = "296px";
    }
    with(rssfeedBg.style)
    {
        height = "232px";
        width = "296px";
    }  
    rssfeedBg.src = "url(images/rssBackBlue_undocked.png)";
    
    //styleSwitch (name backgroundColor top left height width, fontWeight, fontSize, 
    //     color, paddingTop, paddingBottom, paddingRight, paddingLeft, borderbottom, bordercolor)
 
    styleSwitch("FeedItemHldr", false, 13, 13, false, false, false, false, false, false, false, 14, false, false, false);   
    styleSwitch("navHolder", false, 190, 106, 20, 75, false, false, false, false, false, false, false, false, false);
   
    for (i=0; i < g_countToView; i++)
    {        
        styleSwitch(eval("FeedItem"+i), false, false, false, 44, 264, false, 14, '#ffffff', 7, 2, 7, 7, false, false);
        styleSwitch(eval("FeedItemName"+i), false, false, false, 14, 130, false, 12, '#67788a', 0, 0, 0, 0, false, false);
        styleSwitch(eval("FeedItemDate"+i), false, false, false, 14, 120, false, 12, '#67788a', 0, 0, 0, 0, false, false);
        eval("FeedItem"+i).style.lineHeight = "14px";
        eval("FeedItem"+i).style.overflow = "hidden";         
        eval("FeedItemName"+i).style.lineHeight = "14px";
        eval("FeedItemDate"+i).style.lineHeight = "14px";
        eval("FeedItemDate"+i).style.textAlign = "right";        
   }    
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function styleSwitch(divObject, backgroundColorVal, topVal, leftVal, heightVal, widthVal, fontWeightVal, fontSizeVal, fontColor, marginTopVal, marginBottomVal, marginRightVal, marginLeftVal, borderBottomVal, borderColorVal)
{
    with(eval(divObject).style)
    {
        if(topVal)
        {
            top = topVal + "px";
        }
        if(leftVal)
        {
            left = leftVal + "px";
        }
        if(heightVal)
        {
            height = heightVal + "px";
        }        
        if(widthVal)
        {
            width = widthVal + "px";
        }    
        if(fontWeightVal)
        {
            fontWeight = fontWeightVal;
        }
        if(fontSizeVal)
        {
            fontSize = fontSizeVal + "px";
        }        
        if(fontColor)
        {
            color = fontColor;
        }
        if(marginTopVal)
        {
            paddingTop = marginTopVal + "px";
        }
        if(marginBottomVal)
        {
            paddingBottom = marginBottomVal + "px";
        }
        if(marginLeftVal)
        {
            paddingLeft = marginLeftVal+ "px";
        }
        if(marginRightVal)
        {
            paddingRight = marginRightVal+ "px";
        }
        if(borderBottomVal)
        {
            borderBottom = "dotted "+ borderBottomVal + "px";
        }
        if(borderColorVal)
        {
              borderColor = borderColorVal;
        }
        if(backgroundColorVal)
        {
            backgroundColor = backgroundColorVal;
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function toggleBack(objToChange, showBack)
{    
    if(objToChange.innerText != g_feedClicked)
    {
        if(!System.Gadget.docked) 
        {
            var backgroundToLoad = "url(images/item_hover_floating.png)";
        } 
        else if (System.Gadget.docked)
        {
            var backgroundToLoad = "url(images/item_hover_docked.png)"; 
        }
        if(showBack)
        {
            eval("objToChange").style.backgroundImage = backgroundToLoad; 
        }
        else
        {
            eval("objToChange").style.backgroundImage = ""; 
        }
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// set/swap background image when clicked/dblclicked
//
////////////////////////////////////////////////////////////////////////////////
function selectBack(objToChange)
{    
    g_feedClicked = objToChange.innerText;
    clearBack();
} 
////////////////////////////////////////////////////////////////////////////////
//
// clear background image's and set selected article with image
//
////////////////////////////////////////////////////////////////////////////////
function clearBack()
{    
    for(var i = 0; i < 4; i++)
    {
        if(eval("FeedItem"+i).innerText == g_feedClicked)
        {   
            setSelectBack(eval("FeedItem"+i));            
        }
        else
        {
            eval("FeedItem"+i).style.backgroundImage = "";
        }
    } 
}
////////////////////////////////////////////////////////////////////////////////
//
// Set the background image
//
////////////////////////////////////////////////////////////////////////////////   
function setSelectBack(objToChange)
{
    if(objToChange.innerText == g_feedClicked)
    {
        if(!System.Gadget.docked) 
        {
            var backgroundToLoad = "url(images/rss_headline_glow_floating.png)";
        } 
        else if (System.Gadget.docked)
        {
            var backgroundToLoad = "url(images/rss_headline_glow_docked.png)"; 
        }
        eval("objToChange").style.backgroundImage = backgroundToLoad; 
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function toggleButton(objToChange, newSRC)
{        
   eval("objToChange").src = "images/"+newSRC;
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function mouseWheeNavigate()
{
    var headlineCount = g_returnFeed.feedItems.length;
    if(g_totalViewableItems < headlineCount)
    {
        headlineCount = g_totalViewableItems;
    }
    if(event.wheelDelta < -20)
    {
        setNextViewItems();
    }
    if(event.wheelDelta > 20)
    {
        setPreviousViewItems();
    }
}

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////

function keyNavigate()
{   
    switch(event.keyCode)
    {

        case 38:
        case 104:
            setPreviousViewItems();
            break;
        case 40:
        case 98:
            setNextViewItems();
            break;
        case 32: 
        case 13:
            if(event.srcElement.id == "buttonLeftNarrator")
            {
                setPreviousViewItems();
            }
            else if(event.srcElement.id == "buttonRightNarrator")
            {
                setNextViewItems();
            }
            break;
        case 27:
            hideFlyout();
            break;
    }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////

function keyNavigateClose()
{   
    switch(event.keyCode)
    {
        case 27:
            hideFlyout();
            break;
    }
}

