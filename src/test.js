function generateItemsBuy(selectedItems, AllItems) {
    // 生成数组ItemsNum，用于记录所点Item的数目 
    var ItemsNum = new Array(AllItems.length);
    for (var i=0; i<AllItems.length; ++i) {
        ItemsNum[i] = 0;
    }
    var num = selectedItems.length;
    var ItemName = '';
    var ItemNum = 0;
    for (var i=0;i<num;i++){ 
      ItemName = selectedItems[i].slice(0,8);
      ItemNum = selectedItems[i].slice(11,13);
      for (var j=0;j<AllItems.length;j++){
          if (ItemName == AllItems[j].id){
              ItemsNum[j] += parseFloat(ItemNum);	
          }
      }
    }
    return ItemsNum;
  }
  
  function generateItemsBuyString(ItemsNum, AllItems) {
      // 生成所购的所有Item和价格清单String
      var AllItemsBuyString = '';
      for (var i=0; i<AllItems.length; ++i) {
        if (ItemsNum[i]!=0) {
            AllItemsBuyString += AllItems[i].name;
            AllItemsBuyString += ' x ';
            AllItemsBuyString += ItemsNum[i];
            AllItemsBuyString += ' = ';
            AllItemsBuyString += AllItems[i].price*ItemsNum[i];
            AllItemsBuyString += '元';
            AllItemsBuyString += '\n';
        }
      }
      return AllItemsBuyString;
  }
  
  function calculateNoDiscount(ItemsNum, AllItems) {
    // 计算没有任何优惠时的Cost
    var CostWithoutDiscount = 0;
    for (var i=0; i<AllItems.length; ++i) {
        CostWithoutDiscount += ItemsNum[i]*AllItems[i].price;    
    }
    return CostWithoutDiscount;
  }
  
  
  
  function calculateDiscountWay1(AllPromotions, CostWithoutDiscount) {
    // 计算第一种优惠方式的价格，即‘满30减6元’
    var CostWithDiscountWay1 = CostWithoutDiscount;
    var upBound = AllPromotions[0].type.slice(1,3);
    if (CostWithoutDiscount >=  upBound)
    {
        CostWithDiscountWay1 -= AllPromotions[0].type.slice(4,5);
    }
    return CostWithDiscountWay1;
  }
  
  function generateDiscountItems(AllItems, AllPromotions) {
    // 生成数组DiscountItems，用于记录第二种优惠方式打折的Item
    var DiscountItems = new Array(AllItems.length);
    for (var i=0; i<AllItems.length; ++i) {
        DiscountItems[i] = 0;
    }
    var DiscountItemsNum = AllPromotions[1].items.length;
    var DiscountItem = '';
    for (var i=0; i<DiscountItemsNum; ++i) {
        DiscountItem = AllPromotions[1].items[i];
        for (var j=0; j<AllItems.length; ++j) {
          if (AllItems[j].id == DiscountItem) {
              DiscountItems[j] = 1;
          }
        }
    }
    return DiscountItems;
  }
  
  function calculateDiscountWay2(ItemsNum, AllItems, AllPromotions) {
    // 计算第二种优惠方式的价格，即‘指定菜品半价’
    var CostWithDiscountWay2 = 0;
    DiscountItems = generateDiscountItems(AllItems, AllPromotions);
    // 对于打折Item计算半价，不打折Item原价
    for (var i=0; i<AllItems.length; ++i) {
        if (DiscountItems[i] == 1) {
          CostWithDiscountWay2 += ItemsNum[i]*AllItems[i].price*0.5;
        }
        else {
        CostWithDiscountWay2 += ItemsNum[i]*AllItems[i].price;
        }   
    }
    return CostWithDiscountWay2;
  }
  
  function generateDiscount1String(CostWithoutDiscount, CostWithDiscountWay1, AllPromotions) {
    // 生成使用第一种优惠方式的String
    var Discount1String = '';
    Discount1String += '-----------------------------------';
    Discount1String += '\n';
    Discount1String += '使用优惠:';
    Discount1String += '\n';
    Discount1String += AllPromotions[0].type;
    Discount1String += '，省';
    Discount1String += CostWithoutDiscount-CostWithDiscountWay1;
    Discount1String += '元';
    Discount1String += '\n';
  
    return Discount1String;
  }
  
  function generateDiscount2String(CostWithoutDiscount, CostWithDiscountWay2, AllPromotions, AllItems, DiscountItems) {
    // 生成使用第二种优惠方式的String
    var Discount2String = '';
    DiscountItems = generateDiscountItems(AllItems, AllPromotions);
    Discount2String += '-----------------------------------';
    Discount2String += '\n';
    Discount2String += '使用优惠:';
    Discount2String += '\n';
    Discount2String += AllPromotions[1].type;
    Discount2String += '(';
    var count = AllPromotions[1].items.length;
    for (var i=0; i<AllItems.length; ++i) {
        if (DiscountItems[i] == 1) {
          Discount2String += AllItems[i].name;
          count -= 1;
          if (count > 0) {
              Discount2String += '，';
          }
      }
    }
    Discount2String += ')，省';
    Discount2String += CostWithoutDiscount-CostWithDiscountWay2;
    Discount2String += '元';
    Discount2String += '\n';
  
    return Discount2String;
  }
  
  function generateHeadString() {
    // 生成菜单Head部分
    var HeadString = '';
    HeadString += '============= 订餐明细 =============';
    HeadString += '\n';
    return HeadString;
  }
  
  function generateTailString(Cost) {
      // 生成菜单Tail部分
      var TailString = '';
      TailString += '-----------------------------------';
      TailString += '\n';
      TailString += '总计：';
      TailString += Cost;
      TailString += '元';
      TailString += '\n';
      TailString += '===================================';
      return TailString;
  }
  
  function chooseBestDiscount(ItemsNum, AllItems, AllPromotions) {
    // 自动选择最优惠的方式并计算出最终金额，生成最优惠方式的String
    var BestDiscountString = '';
    CostWithoutDiscount = calculateNoDiscount(ItemsNum, AllItems);
    CostWithDiscountWay1 = calculateDiscountWay1(AllPromotions, CostWithoutDiscount);
    CostWithDiscountWay2 = calculateDiscountWay2(ItemsNum, AllItems, AllPromotions);
    if (CostWithDiscountWay1<CostWithoutDiscount && CostWithDiscountWay1<CostWithDiscountWay2) {
        Discount1String = generateDiscount1String(CostWithoutDiscount, CostWithDiscountWay1, AllPromotions);
      BestDiscountString += Discount1String;
      BestDiscountString += generateTailString(CostWithDiscountWay1);
    }
    else if (CostWithDiscountWay2<CostWithoutDiscount) {
        DiscountItems = generateDiscountItems(AllItems, AllPromotions);
      Discount2String = generateDiscount2String(CostWithoutDiscount, CostWithDiscountWay2, AllPromotions, AllItems, DiscountItems);
      BestDiscountString += Discount2String;
      BestDiscountString += generateTailString(CostWithDiscountWay2);
    }
    else {
      BestDiscountString += generateTailString(CostWithoutDiscount);
    }
    return BestDiscountString;
  }
  
  function bestCharge(selectedItems) {
    // 输入AllItems和AllPromotions
    var AllItems = loadAllItems();
    var AllPromotions = loadPromotions();
    var resultString = '';
    // 初始化输出菜单的string
    resultString += generateHeadString();
    
    // 生成菜单的Items部分
    ItemsNum = generateItemsBuy(selectedItems,AllItems);
    AllItemsBuyString = generateItemsBuyString(ItemsNum, AllItems);
    resultString += AllItemsBuyString;
    
    // 自动选择最优惠的方式并计算出最终金额，并生成最优惠方式的String
    var BestDiscountString = chooseBestDiscount(ItemsNum, AllItems, AllPromotions);
    resultString += BestDiscountString;
    
    
    return resultString;
  }
  