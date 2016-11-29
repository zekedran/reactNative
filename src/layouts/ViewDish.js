import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';

import Dish from '../views/Dish';
import {fetchDish} from '../reducers/dishCategory/dishCategoryActions';

@connect((store) => {
    return {
        dishCategories: store.dishCategory.dishCategories
    }
})


export default class ViewDish extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount = () => { if(this.getDish() && !this.getDish().hasOwnProperty('dish_variants')) this.props.dispatch(fetchDish(this.props.id, this.props.category_id)) };
    handleAddToCart = (variant_id, dish_id, category_id) => { console.log("Veriant: "+variant_id+" Dish "+dish_id+" Category "+category_id) };
    getDish() { return this.props.dishCategories.filter(dishCategory => dishCategory.id === this.props.category_id)[0].dishes.filter(dish => dish.id == this.props.id)[0] }

    render() {
        return (
            <View style={s.parent}>
                <TouchableHighlight
                    onPress={Actions.pop}
                    style={{padding:10, backgroundColor: '#f77', margin: 10}}>
                    <Text>Go back</Text>
                </TouchableHighlight>
                <Text> Dish id: { this.props.id } </Text>
                { this.getDish() && this.getDish().inProgress && <Text> inProgress </Text> }
                { this.getDish() && this.getDish().hasOwnProperty('dish_variants') && <Dish dish={this.getDish()} category_id={this.props.category_id} addToCart={this.handleAddToCart} /> }
                { this.getDish() && this.getDish().error != null && !this.getDish().inProgress && <Text> {this.getDish().error.toString()} </Text> }
            </View>
        );
    }

}

const s = StyleSheet.create({
    parent: {
        padding: 10,
        backgroundColor: '#CCC'
    }
});