import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {fetchUser} from '../reducers/user/userActions';

@connect((store) => {
    return {
        name: store.user.user.name,
        email: store.user.user.email,
        mobile: store.user.user.mobile,
        inProgress: store.user.inProgress,
        error: store.user.error
    }
})

export default class UserDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount = () => { if(!this.props.name) this.props.dispatch(fetchUser()); };

    render() {
        return (
            <View style={s.parent}>
                <View style={s.userDetailsWrapper}>
                    <Icon style={s.icon} name={"contacts"} size={75} color={"#F37521"}/>
                    <View style={s.rightPane}>
                        <Text style={s.name} numberOfLines={1}>{this.props.name?this.props.name:"Name"} </Text>
                        <Text style={s.email} numberOfLines={1}>{this.props.email?this.props.email:"me@email.com"}</Text>
                        <Text style={s.mobile} numberOfLines={1}>+91 {this.props.mobile?(this.props.mobile.substring(0,5) + " " + this.props.mobile.substring(5)):"99999 99999"} </Text>
                    </View>
                </View>
            </View>
        );
    }

}

const s = StyleSheet.create({
    parent: {
        padding: 30,
        backgroundColor: '#eee'
    },
    userDetailsWrapper: {
        flexDirection: 'row'
    },
    icon: {
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5
    },
    rightPane: { justifyContent: 'space-between', flex: 1 },
    name: { fontSize: 25 },
    email: { fontSize: 13 },
    mobile: { fontSize: 17 },
});