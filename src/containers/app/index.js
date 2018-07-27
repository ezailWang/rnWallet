import HomeScreen from './Home'
import { StackNavigator } from 'react-navigation'

export default mainContainer = StackNavigator({
    Home: { screen: HomeScreen },
},
    {
        navigationOptions: {
            headerTitleStyle: { fontSize: 18, color: 'skyblue' },
        },
        gesturesEnabled: true,
        initialRouteName: 'Home',
        headerMode: 'none'
    }
);