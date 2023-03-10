////////////////////////////////////////////////////////////////////////////////
//
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

var gDefaultDisplayMode = "docked";  
var gDisplaySizeDocked   = { width: 130, height: 67 }
var gDisplaySizeUnDocked = { width: 264, height: 194 }
var gDefaultRefreshInterval = 60;            
var gDefaultPollingForServiceExistence = 1;  
var gDefaultSunRise = "06:30:00";
var gDefaultSunSet  = "18:30:00";
var gDefaultBackDrop = "BLUE";
var gDefaultWeatherLocation = getLocalizedString('DefaultCity');
var gDefaultWeatherLocationCode = getLocalizedString('DefaultLocationCode');
var gDefaultDisplayDegreesIn = getLocalizedString('DefaultUnit');

var MicrosoftGadget = new WeatherGadget();

////////////////////////////////////////////////////////////////////////////////
//
// setup() - triggered by body.onload event
//
////////////////////////////////////////////////////////////////////////////////
function setup() 
{
  // If we are in BIDI Mode, apply some special css to help folks read things Right to Left
  if (gBIDIMode) 
  {
    document.body.className = 'BIDI'; 
  }
  setDisplayMode();

  if (MicrosoftGadget.isValid) 
  {
    MicrosoftGadget.refreshSettings();
  } 
  else 
  {
    // The only way that we can get here is if the Service itself is invalid.  
    // Therefore, no need to set up refresh intervals, etc.
    showOrHideServiceError( true );
  }
  
  // Hook the various events to our custom support functions
  if (gGadgetMode) 
  {    
    System.Gadget.settingsUI="settings.html";
    System.Gadget.onSettingsClosed  = function(event) 
    { 
      MicrosoftGadget.refreshSettings(); 
    }
    System.Gadget.onDock   = function() 
    { 
      setDisplayMode(); 
    }    
    System.Gadget.onUndock = function() 
    { 
      setDisplayMode(); 
    }    
    System.Gadget.onShowSettings = function() 
    {
      MicrosoftGadget.suspendPeriodicRefresh();
      if ( MicrosoftGadget.pollingForServiceExistenceIsRunning ) 
      {
        MicrosoftGadget.endPollingForServiceExistence();        
      }
      MicrosoftGadget.wasPollingForServiceExistence = false;
    }
    System.Gadget.visibilityChanged = function() 
    {
      if (! System.Gadget.visible ) 
      {
        MicrosoftGadget.suspendPeriodicRefresh()
        if ( MicrosoftGadget.pollingForServiceExistenceIsRunning ) 
        {
          MicrosoftGadget.endPollingForServiceExistence();        
          MicrosoftGadget.wasPollingForServiceExistence = true;
        } else {
          MicrosoftGadget.wasPollingForServiceExistence = false;
        }
      } 
      else 
      {
        if ( MicrosoftGadget.wasPollingForServiceExistence ) 
        {
          // If our last state was trying to reconnect to the network, resume doing that
          MicrosoftGadget.beginPollingForServiceExistence();        
        } 
        else 
        {
          // Normal course of events is to come back into visible state and to begin anew
          MicrosoftGadget.refreshSettings();
        }
      }
    }
  }    
}

////////////////////////////////////////////////////////////////////////////////
//
// WeatherGadget() - main Constructor
//
////////////////////////////////////////////////////////////////////////////////
function WeatherGadget() 
{
  var self = this;


  ////////////////////////////////////////////////////////////////////////////////
  //
  // Public Members
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.isValid = true;
  this.statusMessage = "";
  this.weatherLocation     = gDefaultWeatherLocation;
  this.weatherLocationCode = gDefaultWeatherLocationCode;
  this.displayDegreesIn    = gDefaultDisplayDegreesIn;
  this.SunRise             = gDefaultSunRise;
  this.SunSet              = gDefaultSunSet;
  this.offsetFromLocalTime = 0;
  this.refreshInterval     = gDefaultRefreshInterval;
  this.displayMode         = gDefaultDisplayMode;

  this.spinner =  null;
  this.status = 200;
  try 
  {		
    // Connect to Weather Service .dll
    var oMSN = new ActiveXObject("wlsrvc.WLServices");
    this.oMSN = oMSN.GetService("weather"); 
  }
  catch (objException) 
  {
    this.isValid = false;
    this.statusMessage = getLocalizedString('ServiceNotAvailable');
    this.oMSN = new Object();
  }

  ////////////////////////////////////////////////////////////////////////////////
  //
  // Public Methods
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.onUpdate           = refreshEverything;		
  this.oMSN.OnDataReady   = onDataReadyHandler;

  ////////////////////////////////////////////////////////////////////////////////
  //
  // requestUpdate - request update from Weather Feed.
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.requestUpdate =  function() 
  {
    self.statusMessage='Requesting Update...';
    self.spinner.start();
    showOrHideGettingDataMessage( true );  
    self.oMSN.Celsius = ( self.displayDegreesIn == "Celsius" );
    self.oMSN.SearchByCode( self.weatherLocationCode );
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // refreshSettings - populate values with stored settings 
  //                   and request update(s) of Weather data from Service
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.refreshSettings = function () 
  {
    self.statusMessage='RefreshSettings';
    self.weatherLocation     = unescape(readSetting("WeatherLocation")) || gDefaultWeatherLocation;
    self.weatherLocationCode = URLDecode(readSetting("WeatherLocationCode")) || gDefaultWeatherLocationCode;
    self.displayDegreesIn    = readSetting("DisplayDegreesIn")   || gDefaultDisplayDegreesIn;
    // Compute frequency of refresh 
    if (self.oMSN.RefreshInterval > 0 )
    {
      self.refreshInterval = self.oMSN.RefreshInterval;
    }
    else
    {
      self.refreshInterval = readSetting("RefreshInterval");
    }
    self.refreshInterval = ( self.refreshInterval || gDefaultRefreshInterval ) * 60 * 1000;
    
    if (self.spinner == null) 
    {
      // Only need to do this once, but must wait for the page to load first
      self.spinner = new getSpinner( "PleaseWaitLoadingSpinner" );  
      self.spinner.hide();
    }
    self.oMSN.OnDataReady   = onDataReadyHandler;
    self.requestUpdate();  
    self.beginPeriodicRefresh();
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // beginPeriodicRefresh - begins periodic polling of weather service for updates
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.beginPeriodicRefresh = function() 
  {
    // Clear any pending refresh requests first
    self.suspendPeriodicRefresh();    
    self.endPollingForServiceExistence();
    // Set up recurring requests for updates*    
    self.interval_RefreshTemperature = setInterval( "MicrosoftGadget.requestUpdate()", self.refreshInterval);        
    self.periodicRefreshIsRunning = true;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // suspendPeriodicRefresh - cancels polling of weather service for updates
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.suspendPeriodicRefresh = function() 
  {
    clearInterval( self.interval_RefreshTemperature );  
    clearInterval( MicrosoftGadget.interval_RefreshTemperature ); 
    self.periodicRefreshIsRunning = false;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // beginPollingForServiceExistence - when network connectivity is lost, 
  // begin special polling testing for it to come back.
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.beginPollingForServiceExistence = function() 
  {
    // Clear any pending refresh requests first
    self.suspendPeriodicRefresh();    
    self.endPollingForServiceExistence();

    // Remap the onDataReady Handler
    self.oMSN.OnDataReady = isDataReadyHandler;   
    self.pollingForServiceExistence = setInterval( "MicrosoftGadget.oMSN.SearchByCode('" + self.weatherLocationCode + "')", gDefaultPollingForServiceExistence * 60 * 1000);
    self.pollingForServiceExistenceIsRunning = true;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // endPollingForServiceExistence - cancel special network connectivity polling
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.endPollingForServiceExistence = function() 
  {
    clearInterval( self.pollingForServiceExistence );
    clearInterval( MicrosoftGadget.pollingForServiceExistence ); 
    self.pollingForServiceExistenceIsRunning = false;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // weatherState() - Computes generalized state of weather [Sunny, Cloudy, etc.]
  // for all SkyCodes. Determines what image is used to represent...
  //
  ////////////////////////////////////////////////////////////////////////////////
  self.WeatherState = function() 
  {
    switch ( self.SkyCode ) 
    {
        case (26) : case (27) : case (28) :
            theWeatherState = "cloudy";
            break;
        case (35) : case (39) : case (45) : case (46) : 
            theWeatherState = "few-showers";
            break;
        case (19) : case (20) : case (21) : case (22) :
            theWeatherState = "foggy";
            break;
        case (29) : case (30) : case (33) :
            theWeatherState = "partly-cloudy";
            break;
        case (5) : case (13) : case (14) : case (15) : case (16) : case (18) : case (25) : case (41) : case (42) : case (43) : 
            theWeatherState = "snow";
            break;
        case (1) : case (2) : case (3) : case (4) : case (37) : case (38) : case (47) : 
            theWeatherState = "thunderstorm";
            break;
        case (31) : case (32) : case (34) : case (36) : case (44) :        // Note 44- "Data Not Available"
            theWeatherState = "sun";
            break;
        case (23) : case (24) :
            theWeatherState = "windy";
            break;
        case (9) : case (10) : case (11) : case (12) : case (40) :
            theWeatherState = "Rainy";
            break;
        case (6) : case (7) : case (8) : case (17) : 
            theWeatherState = "hail";
            break;
        default:
            theWeatherState = "sun";
            break;
      }
      return theWeatherState;
    }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // isNight - boolean indicating whether its currently night *wherever*
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.isNight = function() 
  {
    var curTime = GMTTime(); 
    // Before SunRise or after Sunset means it's Night
    var deltaTime = self.SunSet - curTime;
    deltaTime = deltaTime / (1000 * 60 * 60);
    if (deltaTime > 24)
        curTime = new Date(curTime.getTime() + 24 * 60 * 60 * 1000);
    else if (deltaTime < 0)
        curTime = new Date(curTime.getTime() - 24 * 60 * 60 * 1000);
   
    return ( (  curTime < self.SunRise ) || ( curTime > self.SunSet ) );
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // makesSenseToDisplayTheMoon - boolean indicating whether it makes sense to 
  //                              display the moon.  Dependant on weather state
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.makesSenseToDisplayTheMoon = function() 
  {
    var retVal = false;
    if ( self.isNight() ) 
    { 
      var theWeatherState = self.WeatherState();
      if ( ( theWeatherState=="sun" ) || ( theWeatherState=="partly-cloudy" )  ) 
      {
        retVal = true;
      }
    }
    return retVal;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // self.backdrop - returns backdrop color required for active weather state
  //
  ////////////////////////////////////////////////////////////////////////////////
  self.backdrop =  function() 
  {
    var theBackground = "BLUE";
    var theDisplayMode = activeDisplayMode();
    
    switch ( self.SkyCode ) 
    {
      case (26) : case (27) : case (28) :
      case (35) : case (39) : case (45) : case (46) : 
      case (19) : case (20) : case (21) : case (22) :
      case (1) : case (2) : case (3) : case (4) : case (5) : case (37) : case (38) : case (47) : 
      case (9) : case (10) : case (11) : case (12) : case (40) : case (41) : case (42) : case (43) :
      case (6) : case (7) : case (8) : case (17) : case (13) : case (14) : case (15)  : case (16) : case (18) :
        theBackground = "GRAY";
        break;
      case (29) : case (30) : case (33) : case (34) :
      case (31) : case (32) : case (36) : case (44) :        
      case (23) : case (24) : case (25) : default : 
        theBackground = "BLUE";
        break;
    }  
    
    if (self.isNight()) 
    { 
      theBackground = "BLACK";  
    }
    if ( !self.isValid )
    { 
      theBackground = "BLUE";  
    }
    if (theDisplayMode=='docked')
    {
      theBackground = theBackground + theDisplayMode;
    }
    return theBackground;
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  //
  // HighTemp() - use tomorrow's High as an approximation 
  //              if today's High cannot be returned by service
  //
  ////////////////////////////////////////////////////////////////////////////////
  this.HighTemp = function() 
  {
    var theHighTemp = 0;
    try 
    {
      theHighTemp = self.oMSNWeatherService.ForeCast(0).High;
      if (theHighTemp == 0) 
      {
        theHighTemp = self.oMSNWeatherService.Forecast(1).High;
      }
    }
    catch (objException) 
    {
    }
    return theHighTemp;
  }

  
  ////////////////////////////////////////////////////////////////////////////////
  //
  // Private Methods
  //
  ////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////
  //
  // onDataReadyHandler( data )  - processes data returned by Weather Feed
  //                              (asynchronous callback) 
  //
  ////////////////////////////////////////////////////////////////////////////////
  function onDataReadyHandler( data ) 
  {
    if (data!==undefined) 
    { 
      self.statusMessage='Update Received.';
      self.status  = data.RetCode;
      if (data.Count > 0 && data.item(0)) 
      {
        self.oMSNWeatherService = data.item(0);
	      var gmt = GMTTime();
        // Compute SunRise/SunSet times based on latitude/longitude returned by the feed for location
        var theSunRiseSunset = computeSunRiseSunSet( self.oMSNWeatherService.Latitude, self.oMSNWeatherService.Longitude, 0, gmt.getFullYear(), gmt.getMonth()+1, gmt.getDate());  // Note - using GMT (no TimeZone offset)
        self.SunRise = theSunRiseSunset.SunRise;
        self.SunSet  = theSunRiseSunset.SunSet;
        self.MoonState = function() 
        { 
          return computePhaseOfMoon(new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()); 
        }
        self.SkyCode = self.oMSNWeatherService.SkyCode;
      } else {
        // In the case of "No Content", service will return 200 "success", but no data
        if (self.status==200) 
        { 
          // Actual HTTP Error code for "No Content"
          self.status = 204;  
        }
      }
      // Gadget is valid if we have a 200 retVal
      self.isValid = ( self.status == 200 );  
    }

    self.spinner.stop();
    showOrHideGettingDataMessage( false );     

    if (self.isValid) 
    {
      self.onUpdate();
    } 
    else 
    {
      // When we get in this state, begin a special polling for the service coming
      // back online or otherwise correcting itself
      showOrHideServiceError( true, self.status );
      self.suspendPeriodicRefresh();
      // Only poll for Service Existence if it's available in the market
      if ( self.status != 1506 )
      {
        self.beginPollingForServiceExistence();
      }
      setDisplayMode();
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // isDataReadyHandler( data ) - special handler for use when the service is 
  //                              down or otherwise unresponsive
  //
  ////////////////////////////////////////////////////////////////////////////////
  function isDataReadyHandler( data ) 
  {
    if (data.RetCode==200 && !data.RequestPending) 
    {
      self.endPollingForServiceExistence();
      self.isValid = true;
      MicrosoftGadget.isValid = true; 
      self.oMSN.OnDataReady = onDataReadyHandler;
      self.requestUpdate();
      self.beginPeriodicRefresh();
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // computeSunRiseSunSet(Latitude, Longitude, TimeZone, Year, Month, Day)
  //                     Computes SunRise/SunSet based on Latitude/Longitude
  //
  ////////////////////////////////////////////////////////////////////////////////
  function computeSunRiseSunSet(Latitude, Longitude, TimeZone, Year, Month, Day) 
  {
    // Variable names used: B5, C, C2, C3, CD, D, DR, H, HR, HS, L0, L5, M, MR, MS, N, PI, R1, RD, S1, SC, SD, str
    var retVal = new Object();
    var str = "";
    var PI=Math.PI;
    var DR=PI/180;
    var RD=1/DR;
    var B5=Latitude;
    var L5=Longitude;
    var H =TimeZone;
    // Overriding TimeZone to standardize on UTC
    H = 0;  
    var M =Month;
    var D =Day;
    B5=DR*B5;
    var N=parseInt(275*M/9)-2*parseInt((M+9)/12)+D-30;
    var L0=4.8771+.0172*(N+.5-L5/360);
    var C=.03342*Math.sin(L0+1.345);
    var C2=RD*(Math.atan(Math.tan(L0+C)) - Math.atan(.9175*Math.tan(L0+C))-C);
    var SD=.3978*Math.sin(L0+C);
    var CD=Math.sqrt(1-SD*SD);
    var SC=(SD * Math.sin(B5) + .0145) / (Math.cos(B5) * CD);
    if (Math.abs(SC)<=1) 
    {
      var C3=RD*Math.atan(SC/Math.sqrt(1-SC*SC));
      var R1=6-H-(L5+C2+C3)/15;
      var HR=parseInt(R1);
      var MR=parseInt((R1-HR)*60);
      str = "Sunrise at " + HR + ":" + MR;
      retVal.SunRise = parseTime(HR + ":" + MR);
      var S1=18-H-(L5+C2-C3)/15;
      var HS=parseInt(S1);
      var MS=parseInt((S1-HS)*60);
      retVal.SunSet = parseTime(HS + ":" + MS);
      str += "\nSunset at " + HS + ":" + MS;
    } 
    else 
    {
      if (SC>1) 
      { 
        str="Sun up all day"; 
        var tDate = new Date(); 
        // Set Sunset to be in the future ...
        retVal.SunSet = new Date( tDate.getFullYear()+1, tDate.getMonth(), tDate.getDay(), tDate.getHours() );
        // Set Sunrise to be in the past ...
        retVal.SunRise = new Date( tDate.getFullYear()-1, tDate.getMonth(), tDate.getDay(), tDate.getHours()-1 );
      }
      if (SC<-1) 
      { 
        str="Sun down all day"; 
        // Set Sunrise and Sunset to be in the future ...
        retVal.SunRise = new Date( tDate.getFullYear()+1, tDate.getMonth(), tDate.getDay(), tDate.getHours() );
        retVal.SunSet = new Date( tDate.getFullYear()+1, tDate.getMonth(), tDate.getDay(), tDate.getHours() );
      }
    }
    retVal.str = str;
    return retVal;
  }

  ////////////////////////////////////////////////////////////////////////////////
  //
  // computePhaseOfMoon(Year, Month, Day) - Computes Phase of Moon based on Date
  //
  ////////////////////////////////////////////////////////////////////////////////
  function computePhaseOfMoon(Year, Month, Day) 
  {
    // Variable names used: J, K1, K2, K3, MM, P2, V, YY
    var P2 = 3.14159 * 2;    
    var YY = Year - parseInt((12 - Month)/10);
    var MM = Month + 9;
    if (MM >= 12) { MM = MM-12; }
    var K1 = parseInt(365.25 * (YY+4712));
    var K2 = parseInt(30.6 * MM + .5);
    var K3 = parseInt(parseInt((YY/100) + 49) * .75) - 38;
    // J is the Julian date at 12h UT on day in question
    var J = K1+K2+Day+59;             
    // Adjust for Gregorian calendar, if applicable   
    if (J > 2299160) { J = J-K3; }    
    // Calculate illumination (synodic) phase
    var V = (J - 2451550.1)/29.530588853;
    V = V - parseInt(V);
    // Normalize values to range from 0 to 1
    if (V<0) { V=V+1; }
    // Moon's age in days from New Moon
    var AG = V*29.53;    

    switch (true) 
    { 
      // Each phase lasts approximately 3.28 days
      case ((AG > 27.6849270496875) || (AG <= 1.8456618033125)) :
        var retVal = 'New';
        break;
      case ((AG > 1.8456618033125) && (AG <= 5.5369854099375)) :
        var retVal = 'Waxing-Crescent';
        break;
      case ((AG > 5.5369854099375) && (AG <= 9.2283090165625)) :
        var retVal = 'First-Quarter';
        break;
      case ((AG > 9.2283090165625) && (AG <= 12.9196326231875)) : 
        var retVal = 'Waxing-Gibbous';
        break;
      case ((AG > 12.9196326231875) && (AG <= 16.6109562298125)) :
        var retVal = 'Full';
        break;
      case ((AG > 16.6109562298125) && (AG <= 20.3022798364375)) :
        var retVal = 'Waning-Gibbous';
        break;
      case ((AG > 20.3022798364375) && (AG <= 23.9936034430625)) :
        var retVal = 'Last-Quarter';
        break;
      case ((AG > 23.9936034430625) && (AG <= 27.6849270496875)) :
        var retVal = 'Waning-Crescent';
        break;
      default : 
        var retVal = 'Full';
        break;
    }    
    return retVal;
  }

  ////////////////////////////////////////////////////////////////////////////////
  //
  // SGN(aNumber) - Returns an integer indicating the sign of a number
  //
  ////////////////////////////////////////////////////////////////////////////////
  function SGN(aNumber) {
    if (aNumber===undefined) { aNumber = 0; }   
    var theNumber = parseFloat(aNumber);
    retVal = 0;
    if ( theNumber != 0 )
    {
      if (theNumber>0)
      {
        retVal = 1;
      }
      else
      {
        retVal = -1;
      }
    }
    return retVal;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // parseTime(string aTime) - takes a string of time in the format HH:MM:SS 
  //                           and returns Javascript Date Object 
  //
  ////////////////////////////////////////////////////////////////////////////////
  function parseTime(aTime) 
  {
    var aDateTimeObject = 'none';
    if (aTime!==undefined && aTime.length) 
    {
      aDateTimeObject = GMTTime();
      try 
      {
        var theHour    = parseInt(aTime.split(':')[0]);
        var theMinutes = parseInt(aTime.split(':')[1]);
        aDateTimeObject.setHours(theHour);
        aDateTimeObject.setMinutes(theMinutes);
      }
      catch (ex) 
      {
      }
    }
    return aDateTimeObject;
  }
  ////////////////////////////////////////////////////////////////////////////////
  //
  // GMTTime() - returns time adjusted to GMT (Universal Time)
  //
  ////////////////////////////////////////////////////////////////////////////////
  function GMTTime() 
  { 
    var aDate = new Date();
    var aDateAdjustedToGMTInMS = aDate.getTime() + (aDate.getTimezoneOffset() * 60 * 1000);
    return ( new Date( aDateAdjustedToGMTInMS ) );
  }  
}

// *** END WeatherGadget Object Constructor ***

////////////////////////////////////////////////////////////////////////////////
//
// Routines for Refreshing Display
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
// setDisplayMode() - resets gadget size and background based on current host
//
////////////////////////////////////////////////////////////////////////////////
function setDisplayMode( ) 
{
  showOrHide('DockedModeDisplayArea',false);
  showOrHide('UnDockedModeDisplayArea',false);

  var theWidth  = gDisplaySizeUnDocked.width;
  var theHeight = gDisplaySizeUnDocked.height;
  var theBackgroundImage = gDefaultBackDrop;
  var theActiveDisplayArea = 'DisplayArea' + gDefaultDisplayMode;

  switch ( activeDisplayMode() ) 
  {
    case "undocked" :
      theActiveDisplayArea = 'UnDockedModeDisplayArea';
      theWidth  = gDisplaySizeUnDocked.width;
      theHeight = gDisplaySizeUnDocked.height;
      document.getElementById('PlaceHrefUnDockedMode').tabIndex = 1;
      document.getElementById('DayOfWeek1').tabIndex = 5;
      document.getElementById('DayOfWeek2').tabIndex = 5;
      document.getElementById('DayOfWeek3').tabIndex = 5;
      document.getElementById('UnDockedModeDisplayArea').className = MicrosoftGadget.backdrop(); 
      refreshUnDockedModeValues( MicrosoftGadget );
      break;

    case "docked" : default : 
      theActiveDisplayArea = 'DockedModeDisplayArea';
      theWidth  = gDisplaySizeDocked.width;
      theHeight = gDisplaySizeDocked.height;
      document.getElementById('DockedModeDisplayArea').className = MicrosoftGadget.backdrop(); 
      refreshDockedModeValues( MicrosoftGadget );
      break;
  }
  
  document.body.style.width  = theWidth;
  document.body.style.height = theHeight;

  if ( MicrosoftGadget.isValid ) 
  {
    setBackground( 'url(images/' + MicrosoftGadget.backdrop() + '-base.png)' );
  }
  // Only show the data layers if we have data
  showOrHide(theActiveDisplayArea, MicrosoftGadget.isValid);  
  
  if (!MicrosoftGadget.isValid) 
  {
    showOrHide('WeatherMessage', true);
  }
}
////////////////////////////////////////////////////////////////////////////////
//
// refreshEverything() -  update display for all modes with active data
//
////////////////////////////////////////////////////////////////////////////////
function refreshEverything() 
{ 
 refreshDockedModeValues( this );
 refreshUnDockedModeValues( this );
 setDisplayMode();
}
////////////////////////////////////////////////////////////////////////////////
//
// refreshDockedModeValues() - Refreshes display of Docked window
//
////////////////////////////////////////////////////////////////////////////////
function refreshDockedModeValues( oWeatherGadget ) 
{
  if (!oWeatherGadget.isValid || oWeatherGadget.oMSNWeatherService===undefined) 
  { 
    // Since the weather service can become invalidated at any time (not necessarily
    // onRefreshSettings), we must manually set isValid to false if the service 
    // becomes undefined
    showOrHideServiceError(true, oWeatherGadget.status);
    return; 
  }

  showOrHideServiceError(false);
  document.getElementById('PlaceDockedMode').innerText = oWeatherGadget.oMSNWeatherService.Location;

  var theAltText = oWeatherGadget.oMSNWeatherService.SkyText;    

  showOrHide( 'WeatherStateDockedMode', true);
  
  if ( oWeatherGadget.SkyCode != 44 )
  {
    setImage( 'WeatherStateDockedMode', 'images/docked_' + oWeatherGadget.WeatherState() + '.png');
  }
  else
  {
    setImage( 'WeatherStateDockedMode', 'images/1px.gif');  
  }
  
  if ( oWeatherGadget.makesSenseToDisplayTheMoon() ) 
  {
    showOrHide('OrbStateDockedMode', true);
    setImage( 'OrbStateDockedMode', 'images/docked_moon-' + oWeatherGadget.MoonState() + '.png');

    // For NightTime Weather states, show additional Moon Phase tooltip
    theAltText += " - " + getLocalizedString( 'Night-' + oWeatherGadget.MoonState());

    // Hide Weatherstate if we have clear skies, otherwise graphic includes a sun 
    // which doesn't make sense to show at night
    if ( oWeatherGadget.WeatherState()=='sun' ) 
    {
      showOrHide( 'WeatherStateDockedMode', false);
      // Hang the accessbility info. off of OrbState, 
      // since weather state is hidden in this case
      document.getElementById('OrbStateDockedMode').alt = theAltText;  
    }
  } 
  else 
  {
    showOrHide('DropShadowDockedMode', false);
    showOrHide('OrbStateDockedMode', false);
  }
  
  if ( oWeatherGadget.oMSNWeatherService.Temperature && oWeatherGadget.oMSNWeatherService.Temperature != "" ) 
  {
    document.getElementById('TemperatureCurrent').innerHTML = oWeatherGadget.oMSNWeatherService.Temperature + "&#176;";
  } 
  else
  {
    // In the unlikely event data is “Not Available”, do not display a temperature
    document.getElementById('TemperatureCurrent').innerHTML = " - ";
  }
  
  document.getElementById('WeatherStateDockedMode').alt = theAltText;
  document.getElementById('DockedModeHighlight2').alt = theAltText;

  setImage( 'DockedModeHighlight1', 'images/' + oWeatherGadget.backdrop() + '-highlight-01.png');
  setImage( 'DockedModeHighlight2', 'images/' + oWeatherGadget.backdrop() + '-highlight-02.png');  
}
////////////////////////////////////////////////////////////////////////////////
//
// refreshUnDockedModeValues( oWeatherGadget ) - Refreshes UnDocked window
//
////////////////////////////////////////////////////////////////////////////////
function refreshUnDockedModeValues( oWeatherGadget ) 
{
  if (!oWeatherGadget.isValid || oWeatherGadget.oMSNWeatherService===undefined) 
  { 
    showOrHideServiceError(true,  oWeatherGadget.status);
    return; 
  }

  showOrHideServiceError(false);
  document.getElementById('Attribution').innerText = oWeatherGadget.oMSNWeatherService.Attribution2;

  // Update Today's Forecast Temperatures
  document.getElementById('PlaceHrefUnDockedMode').href = oWeatherGadget.oMSNWeatherService.Url;
  document.getElementById('PlaceHrefUnDockedMode').innerText =  oWeatherGadget.oMSNWeatherService.Location;
  document.getElementById('ConditionCurrentUnDockedMode').innerText =  oWeatherGadget.oMSNWeatherService.SkyText;
  document.getElementById('TemperatureHigh0').innerHTML = oWeatherGadget.HighTemp() + "&#176;";
  document.getElementById('TemperatureSeparator').innerHTML = '-';
  document.getElementById('TemperatureLow0').innerHTML  = oWeatherGadget.oMSNWeatherService.ForeCast(0).Low + "&#176;";

  var theAltText = oWeatherGadget.oMSNWeatherService.SkyText;    

  showOrHide( 'WeatherStateUnDockedMode', true);
  showOrHide('OrbStateUnDockedMode', true);
  
  if ( oWeatherGadget.SkyCode != 44 )
  {
    setImage( 'WeatherStateUnDockedMode', 'images/undocked_' + oWeatherGadget.WeatherState() + '.png');
  }
  else
  {
    setImage( 'WeatherStateUnDockedMode', 'images/1px.gif');  
  }

  if ( oWeatherGadget.makesSenseToDisplayTheMoon() ) 
  {
    showOrHide('OrbStateUnDockedMode', true);
    setImage( 'OrbStateUnDockedMode', 'images/undocked_moon-' + oWeatherGadget.MoonState() + '.png');

    // For NightTime Weather states, show additional Moon Phase tooltip
    theAltText += " - " + getLocalizedString( 'Night-' + oWeatherGadget.MoonState());

    // Hide Weatherstate if we have clear skies, otherwise graphic includes a sun 
    // which doesn't make sense to show at night
    showOrHide( 'WeatherStateUnDockedMode', !( oWeatherGadget.WeatherState()=='sun' ));
  } 
  else 
  {
    showOrHide('OrbStateUnDockedMode', false);
  }

  if ( oWeatherGadget.oMSNWeatherService.Temperature && oWeatherGadget.oMSNWeatherService.Temperature != "" ) 
  {
    document.getElementById('TemperatureCurrentUnDockedMode').innerHTML = oWeatherGadget.oMSNWeatherService.Temperature + "&#176;";
  } 
  else
  {
    document.getElementById('TemperatureCurrentUnDockedMode').innerHTML = " - ";
  }

  document.getElementById('UnDockedModeAccessibilityInformation').alt = theAltText;
  setImage( 'UnDockedModeHighlight1', 'images/' + oWeatherGadget.backdrop() + '-highlight-01.png');
  setImage( 'UnDockedModeHighlight2', 'images/' + oWeatherGadget.backdrop() + '-highlight-02.png');  
  
  for (var i=1;i<4;i++) 
  {
    with (oWeatherGadget.oMSNWeatherService.Forecast(i)) 
    {
      var theDate = parseDateFromString(Date);
      var theLowTemp = Low;
      var theHighTemp = High;
      // Code from 1 to 47 indicating Weather State (used to compute Icon to display)
      var theSkyCode = SkyCode;         
      
      document.getElementById('SkyCodeImage'+ i).alt = SkyText; 
      setImage( 'SkyCodeImage'+ i, 'images/' + theSkyCode + '.png');
      document.getElementById('DayOfWeek' + i).innerText = Day; 
      document.getElementById('DayOfWeek' + i).href = oWeatherGadget.oMSNWeatherService.Url;
      document.getElementById('TemperatureHigh' + i).innerHTML = theHighTemp + "&#176;";
      document.getElementById('TemperatureLow' + i).innerHTML  = theLowTemp  + "&#176;";
    }
  }
}
////////////////////////////////////////////////////////////////////////////////
//
// activeDisplayMode() - returns active display mode
//
////////////////////////////////////////////////////////////////////////////////
function activeDisplayMode() 
{
  retVal = gDefaultDisplayMode;

  if (gGadgetMode) 
  {
    if (System.Gadget.docked) 
    {
      retVal = "docked";
    } 
    else 
    {
      retVal = "undocked";    
    }
  } 
  return retVal;
}
////////////////////////////////////////////////////////////////////////////////
//
// parseDateFromString(string aString) - parses Date from a string extracted 
// from MSN Weather Feed.  Returns a Date Object set to that time.
//
////////////////////////////////////////////////////////////////////////////////
function parseDateFromString(aString) 
{
  if (aString.length) {                    
    // String received should be formatted like:   "2006-01-10" (yyyy-mm-dd)
    var aDateTimeObject = new Date();
    aDateTimeObject.setFullYear(parseInt(aString.split('-')[0]));
    aDateTimeObject.setMonth(parseInt(aString.split('-')[1])-1);
    aDateTimeObject.setDate(parseInt(aString.split('-')[2]));
    return aDateTimeObject;
  }
}
////////////////////////////////////////////////////////////////////////////////
//
// showOrHideGettingDataMessage() - Display/Hide "Getting Data" Message  
//
////////////////////////////////////////////////////////////////////////////////
function showOrHideGettingDataMessage(bShow) 
{
  showOrHide('WeatherMessage', bShow);
  showOrHide('PleaseWaitLoadingSpinner', bShow);
  showOrHide(activeDisplayMode() + 'ModeDisplayArea', !bShow);

  var oMessage = document.getElementById('message');
  if (bShow) 
  {  
    if (activeDisplayMode()=="undocked")
    {
      document.getElementById("WeatherMessage").className = 'unDockedWeatherMessage';
    }
    else
    {
      document.getElementById("WeatherMessage").className = 'dockedWeatherMessage';
    }
    oMessage.innerHTML = getLocalizedString('GettingData');
    if (activeDisplayMode()=='docked')
    {
      setBackground( 'url(images/docked-loading.png)' );
    }
    else
    {
      setBackground( 'url(images/undocked-loading.png)' );
    }
  } 
  else 
  {
    oMessage.innerHTML = "";
  }
  showOrHide( document.getElementById('WeatherMessageIcon'), false );
}
////////////////////////////////////////////////////////////////////////////////
//
// showOrHideServiceError() - Display/Hide "Service Not Available" Message  
//
////////////////////////////////////////////////////////////////////////////////
function showOrHideServiceError(bShow, theStatusCode) 
{
  var theImage = "";
  var theMessage = "";
  showOrHide('WeatherMessage', bShow);
  showOrHide('PleaseWaitLoadingSpinner', false);
  var oMessage     = document.getElementById('message');
  if (bShow) 
  {
    if (activeDisplayMode()=="undocked")
    {
      document.getElementById("WeatherMessage").className = 'unDockedWeatherMessage';
    }
    else
    {
      document.getElementById("WeatherMessage").className = 'dockedWeatherMessage';
    }
    switch( theStatusCode ) 
    {
      case 1506: 
        // Forbidden
        if (activeDisplayMode()=="undocked") {
          theMessage = getLocalizedString( 'ServiceNotAvailableInYourArea' );
        } else {
          theMessage = getLocalizedString( 'ServiceNotAvailable' );
        }
        document.getElementById('WeatherMessageIcon').alt = getLocalizedString( 'ServiceNotAvailableInYourArea' );
        oMessage.title = getLocalizedString( 'ServiceNotAvailableInYourArea' );
        break;
      case 204: 
        // No Content
        theMessage = getLocalizedString( 'LocationDontExist' ) ;
        document.getElementById('WeatherMessageIcon').alt = getLocalizedString( 'LocationDontExist' );
        break;
      case 404: default: 
        // Not Found
        theMessage = getLocalizedString( 'ServiceNotAvailable' );
        document.getElementById('WeatherMessageIcon').alt = getLocalizedString( 'ServiceNotAvailable' );
        break;
    }
    if (activeDisplayMode()=='docked')
    {
      setBackground( 'url(images/docked-loading.png)' );
    }
    else
    {
      setBackground( 'url(images/undocked-loading.png)' );
    }
  }
  showOrHide( document.getElementById('WeatherMessageIcon'), true );
  oMessage.innerHTML = '<span>' + theMessage + '<\/span>';
}
////////////////////////////////////////////////////////////////////////////////
//
// setBackground ( string theImageURL ) - sets the background image of our gadget
//
////////////////////////////////////////////////////////////////////////////////
function setBackground( theImageURL ) 
{
  if (gGadgetMode) 
  {
    System.Gadget.background = theImageURL;
  } 
  else 
  {
    document.body.style.backgroundImage = theImageURL;        
  }
}
