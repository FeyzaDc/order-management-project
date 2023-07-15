import Vue from 'vue'
import VueRouter from 'vue-router'

import CustomerPage from './components/CustomerPage'
import OrderPage from './components/OrderPage'

Vue.use(VueRouter);

export const router = new VueRouter({
    routes: [
        {
            path: "/",
            name: "/",
            component: CustomerPage
        },
        {
            path: "/:customerId/orders",
            name: "order",
            component: OrderPage
        },
    ],
    mode: "history"
})