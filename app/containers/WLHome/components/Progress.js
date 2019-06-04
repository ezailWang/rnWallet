/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#bbbbbb',
    height: 5,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: '#3b5998',
    height: 5,
  },
});

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: new Animated.Value(this.props.initialProgress || 0),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.progress >= 0 && this.props.progress !== prevProps.progress) {
      this.update();
    }
  }

  render() {
    const style = this.props.style || styles;
    const fillWidth = this.state.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0 * style.width, 1 * style.width],
    });

    return (
      <View style={[styles.background, this.props.backgroundStyle, style]}>
        <Animated.View style={[styles.fill, this.props.fillStyle, { width: fillWidth }]} />
      </View>
    );
  }

  update() {
    Animated.timing(this.state.progress, {
      easing: this.props.easing || Easing.inOut(Easing.ease),
      duration: this.props.easingDuration || 500,
      toValue: this.props.progress,
    }).start();
  }
}
// var ProgressBar = React.createClass({

//   getDefaultProps() {
//     return {
//       style: styles,
//       easing: Easing.inOut(Easing.ease),
//       easingDuration: 500
//     };
//   },

//   getInitialState() {
//     return {
//       progress: new Animated.Value(this.props.initialProgress || 0)
//     };
//   },

//   componentDidUpdate(prevProps, prevState) {
//     if (this.props.progress >= 0 && this.props.progress != prevProps.progress) {
//       this.update();
//     }
//   },

//   render() {

//     var fillWidth = this.state.progress.interpolate({
//       inputRange: [0, 1],
//       outputRange: [0 * this.props.style.width, 1 * this.props.style.width],
//     });

//     return (
//       <View style={[styles.background, this.props.backgroundStyle, this.props.style]}>
//         <Animated.View style={[styles.fill, this.props.fillStyle, { width: fillWidth }]} />
//       </View>
//     );
//   },

//   update() {
//     Animated.timing(this.state.progress, {
//       easing: this.props.easing,
//       duration: this.props.easingDuration,
//       toValue: this.props.progress
//     }).start();
//   }
// });

// module.exports = ProgressBar;
