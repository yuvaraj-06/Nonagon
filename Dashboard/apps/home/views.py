# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse
from django.shortcuts import render
from django.template.defaulttags import register

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


def index(request):
    context = {'segment': 'index','earn':5000}

    html_template = loader.get_template('home/index.html')
    d={"earn":510}
    d_imgs={'DAI':"https://s2.coinmarketcap.com/static/img/coins/200x200/4943.png","LINK":"https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700","USDT":"https://s2.coinmarketcap.com/static/img/coins/200x200/825.png","USDC":"https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png","WBTC":"https://s2.coinmarketcap.com/static/img/coins/200x200/3717.png","WETH":"https://raw.githubusercontent.com/dappradar/tokens/main/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/logo.png",}
    d_info={'DAI':['USDC','USDT'],'LINK':['USDT','DAI'],'USDT':['LINK','DAI','WBTC','WETH','USDC'],'USDC':['USDT','DAI','LINK','WETH','WBTC'],'WBTC':['USDC','USDT'],'WETH':['USDT','WBTC','USDC']}
    d_imgc={'DAI':"https://s2.coinmarketcap.com/static/img/coins/200x200/4943.png","LINK":"https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700","USDT":"https://s2.coinmarketcap.com/static/img/coins/200x200/825.png","USDC":"https://s2.coinmarketcap.com/static/img/coins/200x200/3408.png","WBTC":"https://s2.coinmarketcap.com/static/img/coins/200x200/3717.png","WETH":"https://raw.githubusercontent.com/dappradar/tokens/main/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/logo.png",}

    return render(request, 'home/index.html',{"earn":510,"rise":"+40","spend":600,"rise_s":"+20","balance":"6185","rise_b":"4","assets":8,"coins":["BTC", "ETH", "USDT", "USDC", "FIL", "MATIC","BNB"],"prices":[1300, 1800, 756, 324, 782, 564, 237, 422],"d_info":d_info,"d_imgs":d_imgs,"d_imgc":d_imgc})



def pages(request):
    context = {}
    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:

        load_template = request.path.split('/')[-1]

        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))
        context['segment'] = load_template

        html_template = loader.get_template('home/' + load_template)
        return HttpResponse(html_template.render(context, request))

    except template.TemplateDoesNotExist:

        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))

    except:
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render(context, request))
