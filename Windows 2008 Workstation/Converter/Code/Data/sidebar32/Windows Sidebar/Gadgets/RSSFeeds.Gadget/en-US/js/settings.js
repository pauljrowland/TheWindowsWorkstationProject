////////////////////////////////////////////////////////////////////////////////
//
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function getRssSettings()
{
        // Read the private rss gadget settings
        this.rssFeedPath = System.Gadget.Settings.read("rssFeedPath");
        this.rssFeedUrl  = System.Gadget.Settings.read("rssFeedUrl");
        this.rssFeedCount = System.Gadget.Settings.read("rssFeedCount");
        this.loadFirstTime = System.Gadget.Settings.read("loadFirstTime"); 
        
        if(this.rssFeedCount == "")
        {
            this.rssFeedCount = 100;
        }
        if(this.rssFeedUrl == "defaultGadg")
        {
            this.rssFeedPath = "";
        }
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function setRssSettings(_feedPath, _feedUrl, _feedCount)
{
        // Save the private rss gadget settings
        System.Gadget.Settings.write("rssFeedPath", _feedPath);
        System.Gadget.Settings.write("rssFeedUrl", _feedUrl);
        System.Gadget.Settings.write("rssFeedCount", _feedCount);
        System.Gadget.Settings.write("loadFirstTime", g_loadFirstTime);
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function load()
{
        System.Gadget.onSettingsClosing = settingsClosing;
        createFeedDropDown();
        loadSettings();
        rssTotalsSelection.value = g_totalViewableItems;
        feedHelp.innerHTML = L_LINKTEXT_TEXT;
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function settingsClosing(event)
{
    if(event.closeAction == event.Action.commit)
    {
        saveSettings();
    }
    else if (event.closeAction == event.Action.cancel)
    {
    }
    event.cancel = false;
}
////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////
function saveSettings()
{
    if(rssFeedSelection.selectedIndex != -1)
    {
        setRssSettings(rssFeedSelection.options(rssFeedSelection.selectedIndex).text,    rssFeedSelection.options(rssFeedSelection.selectedIndex).value, rssTotalsSelection.options(rssTotalsSelection.selectedIndex).value);        
    }
}


