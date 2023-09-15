import * as React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  FlatFeed,
  Activity,
  StatusUpdateForm,
  LikeButton,
  ReactionIcon,
} from 'expo-activity-feed';

import PostIcon from '../images/icons/post.png';
import ReplyIcon from '../images/icons/reply.png';

export const navigationOptions = ({ navigation }) => ({
  title: 'FEED',
  headerRight: () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('NewPost')}
      style={{ paddingRight: 15 }}
    >
      <Image source={PostIcon} style={{ width: 23, height: 23 }} />
    </TouchableOpacity>
  ),
  headerTitleStyle: {
    fontWeight: '500',
    fontSize: 13,
  },
});

export default function FeedScreen() {
  const navigation = useNavigation();

  const onPressActivity = (activity, feedGroup, userId) => {
    navigation.navigate('SinglePost', {
      activity,
    });
  };
  const renderActivity = (props) => (
    <Activity
      {...props}
      onPress={() =>
        onPressActivity(props.activity, props.feedGroup, props.userId)
      }
      Footer={
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LikeButton {...props} />

          <ReactionIcon
            icon='comment'
            labelSingle='comment'
            labelPlural='comments'
            counts={props.activity.reaction_counts}
            kind='comment'
          />
        </View>
      }
    />
  );

  return (
    <>
      <FlatFeed
        options={{
          limit: 10,
        }}
        notify
        Activity={renderActivity}
      />
      {/* <StatusUpdateForm feedGroup='timeline' /> */}
    </>
  );
}
