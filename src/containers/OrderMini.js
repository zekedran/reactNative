import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import Order from './Order';

import {fetchPaymentMethod} from '../reducers/paymentMethod/paymentMethodActions';
import {fetchOrderStatus} from '../reducers/orderStatus/orderStatusActions';

@connect((store,props) => {
    return {
        orderStatus: store.orderStatus.orderStatuses[props.order.order_status_id],
        paymentMethod: store.paymentMethod.paymentMethods[props.order.payment_method_id]
    };
})


class OrderMini extends React.Component {

    constructor(props) {
        super(props);
    }

    getIconForOrderStatus = (status) => {
        switch (status) {
            case "Processing": return "spinner";
            case "Ready": return "bell";
            case "Purchased": return "inr";
            case "Completed": return "check";
            case "Cancelled": return "times";
        }
        return "question-circle";
    };

    getIconForPaymentMethod = (method) => {
        switch (method) {
            case "COD": return "money";
            case "Netbanking": return "globe";
            case "Card": return "credit-card";
        }
        return "question-circle";
    };

    componentWillMount = () => {
        this.props.dispatch(fetchOrderStatus(this.props.order.order_status_id));
        this.props.dispatch(fetchPaymentMethod(this.props.order.payment_method_id));
    };

    render() {
        return (
            <View style={s.parent}>
                <TouchableOpacity onPress={()=>Actions.order({
                    order:this.props.order,
                    orderStatus:this.props.orderStatus,
                    paymentMethod:this.props.paymentMethod,
                    getIconForOrderStatus:this.getIconForOrderStatus,
                    getIconForPaymentMethod:this.getIconForPaymentMethod
                })}>
                    <View style={s.shortView}>
                        <View style={s.leftPane}>
                            <View style={s.icon}><Icon name={this.getIconForOrderStatus(this.props.orderStatus?this.props.orderStatus.name:"")} size={15} color={"#007402"}/></View>
                            <Text style={s.date}>{ new Date(this.props.order.ordered_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) }</Text>
                            <Text style={s.time}>({ new Date(this.props.order.ordered_at).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', hour12: true }) })</Text>
                        </View>
                        <View style={s.rightPane}>
                            <Text>{ this.props.order.order_items.length } {this.props.order.order_items.length>1?"items":"item"}   | </Text>
                            <Text onLayout={(e)=>{this.props.updatePriceWidth(e.nativeEvent.layout.width)}} style={[s.shortViewPrice, this.getShortViewPriceWidth()]}>₹ { parseFloat(this.props.order.total).toFixed(2) }</Text>
                            <Icon style={s.button} name={"chevron-circle-right"} size={20} color={"#F37521"}/>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    this.props.selected &&
                    <Order />
                }
            </View>
        );

    }

    getShortViewPriceWidth = () => {
        if(this.props.priceWidth) return ({width: this.props.priceWidth});
        else return ({});
    }

}

const s = StyleSheet.create({
    parent: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5
    },
    shortView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    shortViewPrice: {
        padding: 6,
        textAlign: 'right'
    },
    leftPane: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    date: {
        fontSize: 15,
        paddingRight: 5
    },
    time: { fontSize: 12 },
    rightPane: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    extended: {
        marginTop: 5,
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 5
    },
    button: {
        paddingLeft: 10,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    icon: {
        width: 35,
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    }
});

export default OrderMini;