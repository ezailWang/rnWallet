import React, { Component } from 'react'
import {
    Platform,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

import keythereum from 'keythereum'
import HDWallet from 'react-native-hdwallet'
import walletUtils from 'react-native-hdwallet/src/utils/walletUtils'
import keystoreUtils from '../../utils/keystoreUtils'
import StorageManage from '../../utils/StorageManage'

export default class keystoreTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: ""
        }
    }

    createPrivateKey = async () => {
        const data = await walletUtils.generateMnemonic()
        const seed = walletUtils.mnemonicToSeed(data)
        const seedHex = seed.toString('hex')
        var hdwallet = HDWallet.fromMasterSeed(seed)
        const derivePath = "m/44'/60'/0'/0/0"
        hdwallet.setDerivePath(derivePath)
        const privateKey = hdwallet.getPrivateKey()
        const checksumAddress = hdwallet.getChecksumAddressString()
        console.log('prikey:', hdwallet.getPrivateKeyString())
        console.log('address:', checksumAddress)
        var object = {
            name: 'wsd',
            address: checksumAddress,
            extra: ''
        }
        var key = 'uesr'
        StorageManage.save(key, object)
        var loadRet = await StorageManage.load(key)
        console.log('load ret:', loadRet)
        StorageManage.remove(key)
        
        var password = this.state.password || 'testpassword'
        console.log('password:', password)
        var params = { keyBytes: 32, ivBytes: 16 }
        var dk = keythereum.create(params);
        var keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv)
        console.log('keyObject:', keyObject)
        await keystoreUtils.exportToFile(keyObject, "keystore")
        var str = await keystoreUtils.importFromFile(keyObject.address)
        var newKeyObject = JSON.parse(str)
        console.log('newKeyObject', newKeyObject)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.textView}>
                    <Text style={styles.label}> password </Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            autoCorrect={false}
                            editable={true}
                            placeholder="password"
                            placeholderTextColor="#E5E5E5"
                            multiline={true}
                            onChange={(event) => {
                                this.setState({
                                    password: event.nativeEvent.text
                                })
                            }}
                        />
                    </View>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button}
                        onPress={this.createPrivateKey}
                    >
                        <Text> test </Text>
                    </TouchableOpacity>
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