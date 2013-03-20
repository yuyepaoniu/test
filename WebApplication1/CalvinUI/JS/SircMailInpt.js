﻿/// <reference path="jquery-1.4.1-vsdoc.js" />
/// <reference path="../../JsLib/jq1.72.js" />
/// <reference path="CalvinAutoComplete.js" />
/********************************************************************************************
* 文件名称:	CalvinMailInput.js
* 设计人员:	许志伟 
* 设计时间:	
* 功能描述:	邮箱输入
* 注意事项：如果变量前面有带$表示的是JQ对象
*
*注意：允许你使用该框架 但是不允许修改该框架 有发现BUG请通知作者 切勿擅自修改框架内容
*
********************************************************************************************/
(function () {
    var rName = /[;]/g;
    var ItemHepler = {
        AddUser: function (input, name, id) {
            name = name.replace(rName, "");
            if (!name) return;
            var str = "<div style='float: left; white-space: nowrap;' class='addr_base " + (id ? "addr_normal" : "addr_error") + "'" + "addr='" + id + "'>" + "<b class='addr_name'>" + name + "</b>" + "<span class='semicolon'>;</span>" + "<a class='addr_del' href='javascript:;' name='del'></a>" + "</div>";
            var $UserAddr = $(str);
            $(input.parentNode).before($UserAddr);
            EventHelper.BindUserAddrEvent($UserAddr);
            input = null
        }
    };

    function WrapText(textbox) {
        var str = "<div class='div_txt'>" + "<div  class='addr_text'>" + "</div>" + "<div style='clear:both;border:none;margin:0;padding:0;'></div></div>";
        return $(textbox).wrapAll(str).parent().parent()
    };

    function GetCollectValue(textBox) {
        var values = [],
			$this, name = "";
        $("div.addr_base", $(textBox).data("MailInput.data").$Mail_Container).each(function () {
            $this = $(this);
            if (!$this.hasClass("addr_error")) {
                var name = $("b.addr_name", this).text();
                values.push({
                    id: this.addr,
                    name: name
                })
            }
        });
        return values
    };
    var Defaluts = {
        data: [],
        url: "",
        min: 1
    };
    var EventHelper = {
        setInputEvent: function ($text) {
            $text.keyup(function (e) {
                var length = $(this).val()._getLength();
                $(this).parent().width(28 + length * 6);
                $(this).css("padding-left", "0px").css("padding-left", "0px")
            });
            $text.keyup(function (e) {
                var keyCode = e.keyCode;
                if (keyCode == 186) {
                    ItemHepler.AddUser($text[0], $(this).val(), "");
                    $(this).val('');
                    return
                }
            });
            $text.parent().parent().click(function () {
                $text[0].focus()
            })
        },
        BindUserAddrEvent: function ($UserAddr) {
            $UserAddr.click(function (e) {
                $("div.addr_base").removeClass("addr_select fn_list");
                $(this).removeClass("addr_over");
                $(this).addClass("addr_select fn_list");
                e.stopPropagation()
            });
            $UserAddr.hover(function () {
                if ($(this).hasClass("fn_list")) {
                    return
                }
                $(this).removeClass("addr_select fn_list");
                $(this).addClass("addr_over")
            }, function () {
                $(this).removeClass("addr_over")
            });
            $UserAddr.keyup(function (e) {
                var keyCode = e.keyCode;
                if (keyCode == 8 || keyCode == 46) {
                    $(this).remove()
                }
            })
        }
    };
    $.fn.MailInput = function (options, param) {
        if (typeof options === "string") {
            switch (options.toUpperCase()) {
                case "ADD":
                    ItemHepler.AddUser(this[0], param.name, param.mail);
                    return;
                case "GETVALUES":
                    return GetCollectValue(this[0]);
                    return
            }
        };
        return this.each(function () {
            var opts = {};
            var $this = $(this);
            $this.addClass("mail_input");
            var state = $.data(this, 'MailInput.data');
            if (state) {
                $.extend(opts, state.options, options);
                state.options = opts
            } else {
                $.extend(opts, Defaluts, options);
                var $Mail_Container = WrapText(this);
                $this.data("MailInput.data", {
                    options: opts,
                    $Mail_Container: $Mail_Container
                });
                $this.CalvinAutoComplete({
                    dynamicStyle: true,
                    styleInfo: {
                        width: 250
                    },
                    min: opts.min,
                    dynamicSource: true,
                    ajaxOption: {
                        url: opts.url,
                        extendData: {},
                        error: function (xhr, $loading) {
                            alert("搜索单位信息发生错误!");
                        }
                    },
                    selected: function (event, ui) {
                        ItemHepler.AddUser($this[0], ui.text, ui.value);
                        $this.val("");
                        $this.parent().width(28)
                    }
                });
                EventHelper.setInputEvent($this)
            }
        })
    }
})();

