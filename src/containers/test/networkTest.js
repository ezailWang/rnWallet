import React,{Component} from 'react'
import {
    Platform,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import networkManage from '../../utils/networkManage'
import {defaultTokens} from '../../utils/constants'

export default class networkTest extends Component {
    constructor(props){
        super(props)
        this.state = {
            address:"",
            balance:0
        }
    }
s
    getBalance = async ()=>{
        const params = defaultTokens[0]
        const balance = await networkManage.getBalance(params)
        console.log('balance:',balance)
        this.setState({
            balance:balance
        })
    }

    render(){
        return(
            <View style={styles.container}>
            <View style={styles.textView}>
                <Text style={styles.label}> address </Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        editable={true}
                        placeholder="address"
                        placeholderTextColor="#E5E5E5"
                        multiline={true}
                        onChange={(event) => {
                            this.setState({
                                address: event.nativeEvent.text
                            })
                        }}
                    />
                </View>
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button}
                    onPress={this.getBalance}
                >
                    <Text> balance </Text>
                </TouchableOpacity>
                <Text> {this.state.balance} </Text>
            </View>
        </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 20
    },
    textView: {
        borderBottomColor: '#40E0D0',
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 20 : 30,
        paddingBottom: 15,
    },
    label: {
        color: '#9d9d9d',
        paddingLeft: Platform.OS === 'ios' ? 0 : 4,
        paddingBottom: Platform.OS === 'ios' ? 10 : 0,
    },
    inputRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    input: {
        color: '#40E0D0',
        flex: 1,
        flexGrow: 1,
        fontSize: 18,
    },
    buttonView: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginTop: 5,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#40E0D0',
        borderRadius: 8,
        paddingVertical: 20,
    },
    text: {
        fontSize: 15,
        color: '#E5E5E5',
        fontWeight: 'bold',
    }
}); 

// const mapStatToProps = state => ({
    
// });