////////////////////////////////////////////////////////////////////////////////
//
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
undocked =
{
    initialized: false,
    x: 14,
    y: 13,
    config:
    {
        image:
        {
            prefix: "undocked"
        }
    },
    search:
    {
        initialized: false,
        height: 36,
        display: 0,
        active: false,
        loaded: false,
        retrieving: false,
        data: [],
        image:
        {
            submit:
            {
                state: false,
                update: function(b, b1)
                {
                    undocked.search.image.submit.state = b;
                    util.image.update(undocked.objects.search.image, stocks.config.image.path("stocks_" + (b ? 'clear' : 'search') + "_rest" + (b && b1 ? '_disabled' : '') + (stocks.config.bidi.reversed() ? '_reverse' : '') + ".png"));
                    
                    undocked.objects.search.image.alt = stocks.config.localization.convert((b ? "Clear" : "Search"));
                }
            },
            animate:
            {
                index: -1,
                reset: function()
                {
                    if (undocked.search.image.animate.index != -1)
                    {
                        util.image.animate.remove(undocked.search.image.animate.index);
                        undocked.search.image.animate.index = -1;
                    }
                }
            }
        },
        init: function(b)
        {
            undocked.objects.search = {
                text: stocksSearchText,
                area: stocksSearchArea,
                submit: stocksSearchSubmit
            }
            
            with (stocks.objects.search.style)
            {
                height = undocked.search.height + "px";
                textAlign = "center";
                background = "url(" + stocks.config.image.path('stocks_undocked_search_background.png') + ")";
                paddingTop = "6px";
            }
            
            with (undocked.objects.search.area.style)
            {
                width = undocked.search.row.config.width + "px";
                height = undocked.search.row.config.height + "px";
                background = "url(" + stocks.config.image.path('stocks_search_background.png') + ")";
                paddingTop = "1px";
            }
            
            with (undocked.objects.search.text)
            {
                className = "undockedSearchBoxText";
                style.width = "211px";
                style.height = "20px";
                style.paddingTop = "2px";
                
                if (stocks.config.bidi.reversed())
                {
                    style.paddingRight = "4px";
                }
                else
                {
                    style.paddingLeft = "4px";
                }
                
                style.border = "none";
                
                onfocus = function()
                {
                    if (!undocked.search.loaded && !undocked.search.retrieving && !undocked.search.active && !this.updating)
                    {
                        undocked.search.reset(null, true);
                    }
                    
                    this.updating = false;
                }
                
                onfocusout = function()
                {
                    if (!undocked.search.loaded && !undocked.search.retrieving && this.value == "")
                    {
                        undocked.search.reset(null, true, true);
                    }
                }
                
                onmouseleave = function()
                {
                    if (this.value == "")
                    {
                        undocked.search.reset(null, true);
                    }
                }
                
                onmousedown = function()
                {
                    if (!undocked.search.active)
                    {
                        undocked.search.reset(true);
                    }
                    
                    undocked.search.row.index = -1;
                }
                
                onkeyup = function()
                {
                    switch (event.keyCode)
                    {
                        case 27:
                            if (undocked.search.loaded)
                            {
                                undocked.search.hide(true);
                            }
                            break;
                        case 9:
                        case 37:
                        case 38:
                        case 39:
                        case 40:
                            break;
                        default:
                            if (this.value == "")
                            {
                                undocked.search.hide(true);
                            }
                            
                            undocked.action.cancel(event);
                    }
                }
                
                onkeydown = function()
                {
                    this.className = "undockedSearchBoxText";
                    
                    if (!undocked.search.loaded)
                    {
                        undocked.search.reset();
                    }
                    else
                    {
                        switch (event.keyCode)
                        {
                            case 9:
                            case 37:
                            case 38:
                            case 39:
                            case 40:
                                break;
                            default:
                                undocked.search.updated = true;
                                undocked.search.image.submit.update(false);
                        }
                    }
                    
                    if (event.keyCode == 13)
                    {
                        undocked.search.send(true);
                    }
                }
                
                title = stocks.config.localization.convert("SearchForAStock");
            }
            
            undocked.objects.search.submit.innerHTML = '<a id="stocksSearchAnchor" style="cursor:default"><img id="stocksSearchImage" src="' + stocks.config.image.path("stocks_search_rest" + (stocks.config.bidi.reversed() ? '_reverse' : '') + ".png") + '" unselectable="on" style="width:25px;height:20px;background-color:#f1f1f1;border:none" /></a>';
            
            undocked.objects.search.anchor = stocksSearchAnchor;
            undocked.objects.search.image = stocksSearchImage;
            
            undocked.objects.search.anchor.href = "javascript:undocked.search.send()";
            
            with (undocked.objects.search.image)
            {
                onmousemove = function()
                {
                    util.image.update(this, (!undocked.search.active && !undocked.search.image.submit.state ? this.src : stocks.config.image.path("stocks_" + (undocked.search.image.submit.state ? 'clear' : 'search') + "_hover" + (stocks.config.bidi.reversed() ? '_reverse' : '') + ".png")));
                }
                
                onmouseleave = function()
                {
                    util.image.update(this, (!undocked.search.active && !undocked.search.image.submit.state ? this.src : stocks.config.image.path("stocks_" + (undocked.search.image.submit.state ? 'clear' : 'search') + "_rest" + (stocks.config.bidi.reversed() ? '_reverse' : '') + ".png")));
                    this.blur();
                    
                    if (undocked.objects.search.text.value == "")
                    {
                        undocked.search.reset(null, true);
                    }
                }
                
                onmousedown = function()
                {
                    util.image.update(this, (!undocked.search.active && !undocked.search.image.submit.state ? this.src : stocks.config.image.path("stocks_" + (undocked.search.image.submit.state ? 'clear' : 'search') + "_pressed" + (stocks.config.bidi.reversed() ? '_reverse' : '') + ".png")));
                }
                
                onmouseup = function()
                {
                    util.image.update(this, (!undocked.search.active && !undocked.search.image.submit.state ? this.src : stocks.config.image.path("stocks_" + (undocked.search.image.submit.state ? 'clear' : 'search') + "_rest" + (stocks.config.bidi.reversed() ? '_reverse' : '') + ".png")));
                    this.blur();
                }
                
                alt = stocks.config.localization.convert("Search");
            }
            
            if (b)
            {
                undocked.search.show(true);
            }
            
            undocked.search.update();
            
            undocked.search.initialized = true;
        },
        row:
        {
            initialized: false,
            x: 0,
            y: 0,
            height: 20,
            index: -1,
            count: -1,
            max: 5,
            config:
            {
                width: 240,
                height: 24,
                padding: 4,
                result:
                {
                    padding: 2
                },
                select:
                {
                    padding: 3
                },
                wheel:
                {
                    increment: 10
                }
            },
            scrollbar:
            {
                active: false,
                loaded: false,
                width: 8,
                padding: 1,
                border: 1,
                block:
                {
                    x: 0,
                    y: 0,
                    height:
                    {
                        top: 1,
                        bottom: 1,
                        min: 20,
                        max: -1,
                        current: -1
                    },
                    update: function()
                    {
                        with (document.getElementById(stocks.objects.data.id + "_search_block"))
                        {
                            undocked.search.row.scrollbar.block.height.current = (undocked.search.row.scroll.dimensions.height() < undocked.search.row.scrollbar.block.height.max - undocked.search.row.scrollbar.block.height.min ? undocked.search.row.scrollbar.block.height.max - undocked.search.row.scroll.dimensions.height() : undocked.search.row.scrollbar.block.height.min);
                            
                            style.height = undocked.search.row.scrollbar.block.height.current + "px";
                            innerHTML = '<table cellspacing="0" cellpadding="0" border="0" unselectable="on" style="width:' + undocked.search.row.scrollbar.width + 'px;height:' + undocked.search.row.scrollbar.block.height.current + 'px">'+
                                        '<tr>'+
                                        '<td unselectable="on" style="height:' + undocked.search.row.scrollbar.block.height.top + 'px;background:url(' + stocks.config.image.path("stocks_search_scrollbar_top.png") + ')"></td>'+
                                        '</tr>'+
                                        '<tr>'+
                                        '<td unselectable="on" style="height:' + (undocked.search.row.scrollbar.block.height.current - (undocked.search.row.scrollbar.block.height.top + undocked.search.row.scrollbar.block.height.bottom)) + 'px;background:url(' + stocks.config.image.path("stocks_search_scrollbar_middle.png") + ') repeat-y"></td>'+
                                        '</tr>'+
                                        '<tr>'+
                                        '<td unselectable="on" style="height:' + undocked.search.row.scrollbar.block.height.bottom + 'px;background:url(' + stocks.config.image.path("stocks_search_scrollbar_bottom.png") + ')"></td>'+
                                        '</tr>'+
                                        '</table>';
                        }
                    },
                    position:
                    {
                        update: function(b)
                        {
                            var y0 = 0;

                            var o = document.getElementById(stocks.objects.data.id + "_search_block");
                            
                            if (!b && o != null)
                            {
                                y0 = parseInt(o.style.top) - undocked.search.row.scrollbar.block.y;
                            }
                            
                            var p = util.objects.coordinates(stocks.objects.data.id + "_search_scrollbar");
                                            
                            undocked.search.row.scrollbar.block.x = p.x;
                            undocked.search.row.scrollbar.block.y = p.y;
                            
                            if (o != null)
                            {
                                with (o.style)
                                {
                                    left = undocked.search.row.scrollbar.block.x + "px";
                                    top = undocked.search.row.scrollbar.block.y + y0 + "px";
                                }
                            }
                        }
                    }
                },
                insert: function()
                {
                    var x = (stocks.config.bidi.reversed() ? undocked.search.row.x + undocked.search.row.scrollbar.border : undocked.search.row.x + parseInt(stocks.objects.result.style.width) - undocked.search.row.scrollbar.width - undocked.search.row.scrollbar.border);
                    var o = util.objects.append(stocks.objects.data.id + "_search_scrollbar", x, undocked.search.row.y, undocked.search.row.scrollbar.width, parseInt(stocks.objects.result.style.height) - undocked.search.row.scrollbar.border, 2);
                    
                    with (o)
                    {
                        style.width = undocked.search.row.scrollbar.width + "px";
                        style.background = "url(" + stocks.config.image.path('stocks_search_scrollbar_background' + (stocks.config.bidi.reversed() ? "_reverse" : "") + '.png') + ") repeat-y";
                        
                        onmousedown = function()
                        {
                            undocked.row.drag.scroll.direction = (util.objects.coordinates(stocks.objects.data.id + "_search_block").y < event.clientY ? 1 : -1);
                            undocked.search.row.drag.scroll.update();
                            undocked.row.drag.scroll.move(null, undocked.search.row.dimensions.height());
                            undocked.action.cancel(event);
                        }
                    }
                    
                    o = util.objects.append(stocks.objects.data.id + "_search_block", 0, 0, undocked.search.row.scrollbar.width, undocked.search.row.scrollbar.block.height.min, 5);

                    o.onmousedown = function()
                    {
                        undocked.row.drag.start(stocks.objects.data.id + "_search_block", -1, event, null, undocked.search.row.scrollbar.block.y, undocked.search.row, true);
                        undocked.search.row.scrollbar.active = true;
                        undocked.action.cancel(event);
                    }
                    
                    undocked.search.row.scrollbar.block.position.update(true);
                    
                    undocked.search.row.scrollbar.block.height.max = undocked.search.row.dimensions.height() + (undocked.search.row.scrollbar.padding * 2);
                    undocked.search.row.scrollbar.block.update();
                    
                    undocked.search.row.scrollbar.loaded = true;
                },
                remove: function()
                {
                    util.objects.remove(stocks.objects.data.id + "_search_block");
                    util.objects.remove(stocks.objects.data.id + "_search_scrollbar");
                    
                    undocked.search.row.scrollbar.loaded = false;
                },
                dimensions:
                {
                    height: function()
                    {
                        return (undocked.search.row.scrollbar.block.height.max - undocked.search.row.scrollbar.block.height.current);
                    }
                }
            },
            drag:
            {
                scroll:
                {
                    update: function()
                    {
                        undocked.row.drag.scroll.obj = undocked.search.row;
                        undocked.row.drag.scroll.div = {
                            content: stocks.objects.data.id + "_search_0",
                            block: stocks.objects.data.id + "_search_block",
                            divider: null
                        }
                    }
                }
            },
            scroll:
            {
                index: -1,
                active: false,
                move: function(y)
                {
                    for (var i = 0; i < undocked.search.row.count; i++)
                    {
                        document.getElementById(stocks.objects.data.id + "_search_" + i).style.top = -y + (i * undocked.search.row.height) + undocked.search.row.scrollbar.padding + "px";
                    }
                    
                    stocks.objects.result.scrollTop = 0;
                },
                update: function(b)
                {
                    undocked.row.scroll.obj = (b ? undocked.search.row : null);
                    undocked.row.scroll.div = {
                        content: (b ? stocks.objects.data.id + "_search_3_" : null),
                        top: (b ? stocks.objects.data.id + "_search_0" : null),
                        block: (b ? stocks.objects.data.id + "_search_block" : null)   
                    }
                    undocked.row.scroll.offset.y = undocked.search.row.scrollbar.padding;
                },
                dimensions:
                {
                    height: function()
                    {
                        return undocked.search.row.dimensions.area.height() - undocked.search.row.dimensions.height();
                    }
                }
            },
            select: function(b, n)
            {
                if (n != -1 && !undocked.search.row.scrollbar.active)
                {
                    if (b && n != undocked.search.row.index)
                    {
                        undocked.search.row.select(false, undocked.search.row.index);
                        undocked.search.row.index = n;
                    }
                    
                    document.getElementById(stocks.objects.data.id + "_search_0_" + n).style.background = "url(" + stocks.config.image.path((b ? 'stocks_search_selected_center.png' : '')) + ")";
                    document.getElementById(stocks.objects.data.id + "_search_1_" + n).style.background = "url(" + stocks.config.image.path((b ? 'stocks_search_selected_' + stocks.config.bidi.convert("left") + '.png' : '')) + ")";
                    document.getElementById(stocks.objects.data.id + "_search_2_" + n).style.background = "url(" + stocks.config.image.path((b ? 'stocks_search_selected_' + stocks.config.bidi.convert("right") + '.png' : '')) + ")";
                }
            },
            action:
            {
                keyboard:
                {
                    active: false,
                    timer: null,
                    speed: 50,
                    delay: 100,
                    up: function(event)
                    {
                        if (undocked.search.loaded && undocked.search.row.count > 0)
                        {
                            clearTimeout(undocked.search.row.action.keyboard.timer);
                            undocked.search.row.action.keyboard.timer = null;
                                                        
                            if (!undocked.search.row.scroll.active)
                            {
                                undocked.search.row.scroll.update(true);
                                
                                switch (event.keyCode)
                                {
                                    case 38:
                                        undocked.row.scroll.direction(-1, false);
                                        break;
                                    case 40:
                                        undocked.row.scroll.direction(1, false);
                                        break;
                                }
                            }
                            
                            undocked.search.row.scroll.update(false);
                            undocked.search.row.scroll.active = false;
                        }
                    },
                    down: function(event)
                    {
                        if (undocked.search.loaded && undocked.search.row.count > 0)
                        {
                            if (undocked.search.row.action.keyboard.timer == null)
                            {
                                undocked.search.row.scroll.update(true);
                                
                                switch (event.keyCode)
                                {
                                    case 38:
                                        undocked.search.row.action.keyboard.timer = setTimeout("undocked.row.scroll.direction(-1, true)", undocked.search.row.action.keyboard.delay);
                                        break;
                                    case 40:
                                        undocked.search.row.action.keyboard.timer = setTimeout("undocked.row.scroll.direction(1, true)", undocked.search.row.action.keyboard.delay);
                                        break;
                                }
                            }
                        }
                    }
                },
                focus:
                {
                    enter: function(n, b)
                    {
                        if (b || undocked.action.pressed.tab)
                        {
                            undocked.search.row.select(true, n);
                            undocked.search.row.scroll.update(true);
                            undocked.row.scroll.to(n);
                        }
                    },
                    leave: function(n)
                    {
                        undocked.search.row.select(false, n);
                    }
                }
            },
            dimensions:
            {
                area:
                {
                    height: function()
                    {
                        return (undocked.search.row.height * undocked.search.row.count);
                    }
                },
                height: function()
                {
                    return (undocked.search.row.height * undocked.search.row.dimensions.count());
                },
                count: function()
                {
                    return Math.min(undocked.search.row.count, undocked.search.row.max);
                }
            }
        },
        show: function(b)
        {
            if (b || !undocked.search.display)
            {
                undocked.search.reset(null, true);
                
                undocked.search.display = 1;
                undocked.search.update();
                
                if (undocked.initialized && !undocked.flyout.active)
                {
                    undocked.background.update();
                    
                    if (!undocked.objects.search.text.disabled)
                    {
                        setTimeout("undocked.objects.search.text.focus()");
                    }
                }
            }
            else if (!b)
            {
                undocked.search.hide();
            }
        },
        hide: function(b)
        {
            undocked.objects.search.text.value = "";
            undocked.search.image.submit.update(false);
            
            undocked.search.row.scrollbar.remove();
            undocked.row.scroll.wheel.update(null);
            
            with (stocks.objects.result)
            {
                style.height = "";
                style.visibility = "hidden";
                innerHTML = "";
            }
            
            if (!b && !undocked.flyout.active)
            {
                undocked.search.display = 0;
                undocked.background.update();
            }
            
            undocked.search.data = [];
            undocked.search.row.count = 0;
            undocked.search.row.index = -1;
            
            undocked.search.active = false;
            undocked.search.updated = false;
            undocked.search.retrieving = false;
            undocked.search.loaded = false;
            
            stocks.msn.search.unload();
        },
        send: function(b)
        {
            if ((undocked.search.loaded && !undocked.search.updated) || undocked.search.retrieving)
            {
                undocked.search.image.animate.reset();
                undocked.search.image.submit.update(false, b);
                undocked.search.hide(true);
                
                stocks.msn.search.unload();
            }
            else if (undocked.search.active)
            {
                undocked.objects.search.text.value = stocks.msn.data.format.search(undocked.objects.search.text.value);
                
                if (undocked.objects.search.text.value != "")
                {
                    undocked.search.row.scrollbar.remove();
                    
                    with (stocks.objects.result)
                    {
                        var p = util.objects.coordinates(undocked.objects.search.area);
                        
                        style.left = (p.x + undocked.search.row.config.result.padding) + "px";
                        style.top = p.y + undocked.objects.search.area.offsetHeight + "px";
                        style.width = (undocked.search.row.config.width - (undocked.search.row.config.result.padding * 2)) + "px";
                        style.height = "";
                        style.backgroundColor = "#ffffff";
                        style.border = "solid " + undocked.search.row.scrollbar.border + "px #c6c7d2";
                        style.borderTop = "none";
                        style.padding = "3px";
                        style.visibility = "visible";
                        style.cursor = "default";
                        
                        innerHTML = '<table cellspacing="0" cellpadding="0" border="0" unselectable="on">'+
                                    '<tr>'+
                                    '<td id="' + stocks.objects.result.id + '_search_image" unselectable="on"></td>'+
                                    '<td unselectable="on" class="undockedSearchResultsStatusText" style="padding-' + stocks.config.bidi.convert("left") + ':5px">' + stocks.config.localization.convert("Searching") + '</td>'+
                                    '</tr>'
                                    '</table>';
                        
                        undocked.search.row.x = parseInt(style.left);
                        undocked.search.row.y = parseInt(style.top);
                    }
                    
                    undocked.search.image.submit.update(true, b);
                    
                    undocked.search.image.animate.reset();
                    undocked.search.image.animate.index = util.image.animate.add(document.getElementById(stocks.objects.result.id + "_search_image"), stocks.config.image.path("stocks_searching_strip.png"), 16, 288, 16, 20);
                    
                    undocked.search.updated = false;
                    undocked.search.retrieving = true;

                    stocks.msn.search.send(undocked.objects.search.text.value, undocked.search.receive);
                }
                else
                {
                    undocked.search.reset(null, true);
                }
            }
        },
        receive: function(o)
        {
            if (undocked.search.retrieving)
            {
                undocked.search.retrieving = false;
                
                undocked.search.image.animate.reset();
                
                with (stocks.objects.result)
                {
                    style.padding = "0px";
                    
                    if (o != null)
                    {
                        undocked.search.data = o;
                        undocked.search.row.count = o.length;
                        
                        var b = (undocked.search.row.count > undocked.search.row.max);
                        var w = parseInt(style.width) - (undocked.search.row.scrollbar.padding * 2) - (undocked.search.row.scrollbar.border * 2) - (b ? undocked.search.row.scrollbar.width : 0);
                        
                        if (undocked.search.row.count > 1)
                        {
                            style.height = (undocked.search.row.dimensions.height() + (undocked.search.row.scrollbar.padding * 2) + undocked.search.row.scrollbar.border) + "px";
                            
                            var s = '<table cellspacing="0" cellpadding="0" border="0" unselectable="on" style="width:' + w + 'px;height:' + undocked.search.row.dimensions.height() + '">'+
                                    '<tr>'+
                                    '<td style="width:100%;padding:0px ' + undocked.search.row.scrollbar.padding + 'px 0px ' + undocked.search.row.scrollbar.padding + 'px">'+
                                    '<ul unselectable="on" style="width:100%;margin:0px">';
                            
                            for (var i = 0; i < undocked.search.row.count; i++)
                            {
                                s += '<li id="' + stocks.objects.data.id + '_search_' + i + '" onclick="undocked.search.add(' + i + ');undocked.action.cancel(event)" onfocusin=\"undocked.search.row.action.focus.enter(' + i + ')\" onfocusout=\"undocked.search.row.action.focus.leave(' + i + ')\" onmouseenter="undocked.search.row.select(true,' + i + ')" onmouseleave="undocked.search.row.select(false,' + i + ')" unselectable="on" style="position:absolute;top:' + ((i * undocked.search.row.height) + undocked.search.row.scrollbar.padding) + 'px;height:' + undocked.search.row.height + 'px;margin:0px">'+
                                     '<table id="' + stocks.objects.data.id + '_search_0_' + i + '" cellspacing="0" cellpadding="0" border="0" unselectable="on" style="width:' + w + 'px;height:' + undocked.search.row.height + 'px">'+
                                     '<tr>'+
                                     '<td id="' + stocks.objects.data.id + '_search_1_' + i + '" unselectable="on" style="width:' + undocked.search.row.config.select.padding + 'px;white-space:nowrap" nowrap></td>'+
                                     '<td unselectable="on" style="padding:0px ' + undocked.search.row.config.padding + 'px 0px ' + undocked.search.row.config.padding + 'px"><h2 id="' + stocks.objects.data.id + '_search_' + i + '_company" unselectable="on" style="font-weight:normal;margin:0px"><a id="' + stocks.objects.data.id + '_search_3_' + i + '" href="javascript:undocked.search.add(' + i + ');undocked.action.cancel(event)" unselectable="on" class="nohover undockedSearchResultsText" style="width:' + (w - (undocked.search.row.config.padding * 2) - (undocked.search.row.config.select.padding * 2)) + 'px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;cursor:default">' + (stocks.config.bidi.reversed() ? undocked.search.data[i][1] + " - " + undocked.search.data[i][0] : undocked.search.data[i][0] + " - " + undocked.search.data[i][1]) + '</a></h2></td>'+
                                     '<td id="' + stocks.objects.data.id + '_search_2_' + i + '" unselectable="on" style="width:' + undocked.search.row.config.select.padding + 'px;white-space:nowrap" nowrap></td>'+
                                     '</tr>'+
                                     '</table>'+
                                     '</li>';
                            }
                            
                            s += '</ul>'+
                                 '</td>'+
                                 '</tr>'+
                                 '</table>';
                            
                            innerHTML = s;
                            
                            undocked.row.scroll.wheel.update(undocked.search);
                        }
                        else if (undocked.search.row.count == 1)
                        {
                            undocked.search.add(0);
                            return;
                        }
                        else
                        {
                            innerHTML = '<div class="undockedSearchResultsErrorText">' + stocks.config.localization.convert("NoResultsFound") + '</div>';
                        }
                    }
                    else
                    {
                        innerHTML = '<div class="undockedSearchResultsErrorText">' + stocks.config.localization.convert("ServiceIsUnavailable") + '</div>';
                    }
                }
                
                if (b)
                {
                    undocked.search.row.scrollbar.insert();
                }
                
                undocked.search.row.index = -1;
                undocked.search.loaded = true;
            }
        },
        add: function(n)
        {
            undocked.row.add(undocked.search.data[n]);
            
            undocked.search.hide(true);
            undocked.search.update(true);
        },
        update: function(b)
        {
            if (undocked.search.display)
            {
                if (stocks.array.length() < stocks.array.max)
                {
                    if (undocked.objects.search.text.disabled)
                    {
                        undocked.search.reset(null, true);
                        undocked.objects.search.text.disabled = false;
                    }
                    else if (b)
                    {
                        undocked.objects.search.text.updating = true;
                        undocked.objects.search.text.focus();
                    }
                }
                else
                {
                    undocked.search.reset(null, true, null, stocks.config.localization.convert("UnableToAddAStockSymbol"));
                    undocked.objects.search.text.disabled = true;
                }
            }
        },
        reset: function(b, b1, b2, s)
        {
            if (b1)
            {
                with (undocked.objects.search.text) 
                {
                    className = "undockedSearchBoxItalicText";
                    value = (s != null ? s : stocks.config.localization.convert("AddAStockSymbol"));
                }
                
                if (!b2)
                {
                    var o = undocked.objects.search.text.createTextRange();
                    
                    with (o)
                    {
                        collapse(true);
                        moveStart("character", -undocked.objects.search.text.value.length);
                        moveEnd("character", -undocked.objects.search.text.value.length);
                        moveStart("character", 0);
                        moveEnd("character", 0);
                        select();
                    }
                }
                
                undocked.search.active = false;
                undocked.search.updated = false;
                undocked.search.loaded = false;
            }
            else if (b || !undocked.search.active)
            {
                undocked.objects.search.text.value = "";
                undocked.search.active = true;
            }
        },
        position:
        {
            update: function()
            {
                if (undocked.search.initialized)
                {
                    with (stocks.objects.search.style)
                    {
                        left = undocked.x + "px";
                        top = undocked.y + "px";
                        width = undocked.row.width + "px";
                        visibility = (undocked.search.display ? "visible" : "hidden");
                    }
                    
                    undocked.search.row.scrollbar.block.position.update();
                }
            },
            bottom: function()
            {
                return undocked.y + (undocked.search.display ? undocked.search.height : 0);
            }
        },
        dimensions:
        {
            area:
            {
                height: function()
                {
                    return (undocked.search.display ? undocked.search.height : 0);
                }
            }
        },
        unload: function()
        {
            if (undocked.search.initialized)
            {
                with (undocked.objects.search.area.style)
                {
                    width = "";
                    border = "";
                }
            
                with (undocked.objects.search.text)
                {
                    className = "";
                    style.width = "";
                    style.height = "";
                    style.padding = "";
                    style.border = "";
                    
                    onmousedown = null;
                    onkeydown = null;
                    onkeyup = null;
                
                    title = "";
                }
                                
                with (undocked.objects.search.submit)
                {
                    style.backgroundColor = "";
                    innerHTML = "";
                }
                
                with (stocks.objects.search.style)
                {
                    left = "";
                    top = "";
                    width = "";
                    height = "";
                    background = "";
                    padding = "";
                    visibility = "hidden";
                }
                
                with (stocks.objects.result.style)
                {
                    left = "";
                    top = "";
                    width = "";
                    backgroundColor = "";
                }
                
                if (!undocked.flyout.active)
                {
                    undocked.search.display = 0;
                }
                
                undocked.search.hide(true);
                
                undocked.objects.search = null;
                undocked.search.initialized = false;
            }
        }
    },
    row:
    {
        width: 287,
        height: 33,
        config:
        {
            dblclick:
            {
                active: false,
                delay: 200,
                update: function(b)
                {
                    undocked.row.config.dblclick.active = b;
                }
            },
            tooltip: function(n)
            {
                document.getElementById(stocks.objects.data.id + "_" + n).title = (undocked.chart.display && n == undocked.chart.index ? stocks.config.localization.convert("HideGraph") : stocks.config.localization.convert("ShowGraph"));
            },
            padding:
            {
                bottom: 1,
                left: 3,
                right: 3
            },
            select:
            {
                padding: 2
            },
            remove:
            {
                width: 16,
                padding: 2
            },
            wheel:
            {
                increment: 16
            }
        },
        index: -1,
        count: -1,
        min: 1,
        max: 5,
        init: function()
        {
            undocked.row.count = stocks.array.length();

            stocks.objects.data.innerHTML = '<ul id="' + stocks.objects.data.id + '_ul" style="margin:0px"></ul>';
            undocked.objects.row = document.getElementById(stocks.objects.data.id + "_ul");
            
            undocked.row.initialized = true;
        },
        scrollbar:
        {
            x: 0,
            y: 0,
            active: false,
            loaded: false,
            width: 9,
            display: false,
            block:
            {
                x: 0,
                y: 0,
                width: 8,
                height:
                {
                    top: 1,
                    bottom: 1,
                    min: 20,
                    max: -1,
                    current: -1
                },
                update: function()
                {
                    if (undocked.row.scrollbar.loaded)
                    {
                        with (document.getElementById(stocks.objects.data.id + "_block"))
                        {
                            undocked.row.scrollbar.block.height.current = (undocked.row.scrollbar.dimensions.area.height() < undocked.row.scrollbar.block.height.max - undocked.row.scrollbar.block.height.min ? undocked.row.scrollbar.block.height.max - undocked.row.scrollbar.dimensions.area.height() : undocked.row.scrollbar.block.height.min);
                            
                            style.height = undocked.row.scrollbar.block.height.current + "px";
                            innerHTML = '<table cellspacing="0" cellpadding="0" border="0" style="width:' + undocked.row.scrollbar.block.width + 'px;height:' + undocked.row.scrollbar.block.height.current + 'px">'+
                                        '<tr>'+
                                        '<td style="height:' + undocked.row.scrollbar.block.height.top + 'px;background:url(' + stocks.config.image.path("stocks_undocked_scrollbar_top.png") + ')"></td>'+
                                        '</tr>'+
                                        '<tr>'+
                                        '<td style="height:' + (undocked.row.scrollbar.block.height.current - (undocked.row.scrollbar.block.height.top + undocked.row.scrollbar.block.height.bottom)) + 'px;background:url(' + stocks.config.image.path("stocks_undocked_scrollbar_middle.png") + ') repeat-y"></td>'+
                                        '</tr>'+
                                        '<tr>'+
                                        '<td style="height:' + undocked.row.scrollbar.block.height.bottom + 'px;background:url(' + stocks.config.image.path("stocks_undocked_scrollbar_bottom.png") + ')"></td>'+
                                        '</tr>'+
                                        '</table>';
                        }
                    }
                },
                move: function(o, s, y)
                {
                    var y0 = 0;
                    
                    with (document.getElementById(s).style)
                    {
                        var h = o.scrollbar.dimensions.height();
                        
                        top = o.scrollbar.block.y + Math.min(y, h) + "px";

                        if (o.scrollbar.block.height.current == o.scrollbar.block.height.min)
                        {
                            y0 = Math.floor(((parseInt(top) - o.scrollbar.block.y) / h) * o.scroll.dimensions.height());
                        }
                        else
                        {
                            y0 = parseInt(top) - o.scrollbar.block.y;
                        }
                    }
                    
                    return y0;
                },
                scroll: function(o, s, y)
                {
                    if (o.scrollbar.loaded)
                    {
                        with (document.getElementById(s).style)
                        {
                            var h = o.scrollbar.dimensions.height();

                            if (o.scrollbar.block.height.current == o.scrollbar.block.height.min)
                            {
                                y = Math.floor((y / o.scroll.dimensions.height()) * h);
                            }

                            top = o.scrollbar.block.y + Math.min(y, h) + "px";
                        }
                    }
                },
                position: 
                {
                    update: function(b)
                    {
                        var y0 = 0;

                        var o = document.getElementById(stocks.objects.data.id + "_block");
                        
                        if (!b && o != null)
                        {
                            y0 = parseInt(o.style.top) - undocked.row.scrollbar.block.y;
                        }
                        
                        undocked.row.scrollbar.block.x = undocked.row.scrollbar.x;
                        undocked.row.scrollbar.block.y = undocked.row.scrollbar.y;
                        
                        if (o != null)
                        {
                            with (o.style)
                            {
                                left = undocked.row.scrollbar.block.x + "px";
                                top = undocked.row.scrollbar.block.y + y0 + "px";
                            }
                        }
                    }
                }
            },
            insert: function()
            {
                if (undocked.row.scrollbar.loaded)
                {
                    undocked.row.scrollbar.position.update();
                    undocked.row.scrollbar.block.position.update();
                }
                else
                {
                    undocked.row.scrollbar.loaded = true;
                    
                    var o = util.objects.append(stocks.objects.data.id + "_scrollbar", 0, 0, undocked.row.scrollbar.width, undocked.row.dimensions.height(), 2);
                    
                    with (o)
                    {
                        style.width = undocked.row.scrollbar.width + "px";
                        style.background = "url(" + stocks.config.image.path('stocks_undocked_scrollbar_background' + (stocks.config.bidi.reversed() ? "_reverse" : "") + '.png') + ") repeat-y";
                        
                        onmousedown = function()
                        {
                            undocked.row.drag.scroll.direction = (util.objects.coordinates(stocks.objects.data.id + "_block").y < event.clientY ? 1 : -1);
                            undocked.row.drag.scroll.update();
                            undocked.row.drag.scroll.move(null, undocked.row.dimensions.height());
                            undocked.action.cancel(event);
                        }
                    }
                    
                    undocked.objects.row.style.width = undocked.row.dimensions.width() + "px";                    
                    
                    undocked.row.scrollbar.position.update();
                    
                    o = util.objects.append(stocks.objects.data.id + "_block", 0, 0, undocked.row.scrollbar.width, undocked.row.scrollbar.block.height.min, 3);
                    
                    o.onmousedown = function()
                    {
                        undocked.row.drag.start(stocks.objects.data.id + "_block", -1, event, null, undocked.row.scrollbar.block.y, undocked.row);
                        undocked.action.cancel(event);
                        undocked.row.scrollbar.active = true;
                    }
                    
                    undocked.row.scrollbar.block.position.update(true);
                    
                    undocked.row.scrollbar.block.height.max = undocked.row.dimensions.height();
                    undocked.row.scrollbar.block.update();
                }
            },
            remove: function()
            {
                util.objects.remove(stocks.objects.data.id + "_scrollbar");
                util.objects.remove(stocks.objects.data.id + "_block");
                undocked.row.scrollbar.loaded = false;
            },
            update: function(b)
            {
                var n = (undocked.row.count > undocked.row.max ? 1 : 0);
                
                if (n != undocked.row.scrollbar.display)
                {
                    undocked.row.scrollbar.display = n;
                    
                    if (!b)
                    {
                        if (undocked.initialized)
                        {
                            for (var i = 0; i < undocked.row.count; i++)
                            {
                                document.getElementById(stocks.objects.data.id + "_0_" + i).style.width = undocked.row.dimensions.width();
                            }
                        }
                    
                        if (!undocked.row.scrollbar.display)
                        {
                            undocked.row.scroll.move(0);
                        }
                    }
                }
            },
            dimensions:
            {
                area:
                {
                    height: function()
                    {
                        return undocked.row.dimensions.area.height() - undocked.row.dimensions.height();
                    }
                },
                height: function()
                {
                    return (undocked.row.scrollbar.block.height.max - undocked.row.scrollbar.block.height.current);
                }
            },
            position:
            {
                update: function()
                {
                    if (undocked.row.scrollbar.loaded)
                    {
                        undocked.row.scrollbar.x = undocked.x + (stocks.config.bidi.reversed() ? 0 : undocked.row.dimensions.width());
                        undocked.row.scrollbar.y = undocked.search.position.bottom();
                        
                        with (document.getElementById(stocks.objects.data.id + "_scrollbar").style)
                        {
                            left = undocked.row.scrollbar.x + "px";
                            top = undocked.row.scrollbar.y + "px";
                        }
                    }
                }
            }
        },
        add: function(o)
        {
            undocked.row.count = stocks.array.add(o, null, true);
            
            if (undocked.row.count > undocked.row.max)
            {
                undocked.row.scrollbar.display = 1;
            }
            
            if (undocked.row.count - 1 == undocked.row.min)
            {
                undocked.row.build();
            }
            else
            {
                undocked.row.unselect(Math.max(0, undocked.row.count - 2));
                undocked.objects.row.appendChild(undocked.row.content(undocked.row.count - 1));
            }
            
            if (undocked.row.scrollbar.loaded)
            {
                undocked.row.scrollbar.block.update();
            }
            else if (undocked.row.count > undocked.row.max)
            {
                undocked.row.scrollbar.insert();
            }
            else
            {
                setTimeout("undocked.background.update()");
            }
            
            if (undocked.row.scrollbar.loaded)
            {
                undocked.row.scroll.move(0);
                undocked.row.scrollbar.block.move(undocked.row, stocks.objects.data.id + "_block", 0);
            }
            
            undocked.row.adjust();
            undocked.chart.update(undocked.row.count - 1);
        },
        remove: function(n)
        {
            undocked.row.drag.index = -1;
            
            if (undocked.row.count > undocked.row.min)
            {
                undocked.search.hide(true);
                
                if (n <= undocked.row.index)
                {
                    undocked.row.index = Math.max(0, undocked.row.index - 1);
                }
                
                undocked.row.count = stocks.array.remove(n);
                undocked.background.update();
                
                undocked.row.build();
                undocked.row.adjust();
                
                undocked.row.scrollbar.update();
                undocked.row.scrollbar.block.update();
                
                if (undocked.row.scrollbar.display)
                {
                    undocked.row.scroll.index = Math.min(Math.max(0, n - 1), n - docked.row.max);
                    undocked.row.scroll.update(true);
                    undocked.row.scroll.to(Math.min(n, undocked.row.count - 1));
                }
                
                undocked.search.update();
                
                if (undocked.chart.display)
                {
                    if (n == undocked.chart.index)
                    {
                        undocked.chart.hide();
                    }
                    else if (n < undocked.chart.index)
                    {
                        undocked.chart.index--;
                    }
                }
            }
        },
        content: function(n, b)
        {
            var o;
            
            if (!b)
            {
                o = document.createElement("LI");
                
                with (o)
                {
                    id = stocks.objects.data.id + "_" + n;
                    
                    onfocusin = function()
                    {
                        if (!undocked.row.action.focus.cancel)
                        {
                            undocked.row.action.focus.enter(n, null, true);
                        }
                        
                        undocked.row.action.focus.cancel = false;
                    }
                    
                    onfocusout = function()
                    {
                        if (!undocked.row.action.focus.cancel)
                        {                    
                            undocked.row.action.focus.leave(n);
                        }
                        
                        undocked.row.action.focus.cancel = false;
                    }

                    onmousemove = function()
                    {
                        undocked.row.select(true, n);
                        undocked.row.config.tooltip(n);
                    }
                    
                    onmouseleave = function()
                    {
                        undocked.row.select(false, n);
                    }
                    
                    onmousedown = function()
                    {
                        if (event.button == 2)
                        {
                            return false;
                        }
                        
                        if (!undocked.row.config.dblclick.active)
                        {
                            if (!undocked.flyout.active)
                            {
                                undocked.search.hide(true);
                            }
                            
                            undocked.row.drag.start(stocks.objects.data.id + "_0_" + n, n, event);
                        }
                    }
                    
                    onmouseup = function()
                    {
                        if (event.button == 2)
                        {
                            return false;
                        }
                        
                        if (!undocked.row.config.dblclick.active)
                        {
                            if (!undocked.row.drag.active)
                            {
                                undocked.row.drag.end(n);
                            }
                            
                            undocked.row.config.dblclick.update(true);
                            
                            clearTimeout(undocked.row.config.dblclick.timeout);
                            undocked.row.config.dblclick.timeout = setTimeout("undocked.row.config.dblclick.update(false)", undocked.row.config.dblclick.delay);
                        }
                    }
                    
                    unselectable = "on";
                    
                    style.position = "absolute";
                    style.top = (undocked.row.height * n) + "px";
                    style.margin = "0px";
                    style.cursor = "default";
                }
            }
            
            var s = '<table id="' + stocks.objects.data.id + '_w0_' + n + '" cellspacing="0" cellpadding="0" border="0" unselectable="on" style="width:' + undocked.row.dimensions.width() + ';height:' + undocked.row.height + 'px">'+
                    '<tr>'+
                    '<td id="' + stocks.objects.data.id + '_1_' + n + '" unselectable="on" style="width:' + undocked.row.config.select.padding + 'px;background:url(' + (b ? stocks.config.image.path("stocks_selected_" + stocks.config.bidi.convert('left') + ".png") : (n < undocked.row.count - 1 || n < undocked.background.min - 1 ? stocks.config.image.path('stocks_unselected_center.png') : "")) + ');white-space:nowrap" nowrap></td>'+
                    '<td id="' + stocks.objects.data.id + '_0_' + n + '" style="background:url(' + (b ? stocks.config.image.path("stocks_selected_center.png") : (n < undocked.row.count - 1 || n < undocked.background.min - 1 ? stocks.config.image.path('stocks_unselected_center.png') : "")) + ');padding-bottom:' + undocked.row.config.padding.bottom + 'px">'+
                    '<table cellspacing="0" cellpadding="0" border="0">'+
                    '<tr>'+
                    '<td style="width:' + (stocks.config.bidi.reversed() ? undocked.row.config.padding.right : undocked.row.config.padding.left) + 'px;white-space:nowrap" nowrap></td>'+
                    '<td unselectable="on">'+
                    '<h2 id="' + stocks.objects.data.id + '_company_' + n + '" unselectable="on" class="undockedCompanyText" style="margin:0px">' + (!b ? "<a id=\"" + stocks.objects.data.id + "_company_text_" + n + "\" href=\"javascript:void(0)\" onclick=\"stocks.msn.external.open(" + n + ")\" onmousedown=\"undocked.action.cancel(event)\" onmouseup=\"undocked.action.cancel(event)\" class=\"company undockedCompanyText\" style=\"text-overflow:ellipsis;white-space:nowrap;overflow:hidden\">" : "<span style=\"color:#ffffff\">") + (b ? stocks.retrieve.company(n).html : "") + (!b ? "</a>" : "</span>") + '</h2>'+
                    '<table id="' + stocks.objects.data.id + '_w1_' + n + '" cellspacing="0" cellpadding="0" border="0" unselectable="on" style="width:' + (!b ? "100%" : document.getElementById(stocks.objects.data.id + "_w1_" + n).style.width) + '">'+
                    '<tr>'+
                    '<td id="' + stocks.objects.data.id + '_symbol_' + n + '" unselectable="on" class="undockedSymbolText" style="width:100%"><div id="' + stocks.objects.data.id + '_symbol_text_' + n + '" unselectable="on" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden">' + (b ? stocks.retrieve.symbol(n).html : "") + '</div></td>'+
                    '<td id="' + stocks.objects.data.id + '_price_' + n + '" unselectable="on" class="undockedPriceText" style="' + (b ? "width:" + stocks.retrieve.price(n).w + "px;" : "") + 'padding-' + stocks.config.bidi.convert("right") + ':' + (stocks.config.bidi.reversed() ? undocked.row.config.padding.right : undocked.row.config.padding.left) + 'px;text-align:' + stocks.config.bidi.convert("right") + ';white-space:nowrap" nowrap>' + (b ? stocks.retrieve.price(n).html : "") + '</td>'+
                    '</tr>'+
                    '</table>'+
                    '</td>'+
                    '<td style="width:' + (stocks.config.bidi.reversed() ? undocked.row.config.padding.left : undocked.row.config.padding.right) + 'px;white-space:nowrap" nowrap></td>'+
                    '<td id="' + stocks.objects.data.id + '_change_' + n + '" dir="ltr" unselectable="on" class="undockedChangeText" style="' + (b ? "width:" + stocks.retrieve.change(n).w + "px;" : "") + ';text-align:' + stocks.config.bidi.convert("right") + ';white-space:nowrap" nowrap>' + (b ? stocks.retrieve.change(n).html : "") + '</td>';
                    
            if (!b && undocked.row.count > undocked.row.min)
            {
                s += '<td unselectable="on" style="vertical-align:top;padding-top:' + undocked.row.config.remove.padding + ';white-space:nowrap" nowrap><a id="' + stocks.objects.data.id + '_remove_href_' + n + '" href="javascript:void(0)" unselectable="on" onclick="undocked.row.remove(' + n + ');undocked.action.cancel(event)" onmouseleave="this.blur()" onmouseup="this.blur()" onkeydown="if (event.keyCode == 32) { undocked.action.cancel(event); }" onkeyup="if (event.keyCode == 32) { undocked.row.remove(' + n + '); undocked.action.cancel(event); }" onmousedown=\"undocked.action.cancel(event)\" onmouseup=\"undocked.action.cancel(event)\" style="cursor:default"><img id="' + stocks.objects.data.id + '_remove_' + n + '" src="' + stocks.config.image.path("glyphs_delete_rest.png") + '" unselectable="on" onmouseenter="util.image.update(this,\'' + stocks.config.image.path("glyphs_delete_hover.png") + '\')" onmouseleave="util.image.update(this,\'' + stocks.config.image.path("glyphs_delete_rest.png") + '\')" onmousedown="util.image.update(this,\'' + stocks.config.image.path("glyphs_delete_pressed.png") + '\');undocked.action.cancel(event)" onmouseup="util.image.update(this,\'' + stocks.config.image.path("glyphs_delete_hover.png") + '\');undocked.action.cancel(event)" style="width:16px;height:16px;border:none;visibility:hidden" alt="' + stocks.config.localization.convert("Delete") + '" /></a></td>';
            }
            
            s += '</tr>'+
                 '</table>'+
                 '</td>'+
                 '<td id="' + stocks.objects.data.id + '_2_' + n + '" unselectable="on" style="width:' + undocked.row.config.select.padding + 'px;background:url(' + (b ? stocks.config.image.path("stocks_selected_" + stocks.config.bidi.convert('right') + ".png") : (n < undocked.row.count - 1 || n < undocked.background.min - 1 ? stocks.config.image.path('stocks_unselected_center.png') : "")) + ');white-space:nowrap" nowrap></td>'+
                 '</tr>'+
                 '</table>';
            
            if (b)
            {
                return util.text.strip.id(s);
            }
            else
            {
                o.innerHTML = s;
                return o;
            }
        },
        build: function()
        {
            undocked.objects.row.innerHTML = "";
            undocked.row.scrollbar.update(true);
            
            for (var i = 0; i < undocked.row.count; i++)
            {
                undocked.objects.row.appendChild(undocked.row.content(i));
            }
        },
        update: function()
        {
            if (undocked.row.initialized)
            {
                var n = stocks.array.length();
                
                if (n > 0)
                {
                    if (n != undocked.row.count)
                    {
                        undocked.row.count = n;
                        undocked.row.build();
                    }
                    
                    undocked.row.adjust();
                    undocked.chart.update();
                }
                else
                {
                    stocks.msn.status.available(false);
                }
            }
        },
        select: function(b, n, b1)
        {
            if (undocked.row.initialized)
            {
                if (n != -1)
                {
                    if ((!undocked.row.scrollbar.active && undocked.row.drag.index == -1) || b1)
                    {
                        var b2 = (n == undocked.chart.index || n == undocked.row.action.focus.index);
                        
                        var s = "";
                        
                        if (b)
                        {
                            if (b2)
                            {
                                if (undocked.row.action.focus.index != -1 && n == undocked.row.action.focus.index && undocked.row.action.focus.index != undocked.chart.index)
                                {
                                    undocked.chart.update();
                                }
                                
                                s += "selected";

                                undocked.row.index = n;
                                
                                if (undocked.row.action.focus.index != -1 && undocked.row.action.focus.index != n)
                                {
                                    undocked.row.blur(undocked.row.action.focus.index);
                                    undocked.row.action.focus.index = -1;
                                }
                                
                                undocked.row.unselect();
                            }
                            else
                            {
                                s += "hover";
                            }
                        }
                        
                        if (b || (!b && !b2))
                        {
                            var b3 = !(!b && n == undocked.row.count - 1);
                            
                            if (!b3 && undocked.row.count < undocked.background.min)
                            {
                                b3 = true;
                            }
                            
                            document.getElementById(stocks.objects.data.id + "_0_" + n).style.background = "url(" + stocks.config.image.path((b3 ? (s != "" ? "stocks_" + s + "_center.png" : "stocks_unselected_center.png") : '')) + ")";
                            document.getElementById(stocks.objects.data.id + "_1_" + n).style.background = "url(" + stocks.config.image.path((b3 ? (s != "" ? "stocks_" + s + "_" + stocks.config.bidi.convert('left') + ".png" : "stocks_unselected_center.png") : '')) + ")";
                            document.getElementById(stocks.objects.data.id + "_2_" + n).style.background = "url(" + stocks.config.image.path((b3 ? (s != "" ? "stocks_" + s + "_" + stocks.config.bidi.convert('right') + ".png" : "stocks_unselected_center.png") : '')) + ")";
                        }
                    }
                    
                    if (undocked.row.count > undocked.row.min)
                    {
                        document.getElementById(stocks.objects.data.id + "_remove_" + n).style.visibility = ((b && !undocked.row.scrollbar.active) || (b && b1 && undocked.action.pressed.tab) ? "visible" : "hidden");
                    }
                }
            }
        },
        unselect: function(n)
        {
            if (undocked.row.initialized)
            {
                if (n != -1)
                {
                    for (var i = (n != null ? n : 0); i < (n != null ? n + 1: undocked.row.count); i++)
                    {
                        var b = (i < undocked.row.count - 1 || i < undocked.background.min - 1);
                        
                        document.getElementById(stocks.objects.data.id + "_0_" + i).style.background = "url(" + (b ? stocks.config.image.path('stocks_unselected_center.png') : '') + ")";
                        document.getElementById(stocks.objects.data.id + "_1_" + i).style.background = "url(" + (b ? stocks.config.image.path('stocks_unselected_center.png') : '') + ")";
                        document.getElementById(stocks.objects.data.id + "_2_" + i).style.background = "url(" + (b ? stocks.config.image.path('stocks_unselected_center.png') : '') + ")";
                        
                        if (undocked.row.count > undocked.row.min)
                        {
                            document.getElementById(stocks.objects.data.id + "_remove_" + i).style.visibility = "hidden";
                        }
                    }
                }
            }
        },
        blur: function(n)
        {
            if (undocked.row.initialized)
            {
                if (n != -1)
                {
                    document.getElementById(stocks.objects.data.id + "_company_text_" + n).blur();
                    
                    if (undocked.row.count > undocked.row.min)
                    {
                        document.getElementById(stocks.objects.data.id + "_remove_href_" + n).blur();
                    }
                }
            }
        },
        drag:
        {
            x: 0,
            y: 0,
            obj: null,
            div: null,
            index: -1,
            active: false,
            divider:
            {
                height: 6
            },
            start: function(s, n, e, x0, y0, o, b)
            {
                if (!b)
                {
                    undocked.row.unselect();
                }
                
                var p = util.objects.coordinates(s);
                
                undocked.row.drag.x = e.clientX - p.x + (x0 != null ? x0 : 0);
                undocked.row.drag.y = e.clientY - p.y + (y0 != null ? y0 : 0);
                undocked.row.drag.obj = o;
                undocked.row.drag.div = s;
                undocked.row.drag.index = n;
            },
            end: function(n)
            {
                if (undocked.row.drag.active)
                {
                    if (undocked.row.drag.index != undocked.row.drag.insert.index)
                    {
                        undocked.row.drag.insert.update();
                        undocked.chart.update(undocked.row.drag.insert.index);
                    }
                    
                    undocked.row.index = undocked.row.drag.insert.index;
                    undocked.row.select(true, undocked.row.index, true);
                    
                    undocked.row.drag.x = 0;
                    undocked.row.drag.y = 0;
                    
                    clearTimeout(undocked.row.drag.scroll.timer);
                    undocked.row.drag.scroll.active = false;
                    
                    util.objects.remove(stocks.objects.data.id + "_drag");
                    util.objects.remove(stocks.objects.data.id + "_divider");
                }
                else if (n != null)
                {
                    if (!undocked.row.config.dblclick.active)
                    {
                        undocked.chart.toggle(n);
                        undocked.row.config.tooltip(n);
                    }
                }
                
                undocked.row.drag.obj = null;
                undocked.row.drag.index = -1;
                undocked.row.drag.insert.index = -1;
                undocked.row.drag.active = false;
                
                undocked.row.drag.scroll.y = null;
                undocked.row.drag.scroll.timer = null;
                undocked.row.scrollbar.active = false;
                
                undocked.search.row.scrollbar.active = false;
            },
            scroll: 
            {
                y: null,
                direction: null,
                obj: null,
                div:
                {
                    content: null,
                    block: null,
                    divider: null
                },
                active: false,
                increment: 5,
                speed: 5,
                timer: null,
                delay: 300,
                move: function(b, inc)
                {
                    var o = undocked.row.drag.scroll.obj;
                    
                    if (b != null)
                    {
                        undocked.row.drag.scroll.direction = (b ? -1 : 1);
                    }
                    
                    if (inc == null)
                    {
                        undocked.row.drag.scroll.timer = setTimeout("undocked.row.drag.scroll.move()", undocked.row.drag.scroll.speed);
                    }
                    
                    var y0, y1;
                    
                    with (document.getElementById(undocked.row.drag.scroll.div.content).style)
                    {
                        y0 = (undocked.row.drag.scroll.direction * (inc == null ? undocked.row.drag.scroll.increment : inc)) - parseInt(top);
                        
                        if (undocked.row.drag.scroll.direction == 1 && o.scroll.dimensions.height() < Math.abs(y0))
                        {
                            y0 = o.scroll.dimensions.height();
                            clearTimeout(undocked.row.drag.scroll.timer);
                        }
                        else if (undocked.row.drag.scroll.direction == -1 && y0 <= 0)
                        {
                            y0 = 0;
                            clearTimeout(undocked.row.drag.scroll.timer);
                        }
                        
                        o.scroll.move(y0);
                    }
                    
                    if (document.getElementById(undocked.row.drag.scroll.div.block) != null)
                    {
                        with (document.getElementById(undocked.row.drag.scroll.div.block).style)
                        {
                            if (o.scrollbar.block.height.current == o.scrollbar.block.height.min)
                            {
                                top = o.scrollbar.block.y + Math.floor(y0 * (o.scrollbar.dimensions.height() / o.scroll.dimensions.height())) + "px";
                            }
                            else
                            {
                                top = o.scrollbar.block.y + y0 + "px";
                            }
                        }
                    }
                    
                    if (inc == null && undocked.row.drag.scroll.div.divider != null)
                    {
                        var p = Math.abs(parseInt(document.getElementById(undocked.row.drag.scroll.div.content).style.top));
                        var n = Math.floor(p / o.height);
                        
                        y1 = -(p % o.height);
                        
                        if (undocked.row.drag.scroll.direction == 1)
                        {
                            y1 += (o.max - 1) * o.height;
                        }
                                                
                        undocked.row.drag.insert.index = n + Math.floor((y1 + Math.floor(o.height / 2)) / o.height);
                        
                        if (undocked.row.drag.index != undocked.row.drag.insert.index)
                        {
                            if (undocked.row.drag.index > undocked.row.drag.insert.index)
                            {
                                y1 -= o.height;
                            }
                            
                            with (document.getElementById(undocked.row.drag.scroll.div.divider).style)
                            {
                                top = undocked.search.position.bottom() + Math.max(0, Math.min(y1 + o.height, o.dimensions.height())) - Math.floor(o.drag.divider.height / 2) + "px";
                                visibility = "visible";
                            }
                        }
                        else
                        {
                            document.getElementById(undocked.row.drag.scroll.div.divider).style.visibility = "hidden";
                        }
                    }
                },
                update: function()
                {
                    undocked.row.drag.scroll.obj = undocked.row;
                    
                    with (undocked.row.drag.scroll.div)
                    {
                        content = stocks.objects.data.id + "_0";
                        block = stocks.objects.data.id + "_block";
                        divider = stocks.objects.data.id + "_divider";
                    }
                }
            },
            move: function(event)
            {
                if (undocked.row.drag.index != -1 && undocked.row.count > 1)
                {
                    if (!undocked.row.drag.active)
                    { 
                        var o = util.objects.append(stocks.objects.data.id + "_drag", undocked.x + (undocked.row.scrollbar.loaded && stocks.config.bidi.reversed() ? undocked.row.scrollbar.width : 0), 0, undocked.row.dimensions.width(), undocked.row.height, 3, null, 80);
                        o.innerHTML = undocked.row.content(undocked.row.drag.index, true);

                        util.objects.append(stocks.objects.data.id + "_divider", undocked.x + (undocked.row.scrollbar.loaded && stocks.config.bidi.reversed() ? undocked.row.scrollbar.width : 0), 0, undocked.row.dimensions.width(), undocked.row.drag.divider.height, 2, "url(" + stocks.config.image.path('stocks_divider' + (undocked.row.scrollbar.loaded ? "_scrollbar" : "") + '.png') + ") no-repeat");
                        
                        undocked.row.drag.active = true;
                    }

                    var h = event.clientY - undocked.row.drag.y;
                    var y0 = (h + undocked.row.height < undocked.row.drag.position.bottom() ? Math.max(undocked.search.position.bottom(), h) : undocked.row.drag.position.bottom() - undocked.row.height);
                    
                    document.getElementById(stocks.objects.data.id + "_drag").style.top = y0 + "px";
                    
                    if (!undocked.row.drag.scroll.active && undocked.row.count > undocked.row.max && (y0 == undocked.search.position.bottom() || y0 + undocked.row.height == undocked.row.drag.position.bottom()) && !undocked.row.drag.scroll.active)
                    {
                        undocked.row.drag.scroll.y = y0;
                        undocked.row.drag.scroll.update();
                        undocked.row.drag.scroll.timer = setTimeout("undocked.row.drag.scroll.move(" + (y0 == undocked.search.position.bottom()) + ")", undocked.row.drag.scroll.delay);
                        undocked.row.drag.scroll.active = true;
                    }
                    else if (y0 != undocked.row.drag.scroll.y)
                    {
                        clearTimeout(undocked.row.drag.scroll.timer);
                        undocked.row.drag.scroll.active = false;
                    }
                    
                    var p = Math.abs(parseInt(document.getElementById(stocks.objects.data.id + "_0").style.top));
                    var n = Math.floor(p / undocked.row.height);

                    var y1 = -(p % undocked.row.height);
                    
                    undocked.row.drag.insert.index = n + Math.floor((y0 - y1 + Math.floor(undocked.row.height / 2) - undocked.search.position.bottom()) / undocked.row.height);
                    
                    if (undocked.row.drag.index != undocked.row.drag.insert.index)
                    {
                        if (undocked.row.drag.index > undocked.row.drag.insert.index)
                        {
                            n++;
                        }
                        
                        with (document.getElementById(stocks.objects.data.id + "_divider").style)
                        {
                            top = undocked.search.position.bottom() + Math.max(0, Math.min(y1 + (undocked.row.height * ((undocked.row.drag.insert.index - n) + 1)), undocked.row.dimensions.height())) - Math.floor(undocked.row.drag.divider.height / 2) + "px";
                            visibility = "visible";
                        }
                    }
                    else
                    {
                        document.getElementById(stocks.objects.data.id + "_divider").style.visibility = "hidden";
                    }
                }
                else if (undocked.row.drag.obj != null)
                {
                    var y1 = event.clientY - undocked.row.drag.y;
                    
                    if (y1 >= 0)
                    {
                        var y2 = undocked.row.scrollbar.block.move(undocked.row.drag.obj, undocked.row.drag.div, y1);

                        undocked.row.drag.obj.scroll.move(y2);
                    }
                }
            },
            insert:
            {
                index: -1,
                update: function()
                {
                    if (undocked.row.drag.insert.index != -1 && undocked.row.drag.index != undocked.row.drag.insert.index)
                    {
                        var o = stocks.array.retrieve(undocked.row.drag.index);

                        if (undocked.row.drag.index > undocked.row.drag.insert.index)
                        {
                            for (var i = undocked.row.drag.index; i >= undocked.row.drag.insert.index; i--)
                            {
                                stocks.array.update(i, stocks.array.retrieve(i - 1));
                            }
                        }
                        else
                        {
                            for (var i = undocked.row.drag.index; i < undocked.row.drag.insert.index; i++)
                            {
                                stocks.array.update(i, stocks.array.retrieve(i + 1));
                            }
                        }
                        
                        stocks.array.update(undocked.row.drag.insert.index, o);
                        stocks.gadget.settings.save();
                        
                        undocked.row.adjust();
                    }
                }
            },
            position:
            {
                bottom: function()
                {
                    return undocked.search.position.bottom() + ((undocked.row.count < undocked.background.min ? Math.min(undocked.row.count, undocked.background.min) : Math.min(undocked.row.count, undocked.row.max)) * undocked.row.height);
                }
            }
        },
        move: function(n, d)
        {
            var i = n + d;
            
            if (i >= 0 && i < undocked.row.count)
            {
                stocks.array.swap(n, i);
                
                undocked.row.build();
                undocked.row.adjust();
                
                undocked.row.action.focus.index = undocked.chart.index = -1;
                undocked.row.action.focus.enter(i, true);
                
                undocked.row.scroll.active = true;
            }
        },
        scroll:
        {
            obj: null,
            div: null,
            index: -1,
            active: false,
            offset:
            {
                y: 0
            },
            move: function(y)
            {
                for (var i = 0; i < undocked.row.count; i++)
                {
                    document.getElementById(stocks.objects.data.id + "_" + i).style.top = -y + (i * undocked.row.height) + "px";
                }
            },
            to: function(n)
            {
                var o = undocked.row.scroll.obj;
                
                var y = 0;
                    
                var y0 = Math.abs(parseInt(document.getElementById(undocked.row.scroll.div.top).style.top)) - undocked.row.scroll.offset.y;
                var y1 = Math.min(y0 + o.dimensions.height(), o.dimensions.area.height());
                var y2 = n * o.height;
                
                if ((y2 > y0 && y2 < y1) || y2 < o.dimensions.height())
                {
                    if (y2 > o.dimensions.height())
                    {
                        y = -1;
                    }
                }
                else
                {
                    if (n > o.scroll.index)
                    {
                        y = ((n + 1) * o.height) - o.dimensions.height();
                    }
                    else
                    {
                        y = y2;
                    }
                }
                 
                if (y != -1)
                {   
                    o.scroll.move(y);
                    undocked.row.scrollbar.block.scroll(o, undocked.row.scroll.div.block, y);
                }
                
                o.scroll.index = n;
            },
            direction: function(n, b)
            {
                var o = undocked.row.scroll.obj;
                var b1 = true;
                
                var i = o.index;
                o.index += n;
                
                if (o.index < 0)
                {
                    o.index = 0;
                    b1 = false;
                }
                else if (o.index == o.count)
                {
                    o.index = o.count - 1;
                    b1 = false;
                }
                
                if (i >= 0 && i < o.count && o.count > 1)
                {
                    o.action.focus.leave(i);
                }
                
                o.action.focus.enter(o.index, true);
                document.getElementById(undocked.row.scroll.div.content + o.index).focus();
                
                if (b && b1)
                {
                    o.action.keyboard.timer = setTimeout("undocked.row.scroll.direction(" + n + ",true)", o.action.keyboard.speed);
                }
                else
                {
                    o.action.keyboard.timer = null;
                }
                
                o.scroll.active = (b && b1);
            },
            wheel:
            {
                obj: null,
                move: function(event)
                {
                    undocked.row.drag.scroll.direction = (event.wheelDelta > 0 ? -1 : 1);
                    
                    if (undocked.row.scroll.wheel.obj == null)
                    {
                        undocked.row.scroll.wheel.update(undocked);
                    }
                    
                    with (undocked.row.scroll.wheel.obj.row)
                    {
                        if (count > max)
                        {
                            drag.scroll.update();
                            undocked.row.drag.scroll.move(null, config.wheel.increment);
                        }
                    }
                },
                update: function(o)
                {
                    undocked.row.scroll.wheel.obj = o;
                }
            },
            update: function(b)
            {
                undocked.row.scroll.obj = (b ? undocked.row : null);
                undocked.row.scroll.div = {
                    content: (b ? stocks.objects.data.id + "_company_text_" : null),
                    top: (b ? stocks.objects.data.id + "_0" : null),
                    block: (b ? stocks.objects.data.id + "_block" : null)
                }
                undocked.row.scroll.offset.y = 0;
            },
            dimensions:
            {
                height: function()
                {
                    return (undocked.row.height * undocked.row.count) - undocked.row.dimensions.height();
                }
            }
        },
        adjust: function()
        {
            var w0 = 0;
            var w1 = 0;
            
            for (var i = 0; i < undocked.row.count; i++)
            {
                document.getElementById(stocks.objects.data.id + "_company_text_" + i).innerHTML = "";
                document.getElementById(stocks.objects.data.id + "_company_text_" + i).style.width = "0px";
                
                document.getElementById(stocks.objects.data.id + "_change_" + i).innerHTML = "";
                document.getElementById(stocks.objects.data.id + "_change_" + i).style.width = "0px";
                
                document.getElementById(stocks.objects.data.id + "_symbol_text_" + i).innerHTML = "";
                document.getElementById(stocks.objects.data.id + "_symbol_text_" + i).style.width = "0px";
                
                document.getElementById(stocks.objects.data.id + "_price_" + i).innerHTML = "";
                document.getElementById(stocks.objects.data.id + "_price_" + i).style.width = "0px";
                
                document.getElementById(stocks.objects.data.id + "_w0_" + i).style.width = undocked.row.dimensions.width() + "px";
                w0 = Math.max(w0, util.text.trim(document.getElementById(stocks.objects.data.id + "_change_" + i), stocks.update.change(i, true)));
            }
            
            for (var i = 0; i < undocked.row.count; i++)
            {
                document.getElementById(stocks.objects.data.id + "_change_" + i).style.width = w0 + "px";
                stocks.update.change(i);
            }
            
            w1 = undocked.row.dimensions.width() - (w0 + (undocked.row.config.padding.left + undocked.row.config.padding.right) + (undocked.row.count > undocked.row.min ? undocked.row.config.remove.width : (stocks.config.bidi.reversed() ? undocked.row.config.padding.left : undocked.row.config.padding.right)) + (undocked.row.config.select.padding * 2));
            
            for (var i = 0; i < undocked.row.count; i++)
            {
               document.getElementById(stocks.objects.data.id + "_w1_" + i).style.width = w1 + "px";
            }
            
            w0 = document.getElementById(stocks.objects.data.id + "_company_0").offsetWidth;
            
            for (var i = 0; i < undocked.row.count; i++)
            {
                var w2 = util.text.trim(document.getElementById(stocks.objects.data.id + "_company_text_" + i), stocks.array.data(i, stocks.array.index.company));
                document.getElementById(stocks.objects.data.id + "_company_text_" + i).style.width = Math.min(w0, w2) + "px";
                stocks.update.company(i);
            }
            
            w0 = 0;
            
            for (var i = 0; i < undocked.row.count; i++)
            {
                stocks.update.price(i);
                w0 = Math.max(w0, document.getElementById(stocks.objects.data.id + "_price_" + i).offsetWidth);
            }
            
            for (var i = 0; i < undocked.row.count; i++)
            {
                document.getElementById(stocks.objects.data.id + "_price_" + i).style.width = w0 + "px";
            }
            
            w0 = document.getElementById(stocks.objects.data.id + "_symbol_0").offsetWidth;
            
            for (var i = 0; i < undocked.row.count; i++)
            {
                var w2 = util.text.trim(document.getElementById(stocks.objects.data.id + "_symbol_text_" + i), stocks.array.data(i, stocks.array.index.symbol));
                document.getElementById(stocks.objects.data.id + "_symbol_text_" + i).style.width = Math.min(w0, w2) + "px";
                stocks.update.symbol(i);
            }
        },
        action:
        {
            keyboard:
            {
                active: false,
                timer: null,
                speed: 100,
                delay: 100,
                up: function(event)
                {
                    if (!undocked.search.active)
                    {
                        clearTimeout(undocked.row.action.keyboard.timer);
                        undocked.row.action.keyboard.timer = null;
                                                    
                        if (!undocked.row.scroll.active)
                        {
                            undocked.row.scroll.update(true);
                            
                            switch (event.keyCode)
                            {
                                case 38:
                                    undocked.row.scroll.direction(-1, false);
                                    break;
                                case 40:
                                    undocked.row.scroll.direction(1, false);
                                    break;
                            }
                        }
                        
                        undocked.row.scroll.update(false);
                        undocked.row.scroll.active = false;
                    }
                },
                down: function(event)
                {
                    if (!undocked.search.active)
                    {
                        if (event.altKey)
                        {
                            var n = (undocked.chart.index != -1 ? undocked.chart.index : (undocked.row.action.focus.index != -1 ? undocked.row.action.focus.index : (undocked.row.index != -1 ? undocked.row.index : -1)));
                            
                            if (n != -1)
                            {
                                switch (event.keyCode)
                                {
                                    case 38:
                                        undocked.row.move(n, -1);
                                        break;
                                    case 40:
                                        undocked.row.move(n, 1);
                                        break;
                                }
                            }
                            
                            return;
                        }
                        
                        if (undocked.row.action.keyboard.timer == null)
                        {
                            undocked.row.scroll.update(true);
                            
                            switch (event.keyCode)
                            {
                                case 38:
                                    undocked.row.action.keyboard.timer = setTimeout("undocked.row.scroll.direction(-1, true)", undocked.row.action.keyboard.delay);
                                    break;
                                case 40:
                                    undocked.row.action.keyboard.timer = setTimeout("undocked.row.scroll.direction(1, true)", undocked.row.action.keyboard.delay);
                                    break;
                            }
                        }
                        
                        switch (event.keyCode)
                        {
                            case 32:
                                if (undocked.chart.display)
                                {
                                    undocked.chart.hide();
                                }
                                else
                                {
                                    undocked.chart.toggle();   
                                }
                                break;
                        }
                    }
                }
            },
            focus:
            {
                index: -1,
                cancel: false,
                enter: function(n, b, b1)
                {
                    if (b || undocked.action.pressed.tab)
                    {
                        if (n != undocked.row.action.focus.index)
                        {
                            undocked.chart.unselect();
                            
                            undocked.row.action.focus.index = undocked.row.index = n;
                            undocked.row.scroll.update(true);
                            undocked.row.scroll.to(n);
                            
                            undocked.chart.update(n);
                        }

                        undocked.row.select(true, n, b1);
                        undocked.row.action.focus.cancel = b;
                    }
                },
                leave: function(n)
                {
                    var i = undocked.row.action.focus.index;
                    undocked.row.action.focus.index = -1;
                    undocked.row.select(false, n);
                    undocked.row.action.focus.index = i;
                }
            }
        },
        position:
        {
            update: function()
            {
                if (undocked.row.initialized)
                {
                    with (stocks.objects.data.style)
                    {
                        left = undocked.x + "px";
                        top = undocked.search.position.bottom() + "px";
                        width = undocked.row.dimensions.area.width() + "px";
                        height = undocked.row.dimensions.height() + "px";
                    }
                    
                    undocked.row.scrollbar.update();
                    
                    if (undocked.row.scrollbar.display)
                    {
                        undocked.row.scrollbar.insert();
                    }
                    else
                    {
                        undocked.row.scrollbar.remove();
                    }
                    
                    undocked.objects.row.style.width = undocked.row.dimensions.width() + "px";
                }
            },
            top: function()
            {
                return undocked.search.position.bottom();
            },
            bottom: function()
            {
                return undocked.row.position.top() + undocked.row.dimensions.height();
            }
        },
        dimensions:
        {
            area:
            {
                width: function()
                {
                    return undocked.row.width;
                },
                height: function()
                {
                    return undocked.row.height * undocked.row.count;
                }
            },
            width: function()
            {
                return undocked.row.width - (undocked.row.scrollbar.display ? undocked.row.scrollbar.width : 0);
            },
            height: function()
            {
                return undocked.row.height * Math.max(undocked.row.dimensions.count(), undocked.background.min);
            },
            count: function()
            {
                return Math.min(undocked.row.count, undocked.row.max);
            }
        },
        unload: function(b)
        {
            if (undocked.row.initialized)
            {
                with (stocks.objects.data)
                {
                    style.left = "";
                    style.top = "";
                    style.width = "";
                    style.height = "";
                    innerHTML = "";
                }
                
                if (undocked.row.drag.active)
                { 
                    util.objects.remove(stocks.objects.data.id + "_drag");
                    util.objects.remove(stocks.objects.data.id + "_divider");
                    undocked.row.drag.active = false;
                }
                    
                undocked.row.scrollbar.remove();
                
                if (!b)
                {
                    undocked.row.count = 0;
                }
                
                undocked.row.initialized = false;               
            }
        }
    },
    chart:
    {
        initialized: false,
        height : 114,
        index: -1,
        display: 0,
        image:
        {
            width: 230,
            height: 80,
            padding: 10,
            color:
            {
                up: {
                    bg: "FFFFFF",
                    grid: "45E595",
                    line: "006633",
                    fill: "00FF80"
                },
                down: {
                    bg: "FFFFFF",
                    grid: "CC3D55",
                    line: "4D000D",
                    fill: "FF4C6A"
                },
                retrieve: function(n)
                {
                    var o = (n == -1 ? undocked.chart.image.color.down : undocked.chart.image.color.up);
                    return "&clrFR=" + o.bg + "&clrGR=" + o.grid + "&clrS1=" + o.line + "&clrS2=" + o.fill;
                }
            }
        },
        offset:
        {
            x: 1
        },
        init: function()
        {
            undocked.objects.chart = {
                area: stocksChartArea,
                image: null,
                anchor: null
            }
            
            stocks.objects.chart.obj.style.backgroundColor = "#ffffff";
            
            with (stocks.objects.chart.text)
            {
                className = "undockedChartText";
                innerHTML = stocks.config.localization.convert("PoweredByMSNMoney");
            }
            
            with (undocked.objects.chart.area)
            {
                style.textAlign = "center";
                innerHTML = '<a id="stocksChartAnchor"><img id="stocksChartImage" unselectable="on" style="border:none" /></a>';
            }
            
            undocked.objects.chart.anchor = stocksChartAnchor;
            undocked.objects.chart.anchor.href = "javascript:undocked.chart.external.open()";
            
            undocked.objects.chart.image = stocksChartImage;
            
            with (undocked.objects.chart.image)
            {
                style.width = undocked.chart.image.width + "px";
                style.height = undocked.chart.image.height + "px";
            }
        
            undocked.chart.initialized = true;
        },
        toggle: function(n, b)
        {
            if (!b)
            {
                undocked.chart.display = (n != null && n != undocked.chart.index ? 1 : (undocked.chart.display ? 0 : 1));
                undocked.objects.status.chart.image.alt = stocks.config.localization.convert((undocked.chart.display ? "Hide" : "Show") + 'StockGraph');
            }
            
            undocked.chart.unselect();
            
            if (undocked.chart.display && n == null)
            {
                n = (undocked.row.index != -1 ? undocked.row.index : (undocked.row.action.focus.index != -1 ? undocked.row.action.focus.index : 0));
            }
            
            if (undocked.chart.display)
            {
                undocked.chart.index = undocked.row.index = n;
                undocked.row.select(true, n, undocked.chart.display);
            }
            
            undocked.chart.update();
            undocked.background.update();
        },
        hide: function()
        {
            undocked.chart.unselect();
            undocked.chart.display = 0;
            undocked.background.update();
            
            undocked.objects.status.chart.image.alt = stocks.config.localization.convert("ShowStockGraph");
        },
        unselect: function()
        {
            if (undocked.chart.index != -1)
            {
                undocked.row.blur(undocked.row.action.focus.index);
                
                var n = undocked.chart.index;
                undocked.chart.index = undocked.row.action.focus.index = -1;
                
                if (n < undocked.row.count)
                {
                    undocked.row.select(false, n, true);
                }
            }
        },
        update: function(n)
        {
            if ((n != -1 && undocked.chart.display) || undocked.chart.flyout.active)
            {
                n = (n != null ? n : undocked.chart.index);
                
                var s = (undocked.chart.flyout.active ? undocked.chart.flyout.image : util.text.fill(stocks.array.data(n, stocks.array.index.daychart), ""));
                
                if (s)
                {
                    with (undocked.objects.chart.image)
                    {
                        src = s + undocked.chart.image.color.retrieve(util.text.fill((undocked.chart.flyout.active ? undocked.chart.flyout.indicator : stocks.array.data(n, stocks.array.index.indicator)), 1));
                        title = (s != "" ? stocks.config.localization.convert('MSNMoney') : "");
                    }
                    
                    undocked.chart.index = n;
                }
                else if (!undocked.chart.flyout.active)
                {
                    undocked.chart.hide();
                }
            }
        },
        external:
        {
            open: function()
            {
                if (undocked.chart.index != -1 || undocked.chart.flyout.url != null)
                {
                    stocks.msn.external.open(undocked.chart.index, undocked.chart.flyout.url);
                }
            }
        },
        flyout:
        {
            x: 3,
            y: 3,
            config:
            {
                width: 256,
                height: 120,
                padding: 3
            },
            url: null,
            image: null,
            indicator: null,
            active: false,
            init: function()
            {
                if (undocked.flyout.active)
                {
                    with (document.body.style)
                    {
                        width = undocked.chart.flyout.config.width + "px";
                        height = undocked.chart.flyout.config.height + "px";
                    }
                    
                    stocksBackground.style.width = undocked.chart.flyout.config.width + "px";
                    stocksBackground.style.height = undocked.chart.flyout.config.height + "px";
                    stocksBackground.src = "url(" + stocks.config.image.path('stocks_flyout_chart.png') + ") no-repeat";
                    
                    with (stocks.objects.chart.obj.style)
                    {
                        left = undocked.chart.flyout.x + "px";
                        top = undocked.chart.flyout.y + "px";
                        width = undocked.chart.image.width + (undocked.chart.image.padding * 2) + "px";
                        height = undocked.chart.height + "px";
                        visibility = "visible";
                    }
                    
                    if (!undocked.chart.flyout.url)
                    {
                        with (undocked.objects.chart.anchor)
                        {
                            style.cursor = "default";
                            href = "javascript:void(0)";
                        }
                    }
                    
                    document.onkeydown = undocked.chart.flyout.action.keyboard.down;
                    
                    undocked.chart.flyout.active = true;
                    
                    undocked.chart.update();
                }
            },
            hide: function()
            {
                if (undocked.chart.flyout.active)
                {
                    System.Gadget.Flyout.show = false;
                }
            },
            action:
            {
                keyboard:
                {
                    down: function()
                    {
                        switch (event.keyCode)
                        {
                            case 27:
                                undocked.chart.flyout.hide();
                                break;
                        }
                    }
                }
            },
            unload: function()
            {
                if (undocked.flyout.active)
                {
                    with (stocks.objects.chart.obj.style)
                    {
                        left = "";
                        top = "";
                        width = "";
                        height = "";
                        visibility = "hidden";
                    }
                    
                    undocked.background.unload();
                    
                    document.onmousedown = null;
                    
                    undocked.chart.flyout.url = null;
                    undocked.chart.flyout.active = false;
                }
            },
            load: function()
            {
                undocked.flyout.active = true;
                
                undocked.chart.flyout.url = System.Gadget.Settings.read("ChartURL");
                undocked.chart.flyout.image = System.Gadget.Settings.read("ChartImage");
                undocked.chart.flyout.indicator = System.Gadget.Settings.read("ChartIndicator");
                
                undocked.chart.init();
                undocked.chart.flyout.init();
            }
        },
        position: 
        {
            update: function()
            {
                if (undocked.chart.initialized)
                {
                    with (stocks.objects.chart.obj.style)
                    {
                        if (undocked.chart.display)
                        {
                            left = (undocked.x + undocked.chart.offset.x) + "px";
                            top = undocked.row.position.bottom() + "px";
                            width = undocked.row.width - (undocked.chart.offset.x * 2) + "px";
                            height = undocked.chart.height + "px";
                        }
                                                    
                        visibility = (undocked.chart.display ? "visible" : "hidden");
                    }
                }
            },
            bottom: function()
            {
                return undocked.row.position.bottom() + (undocked.chart.display ? undocked.chart.height : 0);
            }
        },
        dimensions:
        {
            area:
            {
                height: function()
                {
                    return (undocked.chart.display ? undocked.chart.height : 0);
                }
            }
        },
        unload: function()
        {
            if (undocked.chart.initialized)
            {
                undocked.chart.display = 0;
                
                with (undocked.objects.chart.image)
                {
                    style.width = "";
                    style.height = "";
                    src = "";
                    title = "";
                }
                
                with (undocked.objects.chart.area)
                {
                    style.textAlign = "";
                    innerHTML = "";
                }
                
                with (stocks.objects.chart.text)
                {
                    className = "";
                    innerHTML = "";
                }
                
                with (stocks.objects.chart.obj.style)
                {
                    left = "";
                    top = "";
                    width = "";
                    backgroundColor = "";
                    visibility = "hidden";
                }
                
                undocked.objects.chart = null;
                undocked.chart.initialized = false;
            }
        }
    },
    status:
    {
        initialized: false,
        height: 20,
        init: function(b)
        {
            undocked.objects.status = {
                divider: stocksStatusDivider,
                text: stocksStatusText,
                toolbar: stocksStatusToolbar
            }
            
            with (undocked.objects.status.divider.style)
            {
                height = "1px";
                backgroundColor = "#1c313b";
            }
            
            with (undocked.objects.status.text)
            {
                className = "undockedStatusText";
                style.width = "100%";
                style.textAlign = stocks.config.bidi.convert("left");
                style.visibility = "visible";
            }
            
            with (stocks.objects.status.chart)
            {
                style.position = "relative";
                
                if (!b)
                {
                    style.paddingTop = "1px";
                }
                else
                {
                    if (stocks.config.bidi.reversed())
                    {
                        style.padding = "1px 0px 0px 2px";
                    }
                    else
                    {
                        style.padding = "1px 2px 0px 0px";
                    }
                }
                
                innerHTML = '<a id="stocksStatusChartAnchor" style="cursor:default"><img id="stocksStatusChartImage" src="' + stocks.config.image.path("stocks_chart_rest.png") + '" tabindex="0" style="width:17px;height:16px;border:none;visibility:visible" /></a>';
            }
            
            undocked.objects.status.chart = {
                obj: stocks.objects.status.chart,
                anchor: stocksStatusChartAnchor,
                image: stocksStatusChartImage
            }
            
            if (!b)
            {
                with (stocks.objects.status.add)
                {
                    style.position = "relative";
                    
                    if (stocks.config.bidi.reversed())
                    {
                        style.padding = "1px 1px 0px 2px";
                    }
                    else
                    {
                        style.padding = "1px 2px 0px 1px";
                    }
                    
                    style.visibility = "visible";
                    innerHTML = '<a id="stocksStatusAddAnchor" style="cursor:default"><img id="stocksStatusAddImage" src="' + stocks.config.image.path("stocks_plus_rest.png") + '" style="width:16px;height:16px;border:none;visibility:visible" /></a>';
                }
                
                undocked.objects.status.add = {
                    obj: stocks.objects.status.add,
                    anchor: stocksStatusAddAnchor,
                    image: stocksStatusAddImage
                }
            }
            else
            {
                stocks.objects.status.add.style.display = "none";
            }
            
            undocked.objects.status.toolbar.style.display = "block";
            
            with (undocked.objects.status.chart.anchor)
            {
                href = "javascript:undocked.chart.toggle()";
                
                onmouseup = function()
                {
                    this.blur();
                }
            }
            
            with (undocked.objects.status.chart.image)
            {
                onmouseenter = function()
                {
                    util.image.update(this, stocks.config.image.path("stocks_chart_hover.png"));
                }
                
                onmouseleave = function()
                {
                    util.image.update(this, stocks.config.image.path("stocks_chart_rest.png"));
                    this.blur();
                }
                
                onmousedown = function()
                {
                    util.image.update(this, stocks.config.image.path("stocks_chart_pressed.png"));
                }
                
                onmouseup = function()
                {
                    util.image.update(this, stocks.config.image.path("stocks_chart_rest.png"));
                    this.blur();
                }
                
                alt = stocks.config.localization.convert("ShowStockGraph");
            }
            
            if (!b)
            {
                with (undocked.objects.status.add.anchor)
                {
                    href = "javascript:undocked.search.show()";
                    
                    onmouseleave = function()
                    {
                        this.blur();
                    }
                    
                    onmouseup = function()
                    {
                        this.blur();
                    }
                    
                    onkeydown = function()
                    {
                       if (event.keyCode == 32)
                       {
                           undocked.action.cancel(event);
                       }
                    }
                    
                    onkeyup = function()
                    {
                       if (event.keyCode == 32)
                       {
                           undocked.search.show();
                           undocked.action.cancel(event);
                        }
                    }
                }
                
                with (undocked.objects.status.add.image)
                {
                    onmouseenter = function()
                    {
                        util.image.update(this, stocks.config.image.path("stocks_plus_hover.png"));
                    }
                    
                    onmouseleave = function()
                    {
                        util.image.update(this, stocks.config.image.path("stocks_plus_rest.png"));
                    }
                    
                    onmousedown = function()
                    {
                        util.image.update(this, stocks.config.image.path("stocks_plus_pressed.png"));
                    }
                    
                    onmouseup = function()
                    {
                        util.image.update(this, stocks.config.image.path("stocks_plus_rest.png"));
                        this.blur();
                    }
                    
                    alt = stocks.config.localization.convert("SearchForAStock");
                }
            }
            
            undocked.objects.status.text.innerHTML = '<div style="width:' + (undocked.row.width - undocked.objects.status.toolbar.offsetWidth) + 'px;padding-' + stocks.config.bidi.convert("left") + ':7px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden">' + stocks.config.localization.convert("QuotesByIDCComstock") + '</div>';
            
            undocked.status.initialized = true;
        },
        position:
        {
            update: function()
            {
                if (undocked.status.initialized)
                {
                    with (stocks.objects.status.obj.style)
                    {
                        left = undocked.x + "px";
                        top = undocked.chart.position.bottom() + "px";
                        width = undocked.row.dimensions.area.width() + "px";
                        visibility = "visible";
                    }
                }
            }
        },
        unload: function()
        {
            if (undocked.status.initialized)
            {
                if (!undocked.flyout.active)
                {
                    with (undocked.objects.status.add.obj)
                    {
                        style.position = "";
                        style.padding = "";
                        style.visibility = "hidden";
                        innerHTML = "";
                    }
                }
                
                with (undocked.objects.status.chart.obj)
                {
                    style.position = "";
                    style.padding = "";
                    style.visibility = "hidden";
                    innerHTML = "";
                }
                
                undocked.objects.status.toolbar.style.display = "";
                                
                with (undocked.objects.status.text)
                {
                    className = "";
                    style.width = "";
                    style.textAlign = "";
                    style.visibility = "hidden";
                    innerHTML = "";
                }
                
                with (undocked.objects.status.divider.style)
                {
                    height = "";
                    backgroundColor = "";
                }
                
                with (stocks.objects.status.obj.style)
                {
                    left = "";
                    top = "";
                    width = "";
                    visibility = "hidden";
                }
                
                undocked.objects.status = null;
                undocked.status.initialized = false;
            }
        }
    },
    flyout:
    {
        active: false,
        config:
        {
            x: 2,
            y: 1,
            width: 291,
            height: 55,
            prefix: "docked"
        },
        init: function()
        {
            undocked.flyout.active = true;
            undocked.flyout.update();
        },
        update: function()
        {
            if (undocked.flyout.active)
            {
                undocked.x = undocked.flyout.config.x;
                undocked.y = undocked.flyout.config.y;
                
                undocked.background.width = undocked.flyout.config.width;
                undocked.background.height = undocked.flyout.config.height;
                
                stocks.config.image.prefix = undocked.flyout.config.prefix;
            }
        },
        hide: function()
        {
            System.Gadget.Flyout.show = false;
        }
    },
    background:
    {
        width: 323,
        height: 87,
        min: 3,
        update: function()
        {
            with (document.body.style)
            {
                width = undocked.background.dimensions.width() + "px";
                height = undocked.background.dimensions.height() + "px";
            }
            
            stocksBackground.style.width = undocked.background.dimensions.width() + "px";
            stocksBackground.style.height = undocked.background.dimensions.height() + "px";
            stocksBackground.src = "url(" + stocks.config.image.path('stocks_' + stocks.config.image.prefix + '_' + undocked.search.display + '_' + undocked.chart.display + '_' +  Math.max(undocked.row.dimensions.count(), undocked.background.min) + '.png') + ") no-repeat";
            
            undocked.search.position.update();
            undocked.row.position.update();
            undocked.chart.position.update();
            undocked.status.position.update();
        },
        dimensions:
        {
            width: function()
            {
                return undocked.background.width;
            },
            height: function()
            {
                return undocked.background.height + (undocked.row.dimensions.height() - undocked.row.height) + undocked.search.dimensions.area.height() + undocked.chart.dimensions.area.height();
            }
        },
        unload: function()
        {
            with (document.body.style)
            {
                width = "";
                height = "";
            }
            
            stocksBackground.style.width = "";
            stocksBackground.style.height = "";
            stocksBackground.src = "";
        }
    },
    objects: {
    },
    action:
    {
        pressed:
        {
            tab: false
        },
        body:
        {
            mouse:
            {
                leave: function()
                {
                    if (!undocked.availability.active)
                    {
                        undocked.row.drag.end();
                    }
                }
            }
        },
        mouse:
        {
            move: function()
            {
                if (!undocked.availability.active)
                {
                    undocked.row.drag.move(event);
                }
            },
            up: function()
            {
                if (event.button == 2)
                {
                    return false;
                }
                
                if (!undocked.availability.active)
                {
                    undocked.row.drag.end();
                    undocked.row.drag.scroll.direction = null;
                }
            },
            down: function()
            {
                if (event.button == 2)
                {
                    return false;
                }
                
                if (!undocked.availability.active)
                {
                    undocked.action.pressed.tab = false;
                }
            },
            leave: function()
            {
                if (!undocked.availability.active)
                {
                    undocked.row.drag.end();
                }
            },
            wheel: function()
            {
                if (!undocked.availability.active)
                {
                    undocked.row.scroll.wheel.move(event);
                }
            }
        },
        keyboard:
        {
            up: function()
            {
                if (!undocked.availability.active)
                {
                    switch (event.keyCode)
                    {
                        case 27:
                            if (undocked.search.loaded)
                            {
                                undocked.search.hide(true);
                            }
                            else if (undocked.flyout.active)
                            {
                                undocked.flyout.hide();
                            }
                            break;
                        case 107:
                            undocked.search.show();
                            break;
                    }
                    
                    if (event.shiftKey)
                    {
                        switch (event.keyCode)
                        {
                            case 187:
                                undocked.search.show();
                                break;
                        }
                    }
                    
                    undocked.search.row.action.keyboard.up(event);
                    undocked.row.action.keyboard.up(event);
                }
            },
            down: function()
            {
                if (!undocked.availability.active)
                {
                    switch (event.keyCode)
                    {
                        case 9:
                            undocked.action.pressed.tab = true;
                            break;
                        default:
                            undocked.action.pressed.tab = false;
                    }
                    
                    undocked.search.row.action.keyboard.down(event);
                    undocked.row.action.keyboard.down(event);
                }
            }
        },
        cancel: function(event)
        {
            event.cancelBubble = true;
            event.returnValue = false;
        }
    },
    availability:
    {
        active: true,
        padding: 10,
        image:
        {
            animate:
            {
                index: -1,
                reset: function()
                {
                    if (undocked.availability.image.animate.index != -1)
                    {
                        util.image.animate.remove(undocked.availability.image.animate.index);
                        undocked.availability.image.animate.index = -1;
                    }
                }
            }
        },
        update: function(s, n)
        {
            if (s)
            {
                undocked.row.count = undocked.background.min;
                
                var o = util.objects.append(stocks.objects.data.id + "_availability", undocked.x, undocked.y, undocked.row.width, (undocked.flyout.active ? undocked.search.height : 0) + undocked.row.dimensions.height() + undocked.status.height, 3);
                
                with (o)
                {
                    style.textAlign = "center";
                    innerHTML = '<table cellspacing="0" cellpadding="0" border="0" style="height:' + parseInt(style.height) + 'px">'+
                                '<tr>'+
                                '<td style="text-align:center">'+
                                '<table cellspacing="0" cellpadding="0" border="0">'+
                                '<tr>'+
                                '<td id="' + stocks.objects.result.id + '_availability_image" style="vertical-align:top;padding-' + stocks.config.bidi.convert("right") + ':4px;white-space:nowrap" nowrap></td>'+
                                '<td id="' + stocks.objects.result.id + '_availability_text" class="undockedAvailabilityText"></td>'+
                                '</tr>'+
                                '</table>'+
                                '</td>'+
                                '</tr>'+
                                '</table>';
                }
                
                o = document.getElementById(stocks.objects.result.id + "_availability_image");
                
                switch(n)
                {
                    case 0:
                        docked.availability.image.animate.reset();
                        docked.availability.image.animate.index = util.image.animate.add(o, stocks.config.image.path("stocks_searching_strip.png"), 16, 288, 16, 20);
                        break;
                    default:
                        o.innerHTML = '<img src="' + stocks.config.image.path("glyphs_info.png") + '" style="width:16px;height:16px" />';
                }
                
                var w = undocked.row.width - (undocked.availability.padding * 2) - o.offsetWidth;
                
                o = document.getElementById(stocks.objects.result.id + "_availability_text");
                
                with (o)
                {
                    innerHTML = util.text.align(o, stocks.config.localization.convert(s), " ", w);    
                }
                
                undocked.availability.active = true;
                
                undocked.status.unload();
                undocked.chart.unload();
                undocked.row.unload(true);
                undocked.search.unload();
                undocked.background.update();
            }
            else
            {
                var b = System.Gadget.Settings.read("FlyoutShown");
                
                undocked.availability.unload();
                undocked.init(b);
            }
        },
        unload: function()
        {
            undocked.availability.image.animate.reset();
            util.objects.remove(stocks.objects.data.id + "_availability");
            undocked.availability.active = false;
        }
    },
    init: function(b)
    {
        if (b)
        {
            undocked.flyout.init();
        }
        
        if (stocks.msn.status.availability.active)
        {
            undocked.search.init(b);
            undocked.row.init();
            undocked.row.build();
            undocked.row.adjust();
            undocked.chart.init();
            undocked.status.init(b);
            
            undocked.availability.active = false;
        }
        else if (stocks.msn.status.availability.error != null)
        {
            undocked.availability.update(stocks.msn.status.availability.error, stocks.msn.status.availability.index);
        }
        
        undocked.background.update();
        
        undocked.initialized = true;
    },
    unload: function()
    {
        if (undocked.initialized)
        {
            undocked.status.unload();
            undocked.chart.unload();
            undocked.row.unload();
            undocked.search.unload();
            undocked.background.unload();
            undocked.availability.unload();
            
            with (document)
            {
                onkeyup = null;
                onkeydown = null;
                onmousemove = null;
                onmouseup = null;
                onmousedown = null;
                onmousewheel = null;
                body.onmouseleave = null;
            }
            
            undocked.objects = {};
            undocked.flyout.active = false;
            undocked.availability.active = true;
            undocked.initialized = false;
            
            stocks.msn.data.listener.remove(undocked.row.update);
        }
        
        stocks.config.undocked = false;
    },
    load: function(b)
    {
        stocks.config.image.prefix = undocked.config.image.prefix;
        stocks.config.undocked = true;
        
        with (document)
        {
            onkeyup = undocked.action.keyboard.up;
            onkeydown = undocked.action.keyboard.down;
            onmousemove = undocked.action.mouse.move;
            onmouseup = undocked.action.mouse.up;
            onmousedown = undocked.action.mouse.down;
            onmousewheel = undocked.action.mouse.wheel;
            body.onmouseleave = undocked.action.body.mouse.leave;
        }
        
        undocked.init(b);
        
        stocks.msn.data.listener.add(undocked.row.update);
        stocks.msn.load();
    }
}
