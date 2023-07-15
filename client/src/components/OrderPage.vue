<template>
    <div>
        <div>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        </div>

        <div class="container mt-5" id="order-page">

            <div class="mb-3">
                <router-link to="/"><b-button pill variant="light"><i class="fa-solid fa-arrow-left"></i></b-button></router-link>&nbsp;
                <b-button variant="info" v-b-modal.add-order-modal>Add New</b-button>
            </div>

            <b-table :items="orders" :fields="tableFields">
                <template #cell(actions)="row">
                    <b-button pill variant="light" size="sm" v-b-modal.update-order-modal @click="getOrderById(row.item.id)"><i class="fa-solid fa-pen"></i></b-button>
                    <b-button pill variant="outline-danger" size="sm" @click="deleteOrder(row.item.id)"><i class="fa-solid fa-trash"></i></b-button>
                </template>
            </b-table>
            
            <!-- click "Add New" : add-order-modal -->
            <b-modal id="add-order-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" title="New Order" hide-footer>
                <b-form @submit.prevent="createOrder">
                    <b-row class="modal-row">
                        <label for="name">Name</label>
                        <b-form-input v-model="order.name" id="name" placeholder="Order's name" required></b-form-input>
                    </b-row>
                    <b-row class="modal-row">
                        <label for="price">Price</label>
                        <b-form-input v-model="order.price" id="price" placeholder="Order's price" required></b-form-input>                
                    </b-row>
                        
                    <b-row class="modal-row button-row">
                        <b-button type="submit" variant="primary">Save</b-button>
                    </b-row>
                </b-form>           
            </b-modal>

            <!-- click "Update" : update-order-modal -->
            <b-modal id="update-order-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" title="Customer" hide-footer>
                <b-form @submit.prevent="updateOrder">
                    <b-row class="modal-row">
                        <label for="name">Name</label>
                        <b-form-input v-model="order.name" id="name" placeholder="Order's name" required></b-form-input>
                    </b-row>
                    <b-row class="modal-row">
                        <label for="last-name">Price</label>
                        <b-form-input v-model="order.price" id="last-name" placeholder="Order's price" required></b-form-input>                
                    </b-row>
                        
                    <b-row class="modal-row button-row">
                        <b-button type="submit" variant="primary">Update</b-button>
                    </b-row>
                </b-form>
            </b-modal>  
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            order: {
                name : "",
                price : "",
            },
            customerId: this.$router.history.current.params.customerId,
            orderId : "",
            orders: [],
            tableFields: [
                { key: 'name', label: 'Name' },
                { key: 'price', label: 'Price' },
                { key: 'createdDate', label: 'Created Date' },
                { key: 'actions', label: '' }
            ]
        };
    },
    methods: {
        getAllOrders() {
            axios.get('http://localhost:3000/customers/' + this.customerId + '/orders')
            .then(response => {
                this.orders = response.data
            })
            .catch(error => {
                console.error(error);
            });
        },
        getOrderById(id) {
            this.orderId = id;
            axios.get('http://localhost:3000/customers/' + this.customerId + '/orders/' + id)
            .then(response => {
                this.order = response.data;
            })
            .catch(error => {
                console.error(error);
            });                      
        },
        createOrder() {
            axios.post('http://localhost:3000/customers/' + this.customerId + '/orders', {
                name: this.order.name,
                price: this.order.price
            })
            .then(response => {
                console.log(response.data)
                this.getAllOrders();    

                this.order.name = "";
                this.order.price = "";
            })
            .catch(error => {
                console.error(error);
            });
        },
        updateOrder() {
            axios.put('http://localhost:3000/customers/' + this.customerId + '/orders/' + this.orderId, {
                name: this.order.name,
                price: this.order.price
            })
            .then(() => {
                this.getAllOrders();
            })
            .catch(error => {
                console.error(error);
            });
        },
        deleteOrder(id) {
            this.orderId = id;
            axios.delete('http://localhost:3000/customers/' + this.customerId + '/orders/' + id)
            .then(response => {
                console.log(response.data)
                this.getAllOrders();
            })
            .catch(error => {
                console.error(error);
            });
        },
    },
    mounted() {
        this.getAllOrders();
        document.title = 'Orders Page';
    },
};
</script>