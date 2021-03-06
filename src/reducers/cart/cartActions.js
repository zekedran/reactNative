import axios from 'axios';
import store from '../../store';

import {ActionConst, Actions} from 'react-native-router-flux';
import {fetchOrders} from '../order/orderActions';

export function fetchCart() {
    const url = '/cart';
    return (dispatch) => {
        dispatch({type: "FETCH_CART_IN_PROGRESS"});
        axios.get(url)
            .then((response) => { dispatch({ type: "FETCH_CART_FULFILLED", payload: response.data}); })
            .catch((error) => { dispatch({ type: "FETCH_CART_FAILED", payload: error }); });
    };
}

export function submitCart() {
    const url = '/cart';
    const cart = store.getState().cart;
    let postContent = { restaurant_orders: Object.values(cart.restaurant_orders)};
    console.log(postContent);
    return (dispatch) => {
        dispatch({type: "SUBMIT_CART_IN_PROGRESS"});
        axios.post(url, postContent)
            .then((response) => { dispatch({ type: "SUBMIT_CART_FULFILLED", payload: response.data }); Actions.checkout(); })
            .catch((error) => { dispatch({ type: "SUBMIT_CART_FAILED", payload: error }); });
    };
}

export function plusOneDishVariantToCart(orderItem, restaurantId) { return (dispatch) => { dispatch({type: "PLUS_ONE_DISH_VARIANT", orderItem: orderItem, restaurantId: restaurantId}); }; }
export function minusOneDishVariantToCart(orderItem, restaurantId) { return (dispatch) => { dispatch({type: "MINUS_ONE_DISH_VARIANT", orderItem: orderItem, restaurantId: restaurantId}); }; }
export function minusOneDishVariantLenientToCart(orderItem, restaurantId) { return (dispatch) => { dispatch({type: "MINUS_ONE_DISH_VARIANT_LENIENT", orderItem: orderItem, restaurantId: restaurantId}); }; }

export function purchaseCart() {
    const url = '/cart/purchase/cod';
    const cart = store.getState().cart;
    return (dispatch) => {
        dispatch({type: "PURCHASE_CART_IN_PROGRESS"});
        axios.post(url)
            .then((response) => { dispatch({ type: "PURCHASE_CART_FULFILLED", payload: response.data });
                                    //TODO: clear cart stack and bring it back to inCart
                                    dispatch(fetchOrders());
        Actions.pop();
        Actions.profile(ActionConst.JUMP);
        dispatch({type: "RESET_CART"}); })
            .catch((error) => { dispatch({ type: "PURCHASE_CART_FAILED", payload: error }); });
    };
}

export function getTotal() {
    let orderItems = Object.values(store.getState().cart.restaurant_orders)
                        .reduce((orderItems, restaurantOrder)=>[...orderItems,...restaurantOrder.order_items],[]);
    let dishVariants = store.getState().dishVariant.dishVariants;
    let addOnLinks = store.getState().addOnLink.addOnLinks;
    return orderItems.reduce((total, orderItem)=>{
        return total + orderItem.add_on_link_ids.reduce((price, addOnLinkId)=> price+(addOnLinks[addOnLinkId]?parseFloat(addOnLinks[addOnLinkId].price):0),(dishVariants[orderItem.dish_variant_id]?parseFloat(dishVariants[orderItem.dish_variant_id].price):0))*orderItem.quantity;
    },0);
}

export function getTotalItems() {
    return Object.values(store.getState().cart.restaurant_orders)
        .reduce((orderItems, restaurantOrder)=>[...orderItems,...restaurantOrder.order_items],[])
        .reduce((total, orderItem)=>{
        return total +  orderItem.quantity;
    },0);
}

export function getDishQuantity(id) {
    let orderItems = Object.values(store.getState().cart.restaurant_orders)
                        .reduce((orderItems, restaurantOrder)=>[...orderItems,...restaurantOrder.order_items],[]);
    let dishVariants = store.getState().dishVariant.dishVariants;
    return orderItems.reduce((quantity, orderItem) => {
        return (dishVariants[orderItem.dish_variant_id] && dishVariants[orderItem.dish_variant_id].dish_id === id)? quantity+orderItem.quantity : quantity;
    }, 0);
}
