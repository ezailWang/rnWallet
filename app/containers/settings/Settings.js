import { StackNavigator } from 'react-navigation';
import SetScreen from './SetScreen';
import ModifyPasswordScreen from './ModifyPasswordScreen';
import PasswordPrompInfoScreen from './PasswordPrompInfoScreen';



export default SetContainers = StackNavigator({
    Set: { screen: SetScreen },
    ModifyPassword:{screen:ModifyPasswordScreen},
    PasswordPrompInfo:{screen:PasswordPrompInfoScreen},
},
    {
        navigationOptions: {
            headerTitleStyle: { fontSize: 18, color: 'skyblue' },
        },
        gesturesEnabled: true,
        initialRouteName: 'Set',
        headerMode: 'screen'

    }
);