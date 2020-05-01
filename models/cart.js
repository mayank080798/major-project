module.exports=function cart(oldCart){
    this.items      = oldCart.items     || {};
    this.totalQty   = oldCart.totalQty  || 0;
    //this.totalPrice = oldCart.totalPrice;

    this.add = function(item,id){
        let storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item:item,qty:0};

        }
        storedItem.qty++;
        //storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        //this.totalPrice+= storedItem.price;
    },
    this.reduceByOne = function(id){
        this.items[id].qty--;
        this.totalQty--;
        if(this.items[id].qty<=0){
            delete this.items[id];
        }
    },
    this.removeItem = function(id){
        this.totalQty-=this.items[id].qty;
        delete this.items[id];
    },
    this.generateArray = function(){
        let arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
    
}
