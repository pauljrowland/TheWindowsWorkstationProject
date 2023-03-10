////////////////////////////////////////////////////////////////////////////////
//
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
util =
{
    objects:
    {
        coordinates: function(s)
        {
            var p = {x:0,y:0};
            var o;

            if (typeof s == "string")
            {
                o = document.getElementById(s);
            }
            else {
                o = s;
            }
            
            if (o != null)
            {
                while (o)
                {
                    p.x += o.offsetLeft;
                    p.y += o.offsetTop;
                    o = o.offsetParent;
                }
            }

            return p;
        },
        append: function(id, x, y, w, h, z, bg, fi, parent)
        {
            var o;
            var b = true;
                        
            if (document.getElementById(id) != null)
            {
                o = document.getElementById(id);
                b = false;
            }
            else
            {
                o = document.createElement("DIV");
                o.id = id;
            }
            
            o.unselectable = "on";
            
            with (o.style)
            {
                position = "absolute";
                
                if (x != null)
                {
                    left = x + "px";
                }
                
                if (y != null)
                { 
                    top = y + "px";
                }
                
                if (w != null)
                {
                    width = w + "px";
                }
                
                if (h != null)
                {
                    height = h + "px";
                }
                
                if (z != null)
                {
                    zIndex = z;
                }
                
                if (bg != null)
                {
                    background = bg;
                }
                
                if (fi != null)
                {
                    filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + fi + ")";
                }
            }
            
            if (parent)
            {
                parent.appendChild(o);
            }
            else if (b)
            {
                document.body.appendChild(o);
            }
            
            return o;
        },
        remove: function(s)
        {
            var o;
            
            if (typeof s == "string")
            {
                o = document.getElementById(s);
            }
            else {
                o = s;
            }

            if (o)
            {
                with (o)
                {
                    style.visibility = "hidden";
                    innerHTML = "";
                }
                
                document.body.removeChild(o);
            }
        }
    },
    image:
    {
        animate:
        {
            objects: [],
            add: function(o, s, x, w, h, speed)
            {
                var o1 = document.createElement("DIV");
                
                with (o1)
                {
                    id = o.id + "_animate_0";
                    style.width = x + "px";
                    style.height = h + "px";
                    style.overflow = "hidden";
                    
                    unselectable = "on";
                    
                    innerHTML = '<img id="' + o.id + '_animate_1" src="' + s + '" unselectable="on" style="position:absolute;top:0px;left:0px" />';
                }
                
                o.appendChild(o1);
                
                var n = -1;
                
                for (var i = 0; i < util.image.animate.objects.length; i++)
                {
                    if (util.image.animate.objects[i] == null)
                    {
                        util.image.animate.objects[i] = [o, null];
                        n = i;
                    }
                }
                
                if (n == -1)
                {
                    util.image.animate.objects.push([o, null]);
                    n = util.image.animate.objects.length - 1;
                }
                
                util.image.animate.objects[n][1] = setTimeout("util.image.animate.rotate(" + n + "," + x + "," + w + "," + speed + ")", speed);
                
                return n;
            },
            remove: function(n)
            {
                if (util.image.animate.objects[n] != null)
                {
                    var o = document.getElementById(util.image.animate.objects[n][0].id + "_animate_0");
                    
                    if (o)
                    {
                        o.innerHTML = "";
                        
                        util.image.animate.objects[n][0].removeChild(o);
                    }
                    
                    clearTimeout(util.image.animate.objects[n][1]);
                    util.image.animate.objects[n] = null;
                }
            },
            rotate: function(n, x, w, speed)
            {
                var o = document.getElementById(util.image.animate.objects[n][0].id + "_animate_1");

                if (o != null) 
                {
                    var x0 = parseInt(o.style.left) - x;
                    
                    if (Math.abs(x0) >= w)
                    {
                        x0 = 0;
                    }
                    
                    o.style.left = x0 + "px";
                    
                    util.image.animate.objects[n][1] = setTimeout("util.image.animate.rotate(" + n + "," + x + "," + w + "," + speed + ")", speed);
                }
            }
        },
        update: function(o, s)
        {
            if (o && o.style.visibility != "hidden" && !o.disabled)
            {
                o.src = s;
            }
        }
    },
    text:
    {
        ellipse: "...",
        regex:
        {
            invalid: /[^a-zA-Z0-9]+/
        },
        test:
        {
            font: function(o, s)
            {
                var o1 = util.objects.append(stocks.objects.data.id + "_test");
                
                with (o1)
                {
                    style.visibility = "hidden";
                    innerHTML = '<table cellspacing="0" cellpadding="0" border="0">'+
                                '<tr>'+
                                '<td id="' + stocks.objects.data.id + '_testfont" style="white-space:nowrap" nowrap>' + (s != null ? s : "") + '</td>'+
                                '</tr>'+
                                '</table>';
                }
                
                o1 = document.getElementById(stocks.objects.data.id + "_testfont");
                
                with (o1)
                {
                    className = o.className;
                    style.fontFamily = o.style.fontFamily;
                    style.fontSize = o.style.fontSize;
                    style.fontWeight = o.style.fontWeight;
                }
                
                return o1;
            }
        },
        trim: function(o, s, w0, w1)
        {
            var o1 = util.text.test.font(o, s);
            
            if (w0 == null)
            {
                return o1.offsetWidth;
            }
            
            if (o1.offsetWidth > w0)
            {
                var n = s.length - 1;

                do
                {
                    n--;
                    o1.innerHTML = s.substring(0, n) + util.text.ellipse;
                }
                while ((o1.offsetWidth > w0 && n > 0) || util.text.regex.invalid.test(s.charAt(n)))
                
                s = s.substring(0, n) + util.text.ellipse;
            }

            if (w1 != null)
            {
                w1 = Math.max(w1, o1.offsetWidth);
            }
            
            util.objects.remove(stocks.objects.data.id + "_test");
            
            return (w1 == null ? s : [s, w1]);
        },
        align: function(o, s, s1, w0)
        {
            s = util.text.strip.spaces(s);
            
            var o1 = s.split(s1);
            
            if (o1.length <= 1)
            {
                return s;
            }
            
            var n = 0;
            var s = "";
            
            while (n < o1.length)
            {
                var s2 = "";
                var n1 = 0;
                
                var obj = util.text.test.font(o);
                
                do
                {
                    var s3 = s2 + (n1 > 0 ? s1 : "") + o1[n];
                    
                    obj.innerHTML = s3;
                    
                    if (obj.offsetWidth > w0)
                    {
                        if (n1 > 0)
                        {
                            n--;
                        }
                        else
                        {
                            s2 = util.text.trim(o, s3, w0);
                        }
                        
                        break;
                    }
                    
                    s2 = s3;
                    
                    n++;
                    n1++;
                }
                while (obj.offsetWidth < w0 && n < o1.length)
                
                util.objects.remove(stocks.objects.data.id + "_test");
                
                s += (s != "" ? "<br />" : "") + s2;
                
                n++;
            }
            
            return s;
        },
        fill: function(s, s1)
        {
            return (s != null ? s : s1);
        },
        strip:
        {
            id: function(s)
            {
                return s.replace(/id=\"[a-zA-Z0-9_-]+\"/g, "");
            },
            spaces: function(s)
            {
                return s.replace(/^[\s]+/g,"").replace(/[\s]+$/g,"");
            }
        }
    },
    web:
    {
        url: function(s)
        {
            System.Shell.execute(s);
        }
    }
}
