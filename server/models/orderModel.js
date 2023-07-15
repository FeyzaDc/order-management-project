class Order {
    constructor(id, customerId, name, price, createdDate) {
        this.id = id;
        this.customerId = customerId;
        this.name = name;
        this.price = price;
        this.createdDate = createdDate;
    }
}

module.exports = Order;