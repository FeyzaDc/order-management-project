<template>
    <div>
        <div>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        </div>
        
        <b-alert
        :show="dismissCountDown"
        dismissible
        fade
        variant="danger"
        @dismissed="dismissCountDown=0"
        >
            Customer's order is available. This customer cannot be deleted.
        </b-alert>
        
        <div class="container mt-5" id="customer-page">   

            <b-button variant="info mb-3" v-b-modal.add-customer-modal>Add New</b-button>
            <b-table hover :items="customers" sort-by="id" :fields="tableFields">
                <template #cell(actions)="row">
                    <b-button pill variant="light" size="sm" v-b-modal.update-customer-modal @click="getCustomerById(row.item.id)"><i class="fa-solid fa-pen"></i></b-button>
                    <b-button pill variant="dark" size="sm" @click="ordersOfCustomer(row.item)">Orders</b-button>
                    <b-button pill variant="outline-danger" size="sm" @click="deleteCustomer(row.item.id)"><i class="fa-solid fa-trash"></i></b-button>
                </template>
            </b-table>

            <!-- click "Add New" : add-customer-modal -->
            <b-modal id="add-customer-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" title="New Customer" hide-footer>
                <b-form @submit.prevent="createCustomer">
                    <b-row class="modal-row">
                        <label for="first-name">First Name</label>
                        <b-form-input v-model="customer.firstName" id="first-name" placeholder="Customer's name" required></b-form-input>
                    </b-row>
                    <b-row class="modal-row">
                        <label for="last-name">Last Name</label>
                        <b-form-input v-model="customer.lastName" id="last-name" placeholder="Customer's name" required></b-form-input>                
                    </b-row>
                    <b-row class="modal-row">
                        <label for="email">Email</label>
                        <b-form-input v-model="customer.email" type="email" id="email" placeholder="Customer's email" required></b-form-input>
                    </b-row>
                    <b-row class="modal-row">
                        <label for="age">Age</label>
                        <b-form-input v-model="customer.age" type="number" id="age" placeholder="Customer's age" required></b-form-input>
                    </b-row>
                        
                    <b-row class="modal-row button-row">
                        <b-button type="submit" variant="primary">Save</b-button>
                    </b-row>
                </b-form>           
            </b-modal>

            <!-- click "Update" : update-customer-modal -->
            <b-modal id="update-customer-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" title="Customer" hide-footer>
                <b-form @submit.prevent="updateCustomer">
                    <b-row class="modal-row">
                        <label for="first-name">First Name</label>
                        <b-form-input v-model="customer.firstName" id="first-name" placeholder="Customer's name" required></b-form-input>
                    </b-row>
                    <b-row class="modal-row">
                        <label for="last-name">Last Name</label>
                        <b-form-input v-model="customer.lastName" id="last-name" placeholder="Customer's surname" required></b-form-input>                
                    </b-row>
                    <b-row class="modal-row">
                        <label for="email">Email</label>
                        <b-form-input v-model="customer.email" type="email" id="email" placeholder="Customer's email" required></b-form-input>
                    </b-row>
                    <b-row class="modal-row">
                        <label for="age">Age</label>
                        <b-form-input v-model="customer.age" type="number" id="age" placeholder="Customer's age" required></b-form-input>
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
            customer: {
                firstName : "",
                lastName : "",
                email : "",
                age : null
            },
            customerId: "",
            customers: [],
            tableFields: [
                { key: 'firstName', label: 'First Name' },
                { key: 'lastName', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'age', label: 'Age' },
                { key: 'actions', label: '' }
            ],
            dismissSecs: 3,
            dismissCountDown: 0
        };
    },    
    methods: {
        getAllCustomers() {
            axios.get('http://localhost:3000/customers')
            .then(response => {
                this.customers = response.data                
            })
            .catch(error => {
                console.error(error);
            });
        },
        getCustomerById(id) {
            this.customerId = id;
            axios.get('http://localhost:3000/customers/' + id)
            .then(response => {
                this.customer = response.data
            })
            .catch(error => {
                console.error(error);
            });
        },
        createCustomer() {
            axios.post('http://localhost:3000/customers', {
                firstName: this.customer.firstName,
                lastName: this.customer.lastName,
                email: this.customer.email,
                age: this.customer.age
            })
            .then(response => {
                console.log(response.data)
                this.getAllCustomers();    

                this.customer.firstName = "";
                this.customer.lastName = "";
                this.customer.email = "";
                this.customer.age = null;
            })
            .catch(error => {
                console.error(error);
            });
        }, 
        updateCustomer() {
            axios.put('http://localhost:3000/customers/' + this.customerId, {
                firstName: this.customer.firstName,
                lastName: this.customer.lastName,
                email: this.customer.email,
                age: this.customer.age
            })
            .then(() => {
                this.getAllCustomers();
            })
            .catch(error => {
                console.error(error);
            });
        },     
        deleteCustomer(id) {
            this.customerId = id;
            axios.delete('http://localhost:3000/customers/' + id)
            .then(response => {
                console.log(response.data)
                this.getAllCustomers();
            })
            .catch(error => {
                console.error(error);
                this.showAlert();
            });            
        },

        // routes the orders of selected customer
        ordersOfCustomer(item) {
            this.$router.push(item.id + '/orders');
        },
        
        showAlert() {
            this.dismissCountDown = this.dismissSecs
        }
    },
    mounted() {
        this.getAllCustomers();
        document.title = 'Customers Page';
    }    
};
</script>