import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  FlatFeed,
  BackButton,
  StatusUpdateForm,
  LikeButton,
  ReactionIcon,
} from 'expo-activity-feed';

export const navigationOptions = ({ navigation }) => ({
  title: 'NEW POST',
  headerLeft: () => (
    <View style={{ paddingLeft: 15 }}>
      <BackButton pressed={() => navigation.goBack()} blue />
    </View>
  ),
  headerTitleStyle: {
    fontWeight: '500',
    fontSize: 13,
  },
});

// export const navigationOptions = ({ navigation }) => ({
//   title: 'NEW POST',
//   headerLeft: (
//     <TouchableOpacity
//       style={{ paddingLeft: 15 }}
//       onPress={() => navigation.goBack()}
//     >
//       {/* <Image
//         style={{ width: 24, height: 24 }}
//         source={require('../images/icons/close.png')}
//       /> */}
//     </TouchableOpacity>
//   ),
// headerRight: (
//   <TouchableOpacity
//     style={{ paddingRight: 15 }}
//     //onPress={navigation.getParam('submitFunc')}
//   >
//     <Text style={{ color: '#007AFF', fontSize: 17 }}>Send</Text>
//   </TouchableOpacity>
// ),
// headerTitleStyle: {
//   fontWeight: '500',
//   fontSize: 13,
// },
// });

export default function StatusUpdateScreen() {
  const navigation = useNavigation();

  return (
    <StatusUpdateForm
      feedGroup='timeline'
      fullscreen
      onSuccess={() => {
        navigation.goBack();
      }}
    />

    // <StatusUpdateForm
    //   fullscreen
    //   {...this.props}
    //   onSuccess={() => {
    //     navigation.goBack();
    //   }}
    //   registerSubmit={(submitFunc) => {
    //     navigation.setParams({ submitFunc });
    //   }}
    // />
  );
}
