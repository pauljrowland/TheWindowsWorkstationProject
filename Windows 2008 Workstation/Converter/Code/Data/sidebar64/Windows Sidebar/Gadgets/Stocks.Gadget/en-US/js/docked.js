////////////////////////////////////////////////////////////////////////////////
//
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
docked =
{
    initialized: false,
    x: 3,
    y: 3,
    config:
    {
        image:
        {
            prefix: "docked"
        }
    },
    row:
    {
        width: 123,
        height: 33,
        config:
        {
            hover:
            {
                padding: 1,
                width: 2
            },
            selected:
            {
                padding: 2
            }
        },
        padding:
        {
            top: 3,
            secondary:
            {
                top: 14
            }
        },
        index: -1,
        count: -1,
        min: 1,
        max: 3,
        init: function()
        {
            docked.row.count = stocks.array.length();
            
            stocks.objects.data.innerHTML = '<ul id="' + stocks.objects.data.id + '_ul" style="margin:0px"></ul>';
            docked.objects.row = document.getElementById(stocks.objects.data.id + "_ul");

            docked.row.initialized = true;
        },
        content: function(n)
        {
            var o = document.createElement("LI");
                
            with (o)
            {
                id = stocks.objects.data.id + "_" + n;
                
                onfocusin = function()
                {
                    if (!docked.row.action.focus.cancel && !docked.flyout.active)
                    {
                        docked.row.action.focus.enter(n);
                    }
                }
                
                onfocusout = function()
                {
                    if (!docked.flyout.active)
                    {
                        if (n == docked.row.action.focus.index)
                        {
                            docked.row.action.focus.index = -1;
                        }
                        
                        docked.row.action.focus.leave(n);
                        docked.row.action.focus.cancel = false;
                    }
                }
                
                onmousemove = function()
                {
                    docked.row.select(true, n, true);
                }

                onmouseleave = function()
                {
                    docked.row.select(false, n);
                }
                
                onmousedown = function()
                {
                    if (event.button == 2)
                    {
                        return false;
                    }
                    
                    if (docked.flyout.chart.active)
                    {
                        if (n != docked.flyout.index)
                        {
                            docked.flyout.active = false;
                            
                            docked.row.index = n;
                            docked.row.select(true, n, null, true);
                            
                            docked.flyout.chart.show(n);
                        }
                        else
                        {
                            docked.flyout.hide(true);
                        }
                    }
                    else if (docked.row.drag.index == -1 && !docked.flyout.active && !docked.row.drag.order.active)
                    {
                        docked.row.drag.start(stocks.objects.data.id + "_0_" + n, n, event, docked.x, docked.y);
                    }
                }
                    
                unselectable = "on";
                
                style.position = "absolute";
                style.height = docked.row.height + "px";
                style.top = docked.row.drag.order.position[n][1] + "px";

                if (stocks.config.bidi.reversed())
                {
                    style.left = docked.row.dimensions.width() + "px";
                }
                
                style.margin = "0px";
                style.cursor = "default";
            }
            
            var b = (util.text.fill(stocks.array.data(n, stocks.array.index.indicator), 1) == 1);
            
            var s = '<div id="' + stocks.objects.data.id + '_background_' + n + '" unselectable="on" style="position:absolute;width:' + docked.row.dimensions.width() + ';height:' + docked.row.height + 'px"></div>'+
                    '<table cellspacing="0" cellpadding="0" border="0" unselectable="on" style="position:absolute;width:' + docked.row.dimensions.width() + ';height:' + docked.row.height + 'px;z-index:1">'+
                    '<tr>'+
                    '<td unselectable="on" style="width:' + docked.row.config.hover.padding + 'px;white-space:nowrap" nowrap></td>'+
                    '<td id="' + stocks.objects.data.id + '_1_' + n + '" unselectable="on" style="width:' + docked.row.config.hover.width + 'px;white-space:nowrap" nowrap></td>'+
                    '<td id="' + stocks.objects.data.id + '_0_' + n + '" unselectable="on" style="width:100%;vertical-align:top">'+
                    '<div style="position:absolute">'+
                    '<table cellspacing="0" cellpadding="0" border="0" unselectable="on" style="width:100%">'+
                    '<tr>'+
                    '<td unselectable="on" style="width:' + docked.row.config.selected.padding + 'px;white-space:nowrap" nowrap></td>'+
                    '<td id="' + stocks.objects.data.id + '_w0_' + n + '" unselectable="on" style="width:100%;vertical-align:top;padding-top:' + docked.row.padding.top + 'px">'+
                    '<h2 id="' + stocks.objects.data.id + '_symbol_' + n + '"unselectable="on" style="margin:0px"><a id="' + stocks.objects.data.id + '_symbol_text_' + n + '" href="javascript:void(0)" unselectable="on" onclick="stocks.msn.external.open(' + n + ')" onmousedown="docked.action.cancel(event)" onmouseup="docked.action.cancel(event)" class="company dockedSymbolText" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;cursor:pointer"></a></h2>'+
                    '</td>'+
                    '<td unselectable="on" style="text-align:' + stocks.config.bidi.convert("right") + ';vertical-align:top;padding-top:' + docked.row.config.selected.padding + ';white-space:nowrap" nowrap><a id="' + stocks.objects.data.id + '_remove_href_' + n + '" href="javascript:void(0)" unselectable="on" onclick="docked.row.remove(' + n + ');docked.action.cancel(event)" onmouseleave="this.blur()" onmouseup="this.blur()" onkeydown="if (event.keyCode == 32) { docked.action.cancel(event); }" onkeyup="if (event.keyCode == 32) { docked.row.remove(' + n + '); docked.action.cancel(event); }" style="cursor:default"><img id="' + stocks.objects.data.id + '_remove_' + n + '" src="' + stocks.config.image.path("glyphs_delete_rest.png") + '" unselectable="on" onmouseenter="util.image.update(this,\'' + stocks.config.image.path("glyphs_delete_hover.png") + '\')" onmouseleave="util.image.update(this,\'' + stocks.config.image.path("glyphs_delete_rest.png") + '\')" onmousedown="util.image.update(this,\'' + stocks.config.image.path("glyphs_delete_pressed.png") + '\');docked.action.cancel(event)" onmouseup="util.image.update(this,\'' + stocks.config.image.path("glyphs_delete_hover.png") + '\')" style="width:16px;height:16px;border:none;visibility:hidden" alt="' + stocks.config.localization.convert("Delete") + '" /></a></td>'+
                    '</tr>'+
                    '</table>'+
                    '</div>'+
                    '<div style="position:absolute;top:' + docked.row.padding.secondary.top + 'px">'+
                    '<table cellspacing="0" cellpadding="0" border="0" unselectable="on" style="width:100%">'+
                    '<tr>'+
                    '<td unselectable="on" style="width:' + docked.row.config.selected.padding + 'px;white-space:nowrap" nowrap></td>'+
                    '<td id="' + stocks.objects.data.id + '_w1_' + n + '" unselectable="on" style="width:100%"><div id="' + stocks.objects.data.id + '_price_' + n + '" unselectable="on" class="dockedPriceText" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></div></td>'+
                    '<td unselectable="on" style="width:' + docked.row.config.selected.padding + 'px;white-space:nowrap" nowrap></td>'+
                    '<td unselectable="on"><div id="' + stocks.objects.data.id + '_change_' + n + '" dir="ltr" unselectable="on" class="dockedChangeText"></div></td>'+
                    '<td unselectable="on" style="text-align:' + stocks.config.bidi.convert("right") + ';white-space:nowrap" nowrap></td>'+
                    '<td unselectable="on" style="width:' + docked.row.config.selected.padding + 'px;white-space:nowrap" nowrap></td>'+
                    '</tr>'+
                    '</table>'+
                    '</div>'+
                    '</td>'+
                    '<td unselectable="on" id="' + stocks.objects.data.id + '_2_' + n + '" style="width:' + docked.row.config.hover.width + 'px;white-space:nowrap" nowrap></td>'+
                    '<td unselectable="on" style="width:' + docked.row.config.hover.padding + 'px;white-space:nowrap" nowrap></td>'+
                    '</tr>'+
                    '</table>';
            
            o.innerHTML = s;
            
            return o;
        },
        build: function(b, b1, b2)
        {
            if (!b1)
            {
                docked.objects.row.innerHTML = "";
            }
            
            docked.row.drag.order.position = [];
            
            for (var i = 0; i < docked.row.count; i++)
            {
                docked.row.drag.order.position.push([i, ((i - docked.row.scroll.index) * docked.row.height), i, null, false]);
                
                if (!b1)
                {
                    docked.objects.row.appendChild(docked.row.content(i));
                }
                else
                {
                    document.getElementById(stocks.objects.data.id + "_" + i).style.top = docked.row.drag.order.position[i][1] + "px";
                }
            }
            
            if (!b)
            {
                docked.row.select(true, docked.row.index, null, !b2);
            }
        },
        remove: function(n)
        {
            docked.row.drag.index = -1;
            
            if (docked.row.count > docked.row.min && !docked.flyout.active && docked.flyout.closed.index == -1)
            {
                docked.row.count = stocks.array.remove(n);
                
                docked.row.index = -1;
                docked.row.scroll.index = Math.max(0, docked.row.scroll.index - 1);
                
                docked.objects.row.removeChild(document.getElementById(stocks.objects.data.id + "_" + docked.row.count));
                
                docked.row.unselect();
                
                docked.row.build(null, true);
                docked.row.adjust();
                
                docked.row.select(true, Math.min(n, docked.row.count - 1));
                
                if (docked.row.count == docked.row.min)
                {
                    with (document.getElementById(stocks.objects.data.id + "_remove_0"))
                    {
                        style.visibility = "hidden";
                        disabled = true;
                    }
                }
                
                docked.controls.update(true);
                
                setTimeout("docked.background.update()");
            }
        },
        select: function(b, n, b1, b2)
        {
            if (docked.row.initialized && docked.row.drag.index == -1 && !docked.flyout.active)
            {
                if (n != -1)
                {
                    if (!b && docked.row.count > docked.row.min && (n == docked.row.index || n == docked.row.action.focus.index))
                    {
                        document.getElementById(stocks.objects.data.id + "_remove_" + n).style.visibility = "hidden";
                        return;
                    }
                    
                    if (!b1 && (b && docked.row.action.keyboard.index != -1 && docked.row.action.keyboard.index != n))
                    {
                        return;
                    }
                    
                    var s = "";
                    
                    if (b)
                    {
                        if (b2 || n == docked.row.index || n == docked.row.action.focus.index)
                        {
                            s += "selected";
                            
                            docked.row.index = n;
                            
                            if (docked.row.action.focus.index != -1 && docked.row.action.focus.index != n)
                            {
                                docked.row.blur(docked.row.action.focus.index);
                                docked.row.action.focus.index = -1;
                            }
                            
                            docked.row.unselect();
                        }
                        else
                        {
                            s += "hover";
                        }
                    }

                    document.getElementById(stocks.objects.data.id + "_0_" + n).style.background = "url(" + stocks.config.image.path((s != '' ? 'stocks_docked_' + s + '_center.png' : '')) + ")";
                    document.getElementById(stocks.objects.data.id + "_1_" + n).style.background = "url(" + stocks.config.image.path((s != '' ? 'stocks_docked_' + s + '_' + stocks.config.bidi.convert("left") + '.png' : '')) + ")";
                    document.getElementById(stocks.objects.data.id + "_2_" + n).style.background = "url(" + stocks.config.image.path((s != '' ? 'stocks_docked_' + s + '_' + stocks.config.bidi.convert("right") + '.png' : '')) + ")";
                    document.getElementById(stocks.objects.data.id + "_remove_" + n).style.visibility = (b && !b2 && docked.row.count > docked.row.min ? "visible" : "hidden");
                }
            }
        },
        unselect: function(n, b)
        {
            if (docked.row.initialized)
            {
                if (n != -1)
                {
                    for (var i = (n != null ? n : 0); i < (n != null ? n + 1: docked.row.count); i++)
                    {
                        document.getElementById(stocks.objects.data.id + "_0_" + i).style.background = "";
                        document.getElementById(stocks.objects.data.id + "_1_" + i).style.background = "";
                        document.getElementById(stocks.objects.data.id + "_2_" + i).style.background = "";
                        document.getElementById(stocks.objects.data.id + "_remove_" + i).style.visibility = "hidden";
                    }
                }
                
                if (b)
                {
                    docked.row.index = -1;
                    docked.row.action.index = -1;
                }
            }
        },
        blur: function(n)
        {
            if (docked.row.initialized)
            {
                if (n != -1)
                {
                    document.getElementById(stocks.objects.data.id + "_symbol_text_" + n).blur();
                    document.getElementById(stocks.objects.data.id + "_remove_href_" + n).blur();
                }
            }
        },
        drag:
        {
            x: 0,
            y: 0,
            index: -1,
            offset:
            {
                min: 1,
                total: 0
            },
            increment: 3,
            speed: 10,
            order:
            {
                active: false,
                position: [],
                find: function(o, n)
                {
                    n = (n != null ? n : 0);
                    
                    for (var i = 0; i < docked.row.drag.order.position.length; i++)
                    {
                        if (o == docked.row.drag.order.position[i][n])
                        {
                            return i;
                        }
                    }
                    
                    return -1;
                },
                update: function(b)
                {
                    for (var i = 0; i < docked.row.drag.order.position.length; i++)
                    {
                        if (i != docked.row.drag.index && parseInt(document.getElementById(stocks.objects.data.id + "_" + i).style.top) != docked.row.drag.order.position[i][1])
                        {
                            clearTimeout(docked.row.drag.order.position[i][3]);
                            docked.row.drag.order.position[i][3] = setTimeout("docked.row.drag.order.move(" + i + "," + b + ")", docked.row.drag.order.speed);
                        }
                    }
                },
                rebuild: function()
                {
                    var o = [];
                    
                    var n = -1;
                    
                    for (var i = 0; i < docked.row.drag.order.position.length; i++)
                    {
                        if (docked.row.index == docked.row.drag.order.position[i][2])
                        {
                            n = i;
                        }
                        
                        o[docked.row.drag.order.position[i][0]] = stocks.array.data(docked.row.drag.order.position[i][2]);
                    }
                    
                    docked.row.index = n;
                    
                    stocks.array.refresh(o);
                    
                    docked.row.action.keyboard.index = -1;
                    docked.row.action.keyboard.timer = null;
                    docked.row.action.keyboard.active = false;
                    
                    docked.row.build(null, true, docked.row.drag.order.active);
                    docked.row.adjust();
                    
                    docked.row.drag.order.active = false;
                },
                move: function(n, b)
                {
                    if (docked.row.drag.order.position[n][1] != null)
                    {
                        var y0 = parseInt(document.getElementById(stocks.objects.data.id + "_" + n).style.top);
                        var y1 = (y0 < docked.row.drag.order.position[n][1] ? Math.min(y0 + docked.row.drag.increment, docked.row.drag.order.position[n][1]) : Math.max(y0 - docked.row.drag.increment, docked.row.drag.order.position[n][1]));
                        
                        document.getElementById(stocks.objects.data.id + "_" + n).style.top = y1 + "px";
                        
                        if (y1 != docked.row.drag.order.position[n][1])
                        {
                            docked.row.drag.order.position[n][3] = setTimeout("docked.row.drag.order.move(" + n + "," + b + ")", docked.row.drag.order.speed);
                            docked.row.drag.order.position[n][4] = true;
                        }
                        else
                        {
                            docked.row.drag.order.position[n][3] = null;
                            docked.row.drag.order.position[n][4] = false;
                            
                            if (docked.row.scroll.action.active && docked.row.drag.order.find(true, 4) == -1)
                            {
                                if (docked.row.scroll.action.active == 1)
                                {
                                    docked.row.scroll.up();
                                }
                                else if (docked.row.scroll.action.active == 2)
                                {
                                    docked.row.scroll.down();
                                }
                            }
                            else if (b)
                            {
                                if (docked.row.action.keyboard.index == -1 || docked.row.drag.order.find(true, 4) == -1)
                                {
                                    if (docked.row.action.keyboard.index != -1 && docked.row.drag.order.position[docked.row.action.keyboard.index][1] == null)
                                    {
                                        docked.row.drag.order.position[docked.row.action.keyboard.index][1] = ((docked.row.index % docked.row.max) * docked.row.height);
                                        
                                        if (parseInt(document.getElementById(stocks.objects.data.id + "_" + docked.row.action.keyboard.index).style.top) != docked.row.drag.order.position[docked.row.action.keyboard.index][1])
                                        {
                                            docked.row.drag.order.move(docked.row.action.keyboard.index, true);
                                            return;
                                        }
                                    }
                                    
                                    setTimeout("docked.row.drag.order.rebuild()");
                                }
                            }
                        }
                    }
                }
            },
            start: function(s, n, e, x0, y0)
            {
                if (!docked.flyout.active)
                {
                    var p = util.objects.coordinates(s);

                    docked.row.drag.x = e.clientX - p.x + (x0 != null ? x0 : 0);
                    docked.row.drag.y = e.clientY - p.y + (y0 != null ? y0 : 0);
                    docked.row.drag.index = n;
                    docked.row.drag.insert.previous = n;
                    docked.row.drag.offset.total = 0;
                    
                    document.getElementById(stocks.objects.data.id + "_remove_" + n).style.visibility = "hidden";
                    
                    if (n != docked.row.index)
                    {
                        docked.row.unselect(docked.row.index);
                        docked.row.index = -1;
                    }
                    
                    docked.controls.update(null, true);
                }
            },
            end: function()
            {
                var n = docked.row.drag.index;
                docked.row.drag.index = -1;
                
                if (n != -1)
                {
                    if (docked.row.drag.insert.index != -1)
                    {
                        docked.row.index = docked.row.drag.insert.index;
                        
                        docked.row.drag.order.position[n][1] = ((docked.row.drag.insert.index - docked.row.scroll.index) * docked.row.height);
                        docked.row.drag.order.active = true;
                        docked.row.drag.order.move(n, true);
                        
                        if (docked.row.drag.insert.index != n)
                        {
                            stocks.gadget.settings.save();
                        }
                        else if (docked.row.drag.offset.total < docked.row.drag.offset.min)
                        {
                            docked.flyout.chart.show(n);
                        }
                        
                        docked.row.drag.x = 0;
                        docked.row.drag.y = 0;
                        
                        document.body.focus();
                    }
                    else
                    {
                        docked.flyout.chart.show(n);
                    }
                    
                    docked.controls.update();
                }
                
                docked.row.drag.insert.y = -1,
                docked.row.drag.insert.dir = null,
                docked.row.drag.insert.index = -1;
                docked.row.drag.insert.previous = -1;
                docked.row.drag.offset.total = 0;
                docked.row.action.focus.index = -1;
                docked.row.action.focus.cancel = false;
                
                docked.row.drag.scroll.y = null;
                docked.row.drag.scroll.direction = null;
                docked.row.drag.scroll.timer = null;
                docked.row.drag.scroll.active = false;
            },
            move: function(event)
            {
                if (docked.row.count > 1 && docked.row.drag.index != -1)
                {
                    var y0 = event.clientY - docked.row.drag.y;
                    var y1 = (y0 + docked.row.height < docked.row.dimensions.height() ? Math.max(0, y0) : docked.row.dimensions.height() - docked.row.height);
                    
                    var d;
                    
                    with (document.getElementById(stocks.objects.data.id + "_" + docked.row.drag.index).style)
                    {
                        docked.row.drag.offset.total += Math.abs(parseInt(top) - y1);
                        
                        d = (y1 > parseInt(top));
                        top = y1 + "px";
                        zIndex = 1;
                    }
                    
                    if (!docked.row.drag.scroll.active && docked.row.count > docked.row.max && ((y1 == 0 && docked.row.scroll.index > 0) || y1 + docked.row.height == docked.row.dimensions.height()))
                    {
                        docked.row.drag.scroll.y = y1;
                        docked.row.drag.scroll.timer = setTimeout("docked.row.drag.scroll.move(" + (y1 == 0) + ")", docked.row.drag.scroll.delay);
                        docked.row.drag.scroll.active = true;
                    }
                    else if (docked.row.drag.scroll.active && y1 != docked.row.drag.scroll.y)
                    {
                        clearTimeout(docked.row.drag.scroll.timer);
                        docked.row.drag.scroll.position.adjust(docked.row.drag.insert.dir);
                        docked.row.drag.scroll.active = false;
                    }
                    
                    if (!docked.row.drag.scroll.active)
                    {
                        var b = false;
                        
                        if (docked.row.drag.insert.y != -1)
                        {
                            b = (d == docked.row.drag.insert.dir);
                        }
                        
                        docked.row.drag.insert.y = y1;
                        docked.row.drag.insert.dir = d;
                        docked.row.drag.insert.index = docked.row.scroll.index + Math.floor((y1 + Math.floor(docked.row.height / 2)) / docked.row.height);
                        
                        if (!b || docked.row.drag.insert.index != docked.row.drag.insert.previous)
                        {
                            docked.row.drag.scroll.position.adjust(docked.row.drag.insert.dir, (docked.row.drag.insert.index - docked.row.scroll.index) * docked.row.height);
                            docked.row.drag.order.update();
                        }
                    }
                }
            },
            scroll: 
            {
                y: null,
                direction: null,
                active: false,
                increment: 3,
                speed: 10,
                timer: null,
                delay: 300,
                move: function(b, inc)
                {
                    if (docked.row.drag.index != -1)
                    {
                        var h = 0;
                        
                        if (b != null)
                        {
                            docked.row.drag.scroll.direction = (b ? -1 : 1);
                            
                            if (docked.row.drag.scroll.direction == -1)
                            {
                                h = docked.row.height;
                            }
                        }
                        
                        if (inc == null)
                        {
                            docked.row.drag.scroll.timer = setTimeout("docked.row.drag.scroll.move()", docked.row.drag.scroll.speed);
                        }
                        
                        b = false;
                        
                        var y0 = parseInt(document.getElementById(stocks.objects.data.id + "_" + docked.row.drag.index).style.top);
                        var y1 = (docked.row.drag.scroll.direction * (inc == null ? docked.row.drag.scroll.increment : inc)) - parseInt(document.getElementById(stocks.objects.data.id + "_" + (docked.row.drag.index == 0 ? 1 : 0)).style.top) - h;
                        
                        docked.row.scroll.index = Math.min(Math.floor(Math.abs(y1) / docked.row.height), docked.row.count - docked.row.max);
                        docked.row.drag.insert.index = Math.min(docked.row.scroll.index + Math.floor((y0 + Math.floor(docked.row.height / 2)) / docked.row.height), docked.row.count - 1);
                        
                        if (docked.row.drag.scroll.direction == 1 && docked.row.scroll.dimensions.height() < Math.abs(y1))
                        {
                            y1 = docked.row.scroll.dimensions.height();
                            clearTimeout(docked.row.drag.scroll.timer);
                            b = true;
                        }
                        else if (docked.row.drag.scroll.direction == -1 && docked.row.scroll.index == 0)
                        {
                            y1 = null;
                            clearTimeout(docked.row.drag.scroll.timer);
                            b = true;
                        }
                        
                        if (y1 != null)
                        {
                            docked.row.scroll.move(y1, docked.row.drag.index);
                        }
                        
                        if (b)
                        {
                            if (docked.row.drag.insert.index != docked.row.drag.insert.previous)
                            {
                                docked.row.drag.scroll.position.adjust((docked.row.drag.scroll.direction == 1), y0);
                                docked.row.drag.order.update();
                            }
                            
                            docked.row.drag.scroll.active = false;
                        }
                    }
                },
                position:
                {
                    adjust: function(b, y)
                    {
                        if (docked.row.drag.insert.index != -1)
                        {
                            var o = [];
                            
                            for (var i = 0; i < docked.row.count; i++)
                            {
                                var n = docked.row.drag.order.find(i);
                                
                                if (n != -1)
                                {
                                    o.push(n);
                                }
                            }
                            
                            if (o.length == docked.row.count)
                            {
                                for (var i = 0, j = 0; i < o.length; i++)
                                {
                                    if (!b && i == docked.row.drag.insert.index)
                                    {
                                        j++;
                                    }
                                    
                                    if (o[i] != docked.row.drag.index)
                                    {
                                        docked.row.drag.order.position[o[i]][0] = j;
                                        docked.row.drag.order.position[o[i]][1] = (j - docked.row.scroll.index) * docked.row.height;
                                        j++;
                                    }
                                    
                                    if (b && i == docked.row.drag.insert.index)
                                    {
                                        j++;
                                    }
                                }
                                
                                docked.row.drag.order.position[docked.row.drag.index][0] = docked.row.drag.insert.index;
                                
                                if (y != null)
                                {
                                    docked.row.drag.order.position[docked.row.drag.index][1] = y;
                                }
                                
                                docked.row.drag.insert.previous = docked.row.drag.insert.index;
                            }
                        }
                    }
                }
            },
            insert:
            {
                y: -1,
                dir: null,
                index: -1,
                previous: -1
            }
        },
        move: function(d, b)
        {
            if (!docked.row.action.keyboard.active && docked.row.action.keyboard.index == -1)
            {
                docked.row.action.keyboard.index = (docked.row.index != -1 ? docked.row.index : 0);
                docked.row.index = docked.row.action.keyboard.index;
                docked.row.select(true, docked.row.action.keyboard.index, null, true);
                
                document.getElementById(stocks.objects.data.id + "_" + docked.row.action.keyboard.index).style.zIndex = 1;
            }
            
            if (docked.row.action.keyboard.index != -1)
            {
                var n = (d > 0 ? Math.min(docked.row.index + d, docked.row.count - 1) : Math.max(docked.row.index + d, 0));
                
                if (n != docked.row.index)
                {
                    var i = docked.row.drag.order.find(n);
                    
                    docked.row.drag.order.position[i][0] = docked.row.drag.order.position[docked.row.action.keyboard.index][0];
                    docked.row.drag.order.position[i][1] = (docked.row.drag.order.position[i][0] - docked.row.scroll.index) * docked.row.height;
                    docked.row.drag.order.position[docked.row.action.keyboard.index][0] = n;
                    docked.row.drag.order.position[docked.row.action.keyboard.index][1] = (n - docked.row.scroll.index) * docked.row.height;
                    
                    i = Math.min(Math.floor(n / docked.row.max) * docked.row.max, docked.row.count - docked.row.max);
                    
                    if (n >= docked.row.scroll.index && n < docked.row.scroll.index + docked.row.max)
                    {
                        if (docked.row.count % docked.row.max != 0 && i >= docked.row.count - docked.row.max)
                        {
                            docked.row.drag.order.position[docked.row.action.keyboard.index][1] = ((n % docked.row.max) + (docked.row.max - (docked.row.count % docked.row.max))) * docked.row.height;
                        }
                        else if (docked.row.action.keyboard.active)
                        {
                            docked.row.drag.order.position[docked.row.action.keyboard.index][1] = null;
                            docked.row.drag.order.position[docked.row.action.keyboard.index][4] = false;
                        }
                        
                        docked.row.drag.order.update(true);
                    }
                    else
                    {
                        for (var j = 0; j < docked.row.count; j++)
                        {
                            if (j == docked.row.action.keyboard.index)
                            {
                                if (docked.row.count % docked.row.max != 0 && i >= docked.row.count - docked.row.max)
                                {
                                    docked.row.drag.order.position[j][1] = ((n % docked.row.max) + (docked.row.max - (docked.row.count % docked.row.max))) * docked.row.height;
                                    continue;
                                }
                                else if (docked.row.action.keyboard.active)
                                {
                                    docked.row.drag.order.position[j][1] = null;
                                    docked.row.drag.order.position[j][4] = false;
                                    continue;
                                }
                            }
                            
                            docked.row.drag.order.position[j][1] = (docked.row.drag.order.position[j][0] - i) * docked.row.height;
                        }
                        
                        docked.row.scroll.to(i, true);
                    }

                    docked.row.index = n;
                    
                    if (b)
                    {
                        docked.row.action.keyboard.timer = setTimeout("docked.row.move(" + d + ", " + b + ")", docked.row.action.keyboard.speed);
                        docked.row.action.keyboard.active = true;
                    }
                }
                else if (docked.row.action.keyboard.active && docked.row.drag.order.position[docked.row.action.keyboard.index][1] == null)
                {
                    docked.row.drag.order.position[docked.row.action.keyboard.index][1] = ((docked.row.index % docked.row.max) * docked.row.height);
                    docked.row.drag.order.move(docked.row.action.keyboard.index, true);
                }
                else
                {
                    docked.row.action.keyboard.index = -1;
                }
            }
        },
        scroll:
        {
            index: 0,
            active: 0,
            move: function(y, n)
            {
                n = (n != null ? n : -1);
                
                for (var i = 0, j = 0; i < docked.row.count; i++)
                {
                    if (i != n)
                    {
                        document.getElementById(stocks.objects.data.id + "_" + i).style.top = -y + (j * docked.row.height) + "px";
                        j++;
                    }
                }
            },
            up: function(b)
            {
                if (docked.row.count > docked.row.max && docked.row.scroll.index > 0 && docked.row.scroll.index <= docked.row.count - docked.row.max)
                {
                    docked.row.scroll.index--;
                    docked.row.scroll.adjust(); 
                    
                    if (b)
                    {
                        docked.row.scroll.action.active = 1;
                    }
                }
            },
            down: function(b)
            {
                if (docked.row.count > docked.row.max)
                {
                    if (docked.row.scroll.index > docked.row.count - docked.row.max)
                    {
                        docked.row.scroll.index++
                        
                        if (docked.row.scroll.index == docked.row.count)
                        {
                            docked.row.scroll.index = 0;
                        }
                        
                        docked.row.scroll.adjust();
                    }
                    else if (docked.row.scroll.index < docked.row.count - docked.row.max)
                    {
                        docked.row.scroll.index++;
                        docked.row.scroll.adjust();
                    }
                 
                    if (b)
                    {
                        docked.row.scroll.action.active = 2;
                    }
                }
            },
            to: function(n, b)
            {
                if (docked.row.count > docked.row.max)
                {
                    docked.row.scroll.index = (b ? n : Math.max(0, (n + 1) - docked.row.max));
                    docked.row.scroll.adjust(b);
                }
            },
            area: function(n)
            {
                var i = Math.min(Math.floor(n / docked.row.max) * docked.row.max, docked.row.count - docked.row.max);
                
                if (i > docked.row.scroll.index)
                {
                    docked.row.scroll.index++;
                }
                else if (n < docked.row.scroll.index || n > docked.row.scroll.index + docked.row.max)
                {
                    docked.row.scroll.index = i;
                }
                
                for (var i = 0; i < docked.row.count; i++)
                {
                    docked.row.drag.order.position[i][1] = (i - docked.row.scroll.index) * docked.row.height;
                    document.getElementById(stocks.objects.data.id + "_" + i).style.top = docked.row.drag.order.position[i][1] + "px";
                }
            },
            adjust: function(b)
            {
                for (var i = 0; i < docked.row.count; i++)
                {
                    if (!b)
                    {
                        var n = docked.row.scroll.index;
                        
                        if (docked.row.count % docked.row.max != 0 && docked.row.scroll.index > docked.row.count - docked.row.max)
                        {
                            n = docked.row.scroll.index - docked.row.count;
                        }
                        
                        if (n < 0 && i >= docked.row.scroll.index)
                        {
                            docked.row.drag.order.position[i][1] = (i - docked.row.scroll.index) * docked.row.height;
                        }
                        else
                        {
                            docked.row.drag.order.position[i][1] = (i - n) * docked.row.height;
                        }
                    }
                    
                    if (!docked.row.drag.order.position[i][4])
                    {
                        docked.row.drag.order.move(i, b);
                    }
                }
                
                docked.controls.update();
            },
            direction: function(d)
            {
                if (docked.row.drag.order.find(true, 4) != -1)
                {
                    return;
                }

                var n = docked.row.index;
                docked.row.index += d;
                
                docked.row.index = Math.max(0, Math.min(docked.row.index, docked.row.count - 1));
                
                if (n == docked.row.index)
                {
                    return;
                }

                if (n >= 0 && n < docked.row.count && docked.row.count > 1)
                {
                    docked.row.select(false, n);
                }
                                
                if (docked.row.index < docked.row.scroll.index)
                {
                    docked.row.scroll.up();
                }
                else if (docked.row.index > docked.row.scroll.index + docked.row.max - 1)
                {
                    docked.row.scroll.down();
                }
                
                docked.row.select(true, docked.row.index, true);
            },
            action:
            {
                active: false,
                delay: 100,
                timer: null,
                up: function(b)
                {
                    if (b)
                    {
                        docked.row.scroll.action.timer = setTimeout("docked.row.scroll.up(true)", docked.row.scroll.action.delay);
                    }
                    else
                    {
                        clearTimeout(docked.row.scroll.action.timer);
                        docked.row.scroll.action.timer = null;
                        
                        if (!docked.row.scroll.action.active)
                        {
                            docked.row.scroll.up();
                        }
                        
                        docked.row.scroll.action.active = 0;
                    }
                },
                down: function(b)
                {
                    if (b)
                    {
                        docked.row.scroll.action.timer = setTimeout("docked.row.scroll.down(true)", docked.row.scroll.action.delay);
                    }
                    else
                    {
                        clearTimeout(docked.row.scroll.action.timer);
                        docked.row.scroll.action.timer = null;
                        
                        if (!docked.row.scroll.action.active)
                        {
                            docked.row.scroll.down();
                        }
                        
                        docked.row.scroll.action.active = 0;
                    }
                }
            },
            dimensions:
            {
                height: function()
                {
                    return (docked.row.height * docked.row.count) - docked.row.dimensions.height();
                }
            }
        },
        adjust: function()
        {
            for (var i = 0; i < docked.row.count; i++)
            {
                document.getElementById(stocks.objects.data.id + "_symbol_text_" + i).innerHTML = "";
                document.getElementById(stocks.objects.data.id + "_symbol_text_" + i).style.width = "";
                
                document.getElementById(stocks.objects.data.id + "_price_" + i).innerHTML = "";
                document.getElementById(stocks.objects.data.id + "_price_" + i).style.width = "";
                
                stocks.update.change(i);
             }
             
             for (var i = 0; i < docked.row.count; i++)
             {               
                var b = (util.text.fill(stocks.array.data(i, stocks.array.index.indicator), 1) == 1);
                
                document.getElementById(stocks.objects.data.id + "_background_" + i).style.background = "url(" + stocks.config.image.path('stocks_docked_row_background_' + (b ? "up" : "down") + '.png') + ") no-repeat";
                
                var w0 = util.text.trim(document.getElementById(stocks.objects.data.id + "_symbol_text_" + i), stocks.array.data(i, (stocks.config.user.display.company ? stocks.array.index.company : stocks.array.index.symbol)));
                var w1 = document.getElementById(stocks.objects.data.id + "_w0_" + i).offsetWidth;
                
                with (document.getElementById(stocks.objects.data.id + "_symbol_text_" + i).style)
                {
                    color = (b ? "#33ff99" : "#ff3355");
                    
                    if (w0 >= w1)
                    {
                        width = w1 + "px";
                    }
                }
                
                w0 = util.text.trim(document.getElementById(stocks.objects.data.id + "_price_" + i), stocks.array.data(i, stocks.array.index.price));
                w1 = document.getElementById(stocks.objects.data.id + "_w1_" + i).offsetWidth;
                
                if (w0 >= w1)
                {
                    document.getElementById(stocks.objects.data.id + "_price_" + i).style.width = w1 + "px";
                }
                
                stocks.update.symbol(i);
                stocks.update.price(i);
            }
        },
        update: function()
        {
            if (docked.row.initialized)
            {
                var n = stocks.array.length();
                
                if (n > 0)
                {
                    if (n != docked.row.count)
                    {
                        docked.row.unselect(null, true);
                        docked.row.scroll.index = 0;
                        
                        if (n < docked.row.count)
                        {
                            for (var i = docked.row.count - 1; i >= n; i--)
                            {
                                docked.objects.row.removeChild(document.getElementById(stocks.objects.data.id + "_" + i));
                            }
                        }
                        else
                        {
                            for (var i = docked.row.count; i < n; i++)
                            {
                                docked.row.drag.order.position.push([i, ((i - docked.row.scroll.index) * docked.row.height), i, null, false]);
                                docked.objects.row.appendChild(docked.row.content(i));
                            }
                        }
                        
                        docked.row.count = n;
                        docked.row.build(null, true);
                        
                        document.getElementById(stocks.objects.data.id + "_remove_0").disabled = (docked.row.count == docked.row.min);
                        
                        setTimeout("docked.background.update()");
                    }
                    
                    docked.row.adjust();
                }
                else
                {
                    stocks.msn.status.available(false);
                }
            }
        },
        action:
        {
            keyboard:
            {
                index: -1,
                active: false,
                timer: null,
                speed: 100,
                delay: 100,
                up: function(event)
                {
                    if (!docked.flyout.active)
                    {
                        clearTimeout(docked.row.action.keyboard.timer);
                        docked.row.action.keyboard.timer = null;
                        
                        if (event.altKey)
                        {
                            if (!docked.row.action.keyboard.active)
                            {
                                switch (event.keyCode)
                                {
                                    case 38:
                                        docked.row.move(-1);
                                        break;
                                    case 40:
                                        docked.row.move(1);
                                        break;
                                }
                            }
                        }

                        if (docked.row.action.keyboard.index == -1)
                        {
                            switch (event.keyCode)
                            {
                                case 38:
                                    docked.row.scroll.direction(-1, false);
                                    break;
                                case 40:
                                    docked.row.scroll.direction(1, false);
                                    break;
                            }
                        }
                    }
                },
                down: function(event)
                {
                    if (!docked.row.action.keyboard.active && !docked.flyout.active)
                    {
                        if (event.altKey)
                        {
                            if (docked.row.action.keyboard.timer == null)
                            {
                                switch (event.keyCode)
                                {
                                    case 38:
                                        docked.row.action.keyboard.timer = setTimeout("docked.row.move(-1, true)", docked.row.action.keyboard.delay);
                                        break;
                                    case 40:
                                        docked.row.action.keyboard.timer = setTimeout("docked.row.move(1, true)", docked.row.action.keyboard.delay);
                                        break;
                                }
                            }
                        }
                    }

                    switch (event.keyCode)
                    {
                        case 27:
                            if (docked.flyout.active)
                            {
                                docked.flyout.hide(true);
                            }
                            break;
                        case 32:
                            if (!docked.flyout.active)
                            {
                                docked.row.index = (docked.row.index != -1 ? docked.row.index : 0);
                                docked.row.select(true, docked.row.index, null, true);
                                docked.flyout.chart.show(docked.row.index);
                            }
                            break;
                    }
                }
            },
            focus:
            {
                index: -1,
                cancel: false,
                enter: function(n, b)
                {
                    if (b || docked.action.pressed.tab)
                    {
                        if (n != docked.row.action.focus.index)
                        {
                            docked.row.select(false, docked.row.action.focus.index, true);
                            docked.row.action.focus.index = n;
                            docked.row.select(true, n);
                            
                            docked.row.scroll.area(n);
                        }
                        
                        docked.row.action.focus.cancel = b;
                    }
                },
                leave: function(n)
                {
                    if (n != docked.row.action.focus.index)
                    {
                        docked.row.select(false, n);
                    }
                }
            }
        },
        position:
        {
            update: function()
            {
                if (docked.row.initialized)
                {
                    with (stocks.objects.data.style)
                    {
                        left = docked.x + "px";
                        top = docked.y + "px";
                        width = docked.row.dimensions.width() + "px";
                        height = docked.row.dimensions.height() + "px";
                    }
                    
                    docked.objects.row.style.width = docked.row.dimensions.width() + "px";
                }
            },
            bottom: function()
            {
                return docked.y + docked.row.dimensions.height();
            }
        },
        dimensions:
        {
            area:
            {
                width: function()
                {
                    return docked.row.width;
                },
                height: function()
                {
                    return docked.row.height * docked.row.count;
                }
            },
            width: function()
            {
                return docked.row.width;
            },
            height: function()
            {
                return docked.row.height * docked.row.dimensions.count();
            },
            count: function()
            {
                return Math.min(docked.row.count, docked.row.max);
            }
        },
        unload: function(b)
        {
            if (docked.row.initialized)
            {
                with (stocks.objects.data)
                {
                    style.left = "";
                    style.top = "";
                    style.width = "";
                    style.height = "";
                    style.zIndex = "";
                    innerHTML = "";
                }
                
                if (!b)
                {
                    docked.row.count = 0;
                }
                
                docked.row.initialized = false;
            }
        }
    },
    controls:
    {
        initialized: false,
        width: 76,
        height: 20,
        active: false,
        config:
        {
            glyphs:
            {
                width: 25,
                offset: 1,
                padding: 3
            }
        },
        init: function()
        {
            var o = util.objects.append(stocks.objects.data.id + "_controls", 0, 0, docked.row.width, docked.controls.height, 3);
            
            docked.controls.build(o);
            
            docked.controls.initialized = true;
        },
        build: function(o)
        {
            o = (o != null ? o : (docked.controls.initialized ? docked.objects.controls.obj : null));
            
            if (o != null)
            {
                var n = [1,2];
                
                var o1 = ['<a id="' + stocks.objects.data.id + '_controls_flyout_anchor" style="cursor:default"><img id="' + stocks.objects.data.id + '_controls_flyout" style="width:16px;height:16px;border:none" /></a>',
                          '<a id="' + stocks.objects.data.id + '_controls_up_anchor" style="cursor:default"><img id="' + stocks.objects.data.id + '_controls_up" style="width:16px;height:16px;border:none" /></a>',
                          '<a id="' + stocks.objects.data.id + '_controls_down_anchor" style="cursor:default"><img id="' + stocks.objects.data.id + '_controls_down" style="width:16px;height:16px;border:none" /></a>'];
                
                if (stocks.config.bidi.reversed())
                {
                    n.reverse();
                }
                
                if (stocks.config.dock.reversed())
                {
                    n.push(0)
                }
                else
                {
                    n.unshift(0);
                }
                
                with (o)
                {
                    style.textAlign = "center";
                    style.visibility = "hidden";
                    innerHTML = '<table dir="ltr" cellspacing="0" cellpadding="0" border="0" style="width:' + docked.controls.width + 'px;height:' + docked.controls.height + 'px;background:url(' + stocks.config.image.path("glyphs_well.png") + ') no-repeat">'+
                                '<tr>'+
                                '<td style="width:' + docked.controls.config.glyphs.width + 'px;text-align:left;padding-left:' + docked.controls.config.glyphs.padding + 'px">' + o1[n[0]] + '</td>'+
                                '<td style="width:' + (docked.controls.config.glyphs.width + docked.controls.config.glyphs.offset) + 'px;text-align:center">' + o1[n[1]]  + '</td>'+
                                '<td style="width:' + docked.controls.config.glyphs.width + 'px;text-align:right;padding-right:' + docked.controls.config.glyphs.padding + 'px">' + o1[n[2]] + '</td>'+
                                '</tr>'+
                                '</table>';
                }
                
                docked.objects.controls = {
                    obj: o,
                    flyout: {
                        anchor: document.getElementById(stocks.objects.data.id + "_controls_flyout_anchor"),
                        image: document.getElementById(stocks.objects.data.id + "_controls_flyout")
                    },
                    up: {
                        anchor: document.getElementById(stocks.objects.data.id + "_controls_up_anchor"),
                        image: document.getElementById(stocks.objects.data.id + "_controls_up")
                    },
                    down: {
                        anchor: document.getElementById(stocks.objects.data.id + "_controls_down_anchor"),
                        image: document.getElementById(stocks.objects.data.id + "_controls_down")
                    }
                }
                
                with (docked.objects.controls.flyout.anchor)
                {
                    href = "javascript:void(0)";
                    
                    onclick = function()
                    {
                        if (docked.row.drag.index == -1 && event.button != 2)
                        {                
                            if (docked.flyout.active)
                            {
                                docked.flyout.hide(true);
                            }
                            else
                            {
                                docked.flyout.show();
                            }
                        }
                    }
                    
                    onfocus = function()
                    {
                        if (docked.action.pressed.tab && docked.objects.controls.flyout.image.disabled)
                        {
                            docked.objects.controls.up.anchor.focus();
                        }
                    }
                    
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
                            docked.action.cancel(event);
                        }
                    }
                    
                    onkeyup = function()
                    {
                        if (event.keyCode == 32)
                        {
                            if (docked.row.drag.index == -1)
                            {                
                                if (docked.flyout.active)
                                {
                                    docked.flyout.hide(true);
                                }
                                else
                                {
                                    docked.flyout.show();
                                }
                            }
                            
                            docked.action.cancel(event);
                        }
                    }
                }
                
                with (docked.objects.controls.flyout.image)
                {
                    onmouseenter = function()
                    {
                        util.image.update(this, stocks.config.image.path("glyphs_plus_hover.png"));
                    }
                    
                    onmouseleave = function()
                    {
                        util.image.update(this, stocks.config.image.path("glyphs_plus_rest.png"));
                    }
                    
                    onmousedown = function()
                    {
                        if (event.button != 2)
                        {
                            util.image.update(this, stocks.config.image.path("glyphs_plus_pressed.png"));
                        }
                    }
                    
                    onmouseup = function()
                    {
                        if (event.button != 2)
                        {
                            util.image.update(this, stocks.config.image.path("glyphs_plus_hover.png"));
                        }
                    }
                    
                    alt = stocks.config.localization.convert("AddAStockSymbol");
                }
                
                with (docked.objects.controls.up.anchor)
                {
                    href = "javascript:void(0)";
                    
                    onclick = function()
                    {
                        if (docked.row.drag.index == -1 && !docked.flyout.active && event.button != 2)
                        {
                            docked.row.scroll.up();
                        }
                    }
                    
                    onfocus = function()
                    {
                        if (docked.objects.controls.up.image.disabled)
                        {
                            if (docked.action.pressed.tab && !docked.objects.controls.down.image.disabled)
                            {
                                docked.objects.controls.down.anchor.focus();
                            }
                            else
                            {
                                this.blur();
                            }
                        }
                    }
                    
                    onmouseup = function()
                    {
                        this.blur();
                    }
                    
                    onkeydown = function()
                    {
                        if (event.keyCode == 32)
                        {
                            docked.action.cancel(event);
                        }
                    }
                    
                    onkeyup = function()
                    {
                        if (event.keyCode == 32)
                        {
                            if (docked.row.drag.index == -1 && !docked.flyout.active)
                            {
                                docked.row.scroll.up();
                            }
                            
                            docked.action.cancel(event);
                        }
                    }
                }
                
                with (docked.objects.controls.up.image)
                {
                    onclick = function()
                    {
                        docked.action.cancel(event);
                    }
                    
                    onmouseenter = function()
                    {
                        util.image.update(this, stocks.config.image.path("glyphs_up_hover.png"));
                    }
                    
                    onmouseleave = function()
                    {
                        util.image.update(this, stocks.config.image.path("glyphs_up_rest.png"));
                    }
                    
                    onmousedown = function()
                    {
                        if (event.button != 2)
                        {
                            if (docked.row.drag.index == -1 && !docked.flyout.active)
                            {
                                docked.row.scroll.action.up(true);
                            }
                            
                            util.image.update(this, stocks.config.image.path("glyphs_up_pressed.png"));
                        }
                    }
                    
                    onmouseup = function()
                    {
                        if (event.button != 2)
                        {
                            if (docked.row.drag.index == -1 && !docked.flyout.active)
                            {
                                docked.row.scroll.action.up(false);
                                docked.controls.update();
                            }
                            
                            util.image.update(this, stocks.config.image.path("glyphs_up_hover.png"));
                        }
                    }
                    
                    alt = stocks.config.localization.convert("ScrollUp");
                }
                
                with (docked.objects.controls.down.anchor)
                {
                    href = "javascript:void(0)";
                    
                    onclick = function()
                    {
                        if (docked.row.drag.index == -1 && !docked.flyout.active && event.button != 2)
                        {
                            docked.row.scroll.down();
                        }
                    }
                    
                    onfocus = function()
                    {
                        if (docked.objects.controls.down.image.disabled)
                        {
                            this.blur();
                        }
                    }
                    
                    onmouseup = function()
                    {
                        this.blur();
                    }
                    
                    onkeydown = function()
                    {
                        if (event.keyCode == 32)
                        {
                            docked.action.cancel(event);
                        }
                    }
                    
                    onkeyup = function()
                    {
                        if (event.keyCode == 32)
                        {
                            if (docked.row.drag.index == -1 && !docked.flyout.active)
                            {
                                docked.row.scroll.down();
                            }
                            
                            docked.action.cancel(event);
                        }
                    }
                }
                
                with (docked.objects.controls.down.image)
                {
                    onclick = function()
                    {
                        docked.action.cancel(event);
                    }
                    
                    onmouseenter = function()
                    {
                        util.image.update(this, stocks.config.image.path("glyphs_down_hover.png"));
                    }
                    
                    onmouseleave = function()
                    {
                        util.image.update(this, stocks.config.image.path("glyphs_down_rest.png"));
                    }
                    
                    onmousedown = function()
                    {
                        if (event.button != 2)
                        {
                            if (docked.row.drag.index == -1 && !docked.flyout.active)
                            {
                                docked.row.scroll.action.down(true);
                            }
                            
                            util.image.update(this, stocks.config.image.path("glyphs_down_pressed.png"));
                        }
                    }
                    
                    onmouseup = function()
                    {
                        if (event.button != 2)
                        {
                            if (docked.row.drag.index == -1 && !docked.flyout.active)
                            {
                                docked.row.scroll.action.down(false);
                                docked.controls.update();
                            }
                            
                            util.image.update(this, stocks.config.image.path("glyphs_down_hover.png"));
                        }
                    }
                    
                    alt = stocks.config.localization.convert("ScrollDown");
                }
                            
                docked.controls.update(true);
            }
        },
        show: function()
        {
            if (docked.controls.initialized && docked.row.drag.index == -1)
            {
                docked.controls.update(true);
                
                docked.objects.controls.obj.style.visibility = "visible";
                docked.objects.status.text.style.visibility = "hidden";
                
                docked.controls.active = true;
            }
        },
        hide: function()
        {
            if (docked.controls.initialized)
            {
                docked.objects.controls.obj.style.visibility = "hidden";
                docked.objects.status.text.style.visibility = "visible";
                
                docked.controls.active = false;
            }
        },
        update: function(b, b1)
        {
            if (b || docked.controls.active)
            {
                with (docked.objects.controls.flyout.image)
                {
                    if (!b1)
                    {
                        src = stocks.config.image.path("glyphs_plus_rest.png");
                        disabled = false;
                    }
                    else
                    {
                        src = stocks.config.image.path("glyphs_plus_disabled.png");
                        disabled = true;
                    }
                }
                
                with (docked.objects.controls.up.image)
                {
                    if (!b1 && docked.row.count > docked.row.max && docked.row.scroll.index > 0 && docked.row.scroll.index <= docked.row.count - docked.row.max && !docked.flyout.active)
                    {
                        src = stocks.config.image.path("glyphs_up_rest.png");
                        disabled = false;
                    }
                    else
                    {
                        src = stocks.config.image.path("glyphs_up_disabled.png");
                        disabled = true;
                    }
                }
                
                with (docked.objects.controls.down.image)
                {
                    if (!b1 && docked.row.count > docked.row.max && (docked.row.scroll.index < docked.row.count - docked.row.max || docked.row.scroll.index > docked.row.count - docked.row.max) && !docked.flyout.active)
                    {
                        src = stocks.config.image.path("glyphs_down_rest.png");
                        disabled = false;
                    }
                    else
                    {
                        src = stocks.config.image.path("glyphs_down_disabled.png");
                        disabled = true;
                    }
                }
            }
        },
        position:
        {
            update: function()
            {
                if (docked.controls.initialized)
                {
                    with (docked.objects.controls.obj.style)
                    {
                        left = docked.x + "px";
                        top = (docked.row.position.bottom() + Math.floor((docked.status.height - docked.controls.height) / 2)) + "px";
                    }
                }
            }
        },
        unload: function()
        {
            if (docked.controls.initialized)
            {
                util.objects.remove(docked.objects.controls.obj);
                
                docked.objects.controls = null;
                docked.controls.initialized = false;
            }
        }
    },
    status:
    {
        initialized: false,
        height: 34,
        divider:
        {
            height: 1
        },
        init: function()
        {
            docked.objects.status = {
                divider: stocksStatusDivider,
                text: stocksStatusText,
                toolbar: stocksStatusToolbar
            }
            
            with (docked.objects.status.divider.style)
            {
                height = docked.status.divider.height + "px";
                backgroundColor = "#475F6C";
            }

            docked.objects.status.toolbar.style.display = "none";
            
            with (docked.objects.status.text)
            {
                className = "dockedStatusText";
                style.width = docked.row.width + "px";
                style.height = (docked.status.height - docked.status.divider.height) + "px";
                style.visibility = "visible";
                innerHTML = stocks.config.localization.convert("QuotesByIDCComstock");
            }
            
            docked.status.initialized = true;
        },
        position:
        {
            update: function()
            {
                if (docked.status.initialized)
                {
                    with (stocks.objects.status.obj.style)
                    {
                        left = docked.x + "px";
                        top = docked.row.position.bottom() + "px";
                        width = (docked.row.width - docked.status.divider.height) + "px";
                        visibility = "visible";
                    }
                }
            }
        },
        unload: function()
        {
            if (docked.status.initialized)
            {
                docked.objects.status.toolbar.style.display = "";

                with (docked.objects.status.divider.style)
                {
                    height = "";
                    backgroundColor = "";
                }
                
                with (docked.objects.status.text)
                {
                    className = "";
                    style.width = "";
                    style.height = "";
                    style.visibility = "hidden";
                    innerHTML = "";
                }
                
                with (stocks.objects.status.obj.style)
                {
                    left = "";
                    top = "";
                    width = "";
                    visibility = "hidden";
                }
                
                docked.objects.status = null;
                docked.status.initialized = false;
            }
        }
    },
    flyout:
    {
        index: -1,
        active: false,
        closed:
        {
            index: -1,
            delay: 100,
            update: function(n, b)
            {
                if (b)
                {
                    var n1 = (n != null ? n : docked.flyout.closed.index);
                    
                    if (n1 != -1)
                    {
                        document.getElementById(stocks.objects.data.id + "_remove_href_" + n1).disabled = (n != null);
                    }
                }
                
                docked.flyout.closed.index = (n != null ? n : -1);
            }
        },
        open: function()
        {
            docked.flyout.active = true;

            System.Gadget.Flyout.file = "stocks.html";
            System.Gadget.Flyout.show = true;
            
            docked.controls.update();
        },
        show: function()
        {
            docked.row.unselect(null, true);
            
            System.Gadget.Settings.write("FlyoutShown", true);
            docked.flyout.open();
        },
        hide: function(b)
        {
            if (docked.flyout.active || System.Gadget.Flyout.show)
            {
                if (System.Gadget.Settings.read("ChartShown"))
                {
                    docked.flyout.chart.hide(b);
                }
                else
                {
                    System.Gadget.Settings.write("FlyoutShown", false);
                    
                    var o = stocks.gadget.settings.read();
                    
                    if (o.length > 0)
                    {
                        stocks.array.refresh(o);
                        
                        docked.row.update();
                        
                        stocks.msn.retrieve(true, true);
                    }
                }
                
                docked.flyout.active = false;
                
                System.Gadget.Flyout.show = false;
                
                document.body.focus();
                
                if (b)
                {
                    if (docked.flyout.index != -1)
                    {
                        docked.row.index = docked.flyout.index;
                        docked.row.select(true, docked.row.index);
                        
                        docked.flyout.closed.update(docked.flyout.index, true);
                        setTimeout("docked.flyout.closed.update(null, true)", docked.flyout.closed.delay);
                    }
                    else
                    {
                        docked.row.unselect(null, true);
                    }
                }
                else
                {
                    docked.row.unselect(null, true);
                    docked.controls.hide();
                }
                
                docked.flyout.index = -1;
                
                docked.controls.update();
            }
        },
        chart:
        {
            active: false,
            show: function(n)
            {
                var s = stocks.array.data(n, stocks.array.index.daychart);
                
                if (s)
                {
                    System.Gadget.Settings.write("ChartShown", true);
                    System.Gadget.Settings.write("ChartURL", stocks.array.data(n, stocks.array.index.news));
                    System.Gadget.Settings.write("ChartImage", stocks.array.data(n, stocks.array.index.daychart));
                    System.Gadget.Settings.write("ChartIndicator", stocks.array.data(n, stocks.array.index.indicator));
                    
                    docked.row.unselect();
                    docked.row.index = n;
                    docked.row.select(true, n, null, true);
                    
                    docked.flyout.index = n;
                    docked.flyout.open();
                    docked.flyout.chart.active = true;
                }
                else if (docked.flyout.chart.active)
                {
                    docked.flyout.hide();
                }
            },
            hide: function()
            {
                System.Gadget.Settings.write("ChartShown", false);
                System.Gadget.Settings.write("ChartURL", "");
                System.Gadget.Settings.write("ChartImage", "");
                System.Gadget.Settings.write("ChartIndicator", "");
                
                docked.flyout.chart.active = false;
            }
        }
    },
    background:
    {
        width: 130,
        height: 76,
        update: function()
        {
            with (document.body.style)
            {
                width = docked.background.dimensions.width() + "px";
                height = docked.background.dimensions.height() + "px";
            }
            
            stocksBackground.style.width = docked.background.dimensions.width() + "px";
            stocksBackground.style.height = docked.background.dimensions.height() + "px";
            stocksBackground.src = "url(" + stocks.config.image.path('stocks_docked_' + docked.row.dimensions.count() + '.png') + ")";
            
            docked.row.position.update();
            docked.controls.position.update();
            docked.status.position.update();
        },
        dimensions:
        {
            width: function()
            {
                return docked.background.width;
            },
            height: function()
            {
                return docked.background.height + (docked.row.height * (docked.row.dimensions.count() - 1));
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
    objects:
    {
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
                enter: function()
                {
                    if (!docked.availability.active)
                    {
                        docked.controls.show();
                    }
                },
                leave: function()
                {
                    if (!docked.availability.active)
                    {
                        docked.row.drag.end();
                        
                        if (!docked.flyout.active)
                        {
                            docked.row.unselect(null, true);
                            docked.controls.hide();
                        }
                    }
                }
            }
        },
        mouse:
        {
            move: function()
            {
                if (!docked.availability.active)
                {
                    docked.row.drag.move(event);
                }
            },
            up: function()
            {
                if (event.button == 2)
                {
                    return false;
                }
                
                if (!docked.availability.active)
                {
                    docked.row.drag.end();
                }
            },
            down: function()
            {
                if (event.button == 2)
                {
                    return false;
                }
                
                docked.action.pressed.tab = false;
            }
        },
        keyboard:
        {
            up: function()
            {
                if (!docked.availability.active)
                {   
                    docked.row.action.keyboard.up(event);
                }
            },
            down: function()
            {
                if (!docked.availability.active)
                {
                    switch (event.keyCode)
                    {
                        case 9:
                            docked.action.pressed.tab = true;
                            docked.controls.show();
                            break;
                        default:
                            docked.action.pressed.tab = false;
                    }
                    
                    docked.row.action.keyboard.down(event);
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
                    if (docked.availability.image.animate.index != -1)
                    {
                        util.image.animate.remove(docked.availability.image.animate.index);
                        docked.availability.image.animate.index = -1;
                    }
                }
            }
        },
        update: function(s, n)
        {
            if (s)
            {
                docked.row.count = docked.row.max;
               
                var o = util.objects.append(stocks.objects.data.id + "_availability", docked.x, docked.y, docked.row.width, docked.row.dimensions.height() + docked.status.height, 3);
                
                with (o)
                {
                    style.textAlign = "center";
                    innerHTML = '<table cellspacing="0" cellpadding="0" border="0" style="height:' + parseInt(style.height) + 'px">'+
                                '<tr>'+
                                '<td style="text-align:center">'+
                                '<table cellspacing="0" cellpadding="0" border="0">'+
                                '<tr>'+
                                '<td id="' + stocks.objects.result.id + '_availability_image" style="vertical-align:top;padding-' + stocks.config.bidi.convert("right") + ':4px;white-space:nowrap" nowrap></td>'+
                                '<td id="' + stocks.objects.result.id + '_availability_text" class="dockedAvailabilityText"></td>'+
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
                
                var w = docked.row.width - (docked.availability.padding * 2) - o.offsetWidth;
                
                o = document.getElementById(stocks.objects.result.id + "_availability_text");
                
                with (o)
                {
                    innerHTML = util.text.align(o, stocks.config.localization.convert(s), " ", w);    
                }
                
                docked.availability.active = true;
                
                docked.status.unload();
                docked.controls.unload();
                docked.row.unload(true);
                docked.background.update();
            }
            else
            {
                docked.availability.unload();
                docked.init();
            }
        },
        unload: function()
        {
            docked.availability.image.animate.reset();
            util.objects.remove(stocks.objects.data.id + "_availability");
            docked.availability.active = false;
        }
    },
    init: function()
    {
        if (stocks.msn.status.availability.active)
        {
            docked.row.init();
            docked.row.build();
            docked.row.adjust();
            docked.controls.init();
            docked.status.init();
            
            docked.availability.active = false;
        }
        else if (stocks.msn.status.availability.error != null)
        {
            docked.availability.update(stocks.msn.status.availability.error, stocks.msn.status.availability.index);
        }
        
        docked.background.update();
        
        docked.initialized = true;
    },
    unload: function()
    {
        if (docked.initialized)
        {
            docked.flyout.hide();
            docked.status.unload();
            docked.controls.unload();
            docked.row.unload();
            docked.background.unload();
            docked.availability.unload();
            
            with (document)
            {
                onkeyup = null;
                onkeydown = null;
                onmousemove = null;
                onmouseup = null;
                onmousedown = null;
                body.onmouseenter = null;
                body.onmouseleave = null;
            }
            
            docked.objects = {};
            docked.availability.active = true;
            docked.initialized = false;
            
            stocks.msn.data.listener.remove(docked.row.update);
        }
        
        System.Gadget.Flyout.onHide = function()
        {
        }
        
        stocks.config.docked = false;
    },
    load: function()
    {
        stocks.config.docked = true;
        stocks.config.image.prefix = docked.config.image.prefix;
        
        with (document)
        {
            onkeyup = docked.action.keyboard.up;
            onkeydown = docked.action.keyboard.down;
            onmousemove = docked.action.mouse.move;
            onmouseup = docked.action.mouse.up;
            onmousedown = docked.action.mouse.down;
            body.onmouseenter = docked.action.body.mouse.enter;
            body.onmouseleave = docked.action.body.mouse.leave;
        }
        
        System.Gadget.Flyout.onHide = docked.flyout.hide;
        
        docked.row.scroll.index = 0;
        docked.flyout.chart.hide();
        
        docked.init();
        
        stocks.msn.data.listener.add(docked.row.update);
        stocks.msn.load();
    }
}
