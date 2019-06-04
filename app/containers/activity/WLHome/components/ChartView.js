// /* eslint-disable no-use-before-define */
// import React from 'react';
// import { View } from 'react-native';
// import ChartLabel from './ChartLabel';
// import Chart from './Chart';

// export default ({ normalNode, activateNode, authNode, superNode }) => {
//   return (
//     <View style={styles.chartContainer}>
//       <ChartLabel
//         label="普通节点"
//         color={normalNode.color}
//         number={normalNode.value}
//         style={{ position: 'absolute', top: 0, left: 0 }}
//       />
//       <ChartLabel
//         label="激活节点"
//         color={activateNode.color}
//         number={activateNode.value}
//         style={{ position: 'absolute', top: 0, right: 0 }}
//       />
//       <ChartLabel
//         label="权益节点"
//         color={authNode.color}
//         number={authNode.value}
//         style={{ position: 'absolute', bottom: 0, right: 0 }}
//       />
//       <ChartLabel
//         label="超级节点"
//         color={superNode.color}
//         number={superNode.value}
//         style={{ position: 'absolute', bottom: 0, left: 0 }}
//       />

//       <Chart chart_wh={chartWidth} series={series} sliceColor={sliceColor} doughnut />
//     </View>
//   );
// };

// const styles = {};
