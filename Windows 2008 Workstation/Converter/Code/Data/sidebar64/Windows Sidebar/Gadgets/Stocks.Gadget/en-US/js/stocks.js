////////////////////////////////////////////////////////////////////////////////
//
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
stocks =
{
    config:
    {
        docked: false,
        undocked: false,
        image:
        {
            dir: "images/",
            prefix: "",
            path: function(s)
            {
                return (s != "" ? stocks.config.image.dir + s : "");
            }
        },
        convert: function(s)
        {
            switch (s.toLowerCase())
            {
                case "add":
                    return "remove";
                case "remove":
                    return "add";
                case "left":
                    return "right";
                case "right":
                    return "left";
                case "open":
                    return "close";
                case "close":
                    return "open";
            }
            
            return s;
        },
        bidi:
        {
            dir: null,
            update: function()
            {
                stocks.config.bidi.dir = document.getElementsByTagName("html")[0].dir;
            },
            convert: function(s)
            {
                if (stocks.config.bidi.dir == "rtl")
                {
                    return stocks.config.convert(s);
                }
                
                return s;
            },
            reversed: function()
            {
                return (stocks.config.bidi.dir == "rtl");
            }
        },
        localization:
        {
            market:
            {
                lcid: 1033,
                country: "US",
                sym1: "$INDU",
                sym2: "$COMPX",
                sym3: "$INX"
            },
            market_entries: 12,            
            init: function()
            {
                // en-us, en-gb, en-ca, en-ie, fr-fr, de-de, es-es, it-it, sv-se, nl-nl, jp-jp, fr-ca
                var lcids =     new Array(1033, 2057, 4105, 6153, 1036, 1031, 3082, 1040, 1053, 1043, 1041, 3084);
                var countries = new Array("US", "GB", "CA", "GB", "FR", "DE", "ES", "IT", "SE", "NL", "JP", "CA");
                var syms1 = new Array("$INDU", "$GB:UKX", "$CA:OSPTX", "$GB:UKX", "$FR:PX1", "$DE:DAX", "$ES:IB", "$IT:I999", "$SE:ATTRACT40", "$NL:AEX", "JP:100000018", "$CA:OSPTX");
                var syms2 = new Array("$COMPX", "$GB:ASX", "$CA:ISPVX", "$GB:ASX", "$FR:SX5E", "$DE:TDXP", "$ES:MA", "$IT:I945", "$US:INDU", "$NL:AMX", "JP:KSISU1000", "$CA:ISPVX");
                var syms3 = new Array("$INX", "$US:INDU", "$US:INDU", "$US:INDU", "$US:INDU", "$US:INDU", "$ES:NE", "$IT:I932", "$US:COMPX", "$US:INDU", "JP:INDEX0000", "$US:INDU");
                var currlocale = vbsGetLocale();
                for (i = 0; i < stocks.config.localization.market_entries; i++)
                {
                    if (lcids[i] == currlocale)
                    {
                        stocks.config.localization.market.lcid = lcids[i];
                        stocks.config.localization.market.country = countries[i];
                        stocks.config.localization.market.sym1 = syms1[i];
                        stocks.config.localization.market.sym2 = syms2[i];
                        stocks.config.localization.market.sym3 = syms3[i];
                    }
                }
            },
            convert: function(s)
            {
                if (L_LOCALIZED_TEXT != null && L_LOCALIZED_TEXT[s] != null)
                {
                    return L_LOCALIZED_TEXT[s];
                }
                else
                {
                    return "";
                }
            },
            addprefix: function(s)
            {
                if (s.indexOf(":") < 0 && stocks.config.localization.market.country != "US")
                    return stocks.config.localization.market.country + ":" + s;
                else
                    return s;
            }
        },
        dock:
        {
            dir: null,
            update: function()
            {
                stocks.config.dock.dir = System.Gadget.Sidebar.dockSide;
            },
            convert: function(s)
            {
                if (stocks.config.dock.dir == "Left")
                {
                    return stocks.config.convert(s);
                }
                
                return s;
            },
            reversed: function()
            {
                return (stocks.config.dock.dir == "Left");
            },
            changed: function()
            {
                stocks.config.dock.update();
                
                if (stocks.config.docked)
                {
                    docked.controls.build();
                }
            }
        },
        user:
        {
            display:
            {
                percent: false,
                company: false
            }
        }
    },
    gadget:
    {
        visibility:
        {
            changed: function()
            {
                if (stocks.msn.service != null && stocks.msn.status.availability.active && !stocks.msn.search.active)
                {
                    if (System.Gadget.visible)
                    {
                        stocks.msn.load(false);
                    }
                }
            }
        },
        docked:
        {
            load: function()
            {
                stocks.msn.refresh.date = null;
                undocked.unload();
                
                if (!stocks.config.docked)
                {
                    docked.load();
                }
            }
        },
        undocked:
        {
            load: function()
            {
                stocks.msn.refresh.date = null;
                docked.unload();
                
                if (!stocks.config.undocked)
                {
                    undocked.load();
                }
            }
        },
        settings:
        {
            read: function()
            {
                var o = [];
                
                var n = System.Gadget.Settings.read("RowCount");
                
                if (n)
                {
                    for (var i = 0; i < parseInt(n); i++)
                    {
                        o.push([util.text.fill(System.Gadget.Settings.readString("Symbol" + i), ""), util.text.fill(System.Gadget.Settings.readString("Company" + i), ""), util.text.fill(System.Gadget.Settings.readString("Price" + i), ""), util.text.fill(System.Gadget.Settings.readString("Change" + i), ""), util.text.fill(System.Gadget.Settings.readString("Indicator" + i), ""), util.text.fill(System.Gadget.Settings.readString("Percent" + i), ""), util.text.fill(System.Gadget.Settings.readString("News" + i), ""), util.text.fill(System.Gadget.Settings.readString("DayChart" + i), "")]);
                    }
                }
                
                return o;
            },
            update: function()
            {
                var b = System.Gadget.Settings.read("DisplayPercentChange");
                stocks.config.user.display.percent = (b != null ? b : false);
                
                b = System.Gadget.Settings.read("DisplayCompany");
                stocks.config.user.display.company = (b != null ? b : false);
            },
            save: function()
            {
                var n = System.Gadget.Settings.read("RowCount");
                
                if (n && n > stocks.array.length() - 1)
                {
                    for (var i = stocks.array.length(); i < n; i++)
                    {
                        System.Gadget.Settings.writeString("Symbol" + i, "");
                        System.Gadget.Settings.writeString("Company" + i, "");
                        System.Gadget.Settings.writeString("Price" + i, "");
                        System.Gadget.Settings.writeString("Change" + i, "");
                        System.Gadget.Settings.writeString("Indicator" + i, "");
                        System.Gadget.Settings.writeString("Percent" + i, "");
                        System.Gadget.Settings.writeString("News" + i, "");
                        System.Gadget.Settings.writeString("DayChart" + i, "");
                    }
                }
                
                for (var i = 0; i < stocks.array.length(); i++)
                {
                    System.Gadget.Settings.writeString("Symbol" + i, util.text.fill(stocks.array.data(i, stocks.array.index.symbol), ""));
                    System.Gadget.Settings.writeString("Company" + i, util.text.fill(stocks.array.data(i, stocks.array.index.company), ""));
                    System.Gadget.Settings.writeString("Price" + i, util.text.fill(stocks.array.data(i, stocks.array.index.price), ""));
                    System.Gadget.Settings.writeString("Change" + i, util.text.fill(stocks.array.data(i, stocks.array.index.change), ""));
                    System.Gadget.Settings.writeString("Indicator" + i, util.text.fill(stocks.array.data(i, stocks.array.index.indicator), ""));
                    System.Gadget.Settings.writeString("Percent" + i, util.text.fill(stocks.array.data(i, stocks.array.index.percent), ""));
                    System.Gadget.Settings.writeString("News" + i, util.text.fill(stocks.array.data(i, stocks.array.index.news), ""));
                    System.Gadget.Settings.writeString("DayChart" + i, util.text.fill(stocks.array.data(i, stocks.array.index.daychart), ""));
                }
                
                System.Gadget.Settings.write("RowCount", stocks.array.length());
            },
            load: function()
            {
                settingsDisplayPercentChange.checked = (System.Gadget.Settings.read("DisplayPercentChange") ? true : false);
                settingsDisplayCompany.checked = (System.Gadget.Settings.read("DisplayCompany") ? true : false);
                
                settingsDisplayPercentChangeText.innerHTML = stocks.config.localization.convert("ShowPercentChange");
                settingsDisplayCompanyText.innerHTML = stocks.config.localization.convert("DisplayCompanyInSidebar");
                
                settingsDataProviders.innerHTML = stocks.config.localization.convert("DataProviders");
                
                System.Gadget.onSettingsClosing = stocks.gadget.settings.closing;
            },
            show: function()
            {
                if (stocks.config.docked)
                {
                    docked.row.blur(docked.row.action.focus.index);
                }
                else
                {
                    undocked.row.blur(undocked.row.action.focus.index);
                }
            },
            closing: function(event)
            {
                if (event.closeAction == event.Action.commit)
                {
                    System.Gadget.Settings.write("DisplayPercentChange", settingsDisplayPercentChange.checked);
                    System.Gadget.Settings.write("DisplayCompany", settingsDisplayCompany.checked);
                }
            },
            closed: function(event)
            {
                if (event.closeAction == event.Action.commit)
                {
                    stocks.gadget.settings.update();
                    
                    if (stocks.config.docked)
                    {
                        if (docked.row.initialized)
                        {
                            docked.row.adjust();
                            
                            if (docked.row.action.focus.index != -1)
                            {
                                document.getElementById(stocks.objects.data.id + "_symbol_text_" + docked.row.action.focus.index).focus();
                            }
                            
                            docked.row.index = (docked.row.action.focus.index != -1 ? docked.row.action.focus.index : (docked.row.index != -1 ? docked.row.index : -1));
                            docked.row.select(true, docked.row.index);
                        }
                    }
                    else if (stocks.config.undocked)
                    {
                        if (undocked.row.initialized)
                        {
                            undocked.row.adjust();
                            
                            if (undocked.row.action.focus.index != -1)
                            {
                                document.getElementById(stocks.objects.data.id + "_company_text_" + undocked.row.action.focus.index).focus();
                            }
                            
                            undocked.row.index = (undocked.row.action.focus.index != -1 ? undocked.row.action.focus.index : (undocked.chart.index != -1 ? undocked.chart.index : -1));
                            undocked.row.select(true, undocked.row.index);
                            
                            if (undocked.chart.display)
                            {
                                undocked.chart.update(undocked.row.index);
                            }
                        }
                    }
                }
            }
        }
    },
    msn:
    {
        initialized: false,
        loaded: false,
        service: null,
        timer: null,
        refresh: 
        {
            active: false,
            interval: 15,
            date: null
        },
        init: function(b)
        {
            if (stocks.msn.service != null)
            {
                if (!stocks.msn.loaded && !stocks.msn.initialized)
                {
                    stocks.msn.status.update("GettingData", 0, true);
                }
                
                clearInterval(stocks.msn.timer);
                
                stocks.msn.service.ondataready = stocks.msn.receive;
                stocks.msn.retrieve((b != null ? b : true), true);
                stocks.msn.timer = setInterval("stocks.msn.retrieve()", stocks.msn.refresh.interval * 60 * 1000);
                
                stocks.msn.loaded = true;
            }
            else
            {
                stocks.msn.load();
            }
        },
        data:
        {
            listener:
            {
                objects: [],
                add: function(o)
                {
                    if (stocks.msn.data.listener.find(o) == -1)
                    {
                        stocks.msn.data.listener.objects.push(o);
                    }
                },
                remove: function(o)
                {
                    var n = stocks.msn.data.listener.find(o);
                    
                    if (n != -1)
                    {
                        stocks.msn.data.listener.objects.splice(n, 1);
                    }
                },
                find: function(o)
                {
                    for (var i = 0; i < stocks.msn.data.listener.objects.length; i++)
                    {
                        if (stocks.msn.data.listener.objects[i] == o)
                        {
                            return i;
                        }
                    }
                    
                    return -1;
                }
            },
            parse: function()
            {
                var s = "";
                var o = [];
                
                for (var i = 0; i < stocks.array.length(); i++)
                {
                    if (!o[stocks.array.data(i, stocks.array.index.symbol)])
                    {
                        s += (i > 0 ? "," : "") + stocks.array.data(i, stocks.array.index.symbol);
                        o[stocks.array.data(i, stocks.array.index.symbol)] = true;
                    }
                }
                
                return s;
            },
            format:
            {
                config:
                {
                    percent: 2
                },
                currency: function(n)
                {
                    return (Math.round(n * 100) / 100).toLocaleString();
                },
                percent: function(s)
                {
                    if (s == null)
                    {
                        return Number("0.00").toLocaleString();
                    }
                    
                    s = s.toString().replace(/[^0-9,\.]+/g, "");
                    
                    if (s.length > 0)
                    {
                        if (s.indexOf(".") != -1)
                        {
                            s = Math.round(s.substring(0, (s.indexOf(".") + 1) + stocks.msn.data.format.config.percent + 1) * Math.pow(10, stocks.msn.data.format.config.percent + 1)) / Math.pow(10, stocks.msn.data.format.config.percent + 1);
                        }
                        
                        return Number(s).toLocaleString();
                    }
                    
                    return s;
                },
                search: function(s)
                {
                    return util.text.strip.spaces(s).replace(/[\s]+/g," ");
                }
            }
        },
        retrieve: function(b, b1)
        {
            if (stocks.msn.service != null && stocks.array.length() > 0)
            {
                if (!b1 && stocks.msn.refresh.active && stocks.msn.status.availability.active)
                {
                    stocks.msn.status.ping.update(false);
                }
                else if (System.Gadget.visible)
                {
                    var n = new Date().getTime();
                    
                    if (b || stocks.msn.refresh.date == null || n >= stocks.msn.refresh.date + (stocks.msn.refresh.interval * 60 * 1000))
                    {
                        stocks.msn.refresh.date = n;
                        stocks.msn.refresh.active = true;
                        stocks.msn.service.GetStocks(stocks.msn.data.parse());
                    }
                }
            }
        },
        receive: function(o)
        {
            if (o.RetCode == 200)
            {
                stocks.array.clear();
                
                for (var i = 0; i < o.Count; i++)
                {
                    with (o.item(i))
                    {
                        var b = (Change.toString().charAt(0) == "-" || Percent.toString().charAt(0) == "-");
                        
                        stocks.array.update(null, [Symbol, Name, Last, stocks.msn.data.format.currency(Math.abs(Change)), (b ? -1 : 1), stocks.msn.data.format.percent(Percent), stocks.config.localization.convert("StockLink") + Symbol + "&v=1", GetDayChart(undocked.chart.image.width, undocked.chart.image.height)]);
                    }
                }
                
                if (!stocks.msn.initialized)
                {
                    stocks.msn.status.update();
                    stocks.msn.initialized = true;
                }
                
                for (var i = 0; i < stocks.msn.data.listener.objects.length; i++)
                {
                    stocks.msn.data.listener.objects[i]();
                }
                
                stocks.gadget.settings.save();
            }
            else
            {
                stocks.msn.initialized = true;
                stocks.msn.status.ping.update(false);
            }
            
            stocks.msn.refresh.active = false;
        },
        search:
        {
            active: false,
            stage: -1,
            data: [],
            value: null,
            callback: null,
            send: function(s, o)
            {
                if (o != null)
                {
                    clearInterval(stocks.msn.timer);
                    
                    stocks.msn.search.value = stocks.config.localization.addprefix(s);
                    stocks.msn.search.data = [];
                    stocks.msn.search.active = true;
                    stocks.msn.search.callback = o;
                    
                    stocks.msn.service.ondataready = stocks.msn.search.receive;
                    
                    stocks.msn.search.stage = 0;
                }
                
                try
                {
                    if (stocks.msn.search.stage == 1)
                    {
                        stocks.msn.service.SearchStock("*" + stocks.msn.search.value);
                    }
                    else
                    {
                        stocks.msn.service.GetStocks(stocks.msn.search.value);
                    }
                }
                catch (e)
                {
                    stocks.msn.search.receive([]);
                }
            },
            receive: function(o)
            {
                if (o != null)
                {
                    if (o.RetCode == 200 || o.RetCode == 0)
                    {
                        if (o.Count > 0)
                        {
                            for (var i = 0; i < o.Count; i++)
                            {
                                with (o.item(i))
                                {
                                    var b = (Change.toString().charAt(0) == "-" || Percent.toString().charAt(0) == "-");
                                    
                                    stocks.msn.search.data.push([Symbol, Name, Last, stocks.msn.data.format.currency(Math.abs(Change)), (b ? -1 : 1), stocks.msn.data.format.percent(Percent), stocks.config.localization.convert("StockLink") + Symbol + "&v=1", GetDayChart(undocked.chart.image.width, undocked.chart.image.height)]);
                                }
                            }
                        }
                        
                        stocks.msn.search.stage++;
                        
                        if (stocks.msn.search.stage == 2)
                        {
                            stocks.msn.search.callback(stocks.msn.search.sort(stocks.msn.search.data, stocks.msn.search.value));
                        }
                        else
                        {
                            stocks.msn.search.send();
                            return;
                        }
                    }
                    else
                    {
                        stocks.msn.search.callback(null);
                    }
                }
                else
                {
                    stocks.msn.search.callback((stocks.msn.search.stage > 0 ? stocks.msn.search.sort(stocks.msn.search.data, stocks.msn.search.value) : null));
                }
                
                stocks.msn.search.unload();
            },
            sort: function(o, s)
            {
                var o1 = [];
                var b = false;
                
                for (var i = 0; i < o.length; i++)
                {
                    if (o[i][stocks.array.index.symbol].toLowerCase() == s.toLowerCase())
                    {
                        if (!b)
                        {
                            o1.unshift(o[i]);
                            b = true;
                        }
                    }
                    else
                    {
                        o1.push(o[i]);
                    }
                }
                
                return o1;
            },
            unload: function()
            {
                if (stocks.msn.search.active)
                {
                    stocks.msn.search.value = null;
                    stocks.msn.search.data = [];
                    stocks.msn.search.stage = -1;
                    stocks.msn.search.active = false;
                    stocks.msn.init(true);
                }
            }
        },
        status:
        {
            availability: 
            {
                index: null,
                active: true,
                error: null
            },
            update: function(s, n, b, b1)
            {
                stocks.msn.status.availability.index = (stocks.msn.status.availability.active ? null : n);
                stocks.msn.status.availability.active = (s == null || b);
                stocks.msn.status.availability.error = s;
                
                if (!b1)
                {
                    if (stocks.config.docked)
                    {
                        docked.availability.update(s, n);
                    }
                    else
                    {
                        undocked.availability.update(s, n);
                    }
                }
            },
            available: function(b)
            {
                if (b)
                {
                    stocks.msn.status.update();
                    stocks.msn.init();
                }
                else
                {
                    stocks.msn.status.update("ServiceIsUnavailable");
                }
            },
            ping:
            {
                refresh: 
                {
                    interval: 1
                },
                update: function(b, b1)
                {
                    clearInterval(stocks.msn.timer);
                    
                    if (stocks.msn.service != null)
                    {
                        if (b)
                        {
                            stocks.msn.status.available(true);
                        }
                        else
                        {
                            if (!b1)
                            {
                                stocks.msn.status.available(false);
                            }
                            
                            stocks.msn.service.ondataready = stocks.msn.status.ping.test;
                            stocks.msn.retrieve(true);
                            stocks.msn.timer = setInterval("stocks.msn.retrieve(true)", stocks.msn.status.ping.refresh.interval * 60 * 1000);
                        }
                    }
                    else
                    {
                        stocks.msn.load();
                    }
                },
                test: function(o)
                {
                    if (o.RetCode == 200)
                    {
                        stocks.msn.refresh.active = false;
                        stocks.msn.status.ping.update(true);
                    }
                }
            }
        },
        external:
        {
            open: function(n, s)
            {
                var s1 = (s != null ? s : stocks.array.data(n, stocks.array.index.news));
                
                if (s1 != null)
                {
                    util.web.url(s1);
                }
            }
        },
        load: function(b)
        {
            if (stocks.msn.service == null)
            {
                try
                {
                    var o = new ActiveXObject("wlsrvc.WLServices");
                    stocks.msn.service = o.GetService("stock");
                    if (stocks.msn.status.availability.active)
                    {
                        stocks.msn.init();
                    }
                    else
                    {
                        stocks.msn.status.ping.update(false, (stocks.msn.status.availability.error != null));
                    }
                }
                catch(e)
                {
                    stocks.msn.status.ping.update(false);
                }
            }
            else
            {
                if (stocks.msn.status.availability.active)
                {
                    stocks.msn.init((b != null ? b : null));
                }
                else
                {
                    stocks.msn.status.ping.update(false, (stocks.msn.status.availability.error != null));
                }
            }
        }
    },
    data: [],
    array:
    {
        max: 30,
        index:
        {
            symbol: 0,
            company: 1,
            price: 2,
            change: 3,
            indicator: 4,
            percent: 5,
            news: 6,
            daychart: 7
        },
        data: function(n, i)
        {
            return (stocks.data[n] == null ? null : (i != null ? (stocks.data[n][i] != null ? stocks.data[n][i] : null) : stocks.data[n]));
        },
        empty: function(s, s1)
        {
            return [s, s1, 0, 0, 1, Number("0.00").toLocaleString(), "", ""];
        },
        add: function(o, b, b1)
        {
            if (stocks.array.length() < stocks.array.max)
            {
                if (typeof o == "string")
                {
                    o = stocks.array.empty(o, "");
                }
                
                if (b1)
                {
                    stocks.data.unshift(o);
                }
                else
                {
                    stocks.data.push(o);
                }
                
                stocks.gadget.settings.save();
                
                if (!b)
                {
                    stocks.msn.retrieve(true, true);
                }
            }
            
            return stocks.array.length();
        },
        remove: function(n)
        {
            stocks.data.splice(n, 1);
            stocks.gadget.settings.save();
            
            return stocks.array.length();
        },
        find: function(n, o)
        {
            var o1 = [];
            
            for (var i = 0; i < stocks.array.length(); i++)
            {
                if (stocks.array.data(i, n).toString().toLowerCase() == o[n].toString().toLowerCase())
                {
                    o1.push(i);
                }
            }
            
            return o1;
        },
        clear: function()
        {
            for (var i = 0; i < stocks.array.length(); i++)
            {
                stocks.data[i] = stocks.array.empty(stocks.array.data(i, stocks.array.index.symbol), stocks.array.data(i, stocks.array.index.company));
            }
        },
        refresh: function(o)
        {
            if (o != null)
            {
                stocks.data = o;
                stocks.gadget.settings.save();
            }
            else
            {
                stocks.data = [];
            }
        },
        retrieve: function(n)
        {
            return stocks.data[n];
        },
        update: function(n, o)
        {
            if (n != null)
            {
                stocks.data[n] = o;
            }
            else
            {
                o1 = stocks.array.find(stocks.array.index.symbol, o);
                
                if (o1.length > 0)
                {
                    for (var i = 0; i < o1.length; i++)
                    {
                        stocks.array.update(o1[i], o);
                    }
                }
            }
        },
        swap: function(n, i)
        {
            var o = stocks.data[n];
            stocks.data[n] = stocks.data[i];
            stocks.data[i] = o;
        },
        length: function()
        {
            return stocks.data.length;
        }
    },
    update:
    {
        company: function(n)
        {
            with (document.getElementById(stocks.objects.data.id + "_company_text_" + n))
            {
                innerHTML = util.text.fill(stocks.array.data(n, stocks.array.index.company), "");
                title = util.text.fill(stocks.array.data(n, stocks.array.index.company), "");
            }
        },
        symbol: function(n)
        {
            var b = (util.text.fill(stocks.array.data(n, stocks.array.index.indicator), 1) == 1);
            var s = util.text.fill(stocks.array.data(n, (stocks.config.docked && stocks.config.user.display.company ? stocks.array.index.company : stocks.array.index.symbol)), "");
            
            with (document.getElementById(stocks.objects.data.id + "_symbol_text_" + n))
            {
                innerHTML = s;
                title = (stocks.config.docked ? stocks.array.data(n, stocks.array.index.company) : s);
            }
        },
        price: function(n)
        {
            var s = util.text.fill(stocks.array.data(n, stocks.array.index.price), 0);
            var b = (s == 0 && stocks.array.data(n, stocks.array.index.change) == 0);
            
            if (b)
            {
                s = stocks.config.localization.convert("NotAvailable");
            }
            else
            {
                s = stocks.msn.data.format.currency(s);
            }
            
            with (document.getElementById(stocks.objects.data.id + "_price_" + n))
            {
                innerHTML = s;
                title = s;
            }
        },
        change: function(n, b)
        {
            var b1 = (util.text.fill(stocks.array.data(n, stocks.array.index.indicator), 1) == 1);
            var b2 = (util.text.fill(stocks.array.data(n, stocks.array.index.price), 0) == 0 && util.text.fill(stocks.array.data(n, stocks.array.index.change), 0) == 0);
            
            var s = "";
            var s1 = "";
            
            if (!b2)
            {
                s1 += '<img src="' + stocks.config.image.path("stocks_" + (stocks.config.docked ? docked.config.image.prefix + '_' : '') + "indicator_" + (b1 ? 'up' : 'down') + ".png") + '" unselectable="on" style="width:" + (stocks.config.docked ? 9 : 16) + ";height:" + (stocks.config.docked ? 9 : 16) + "px" />';
                s += util.text.fill(stocks.array.data(n, (stocks.config.user.display.percent ? stocks.array.index.percent : stocks.array.index.change)), 0) + (stocks.config.user.display.percent ? "%" : "");
            }
            else
            {
                s += stocks.config.localization.convert("NotAvailable");
            }
            
            if (b)
            {
                return s1 + s;
            }
            
            with (document.getElementById(stocks.objects.data.id + "_change_" + n))
            {
                innerHTML = '<span unselectable="on" ' + (stocks.config.docked ? "" : "style=\"color:" + (b1 ? '#00ff80' : '#ff002a') + "\"") + '>' + (s1 + s) + '</span>';
                title = (b2 ? "" : (b1 ? '+' : '-')) + s;
            }
        }
    },
    retrieve:
    {
        company: function(n)
        {
            var w = parseInt(document.getElementById(stocks.objects.data.id + "_company_text_" + n).style.width);
            var s = util.text.trim(document.getElementById(stocks.objects.data.id + "_company_text_" + n), util.text.fill(stocks.array.data(n, stocks.array.index.company), ""), w);
            
            return {w:w,html:s};
        },
        symbol: function(n)
        {
            with (document.getElementById(stocks.objects.data.id + "_symbol_text_" + n))
            {
                return {w:parseInt(style.width),html:innerHTML};
            }
        },
        price: function(n)
        {
            with (document.getElementById(stocks.objects.data.id + "_price_" + n))
            {
                return {w:parseInt(style.width),html:innerHTML};
            }
        },
        change: function(n)
        {
            with (document.getElementById(stocks.objects.data.id + "_change_" + n))
            {
                return {w:parseInt(style.width),html:innerHTML};
            }
        }
    },
    objects:
    {
    },
    load: function()
    {
        stocks.config.localization.init();
        stocks.objects.data = stocksData;
        stocks.objects.search = stocksSearch;
        stocks.objects.result = stocksSearchResult;
        stocks.objects.chart = {
            obj: stocksChart,
            text: stocksChartText
        }
        stocks.objects.status = {
            obj: stocksStatus,
            area: stocksStatusArea,
            add: stocksStatusAdd,
            chart: stocksStatusChart
        }
        
        stocks.config.bidi.update();
        stocks.config.dock.update();
        
        if (System.Gadget.Settings.read("ChartShown"))
        {
            undocked.chart.flyout.load();
        }
        else
        {
            var o = stocks.gadget.settings.read();
            
            if (o.length > 0)
            {
                stocks.array.refresh(o);
                stocks.msn.loaded = true;
            }
            else
            {
                stocks.array.refresh();
                stocks.array.add(stocks.config.localization.market.sym1, true);
                stocks.array.add(stocks.config.localization.market.sym2, true);
                stocks.array.add(stocks.config.localization.market.sym3, true);
            }
            
            var b = System.Gadget.Settings.read("FlyoutShown");
            
            try
            {
                stocks.gadget.settings.update();
                
                if (b)
                {
                    undocked.load(true);
                }
                else
                {
                    if (System.Gadget.docked)
                    {
                        stocks.gadget.docked.load();
                    }
                    else
                    {
                        stocks.gadget.undocked.load();
                    }
                    
                    System.Gadget.onDock = stocks.gadget.docked.load;
                    System.Gadget.onUndock = stocks.gadget.undocked.load;
                    System.Gadget.Sidebar.onDockSideChanged = stocks.config.dock.changed;
                    
                    System.Gadget.settingsUI = "settings.html";
                    System.Gadget.onShowSettings = stocks.gadget.settings.show;
                    System.Gadget.onSettingsClosed = stocks.gadget.settings.closed;
                }
                
                System.Gadget.visibilityChanged = stocks.gadget.visibility.changed;
            }
            catch(e)
            {
                docked.unload();
                undocked.unload();
                
                stocks.msn.status.update("ServiceIsUnavailable", null, null, true);
                
                if (b || !System.Gadget.docked)
                {
                    undocked.load(b);
                }
                else
                {
                    docked.load();
                }
            }
        }
    }
}
