import * as React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  StreamApp,
  SinglePost,
  CommentBox,
  BackButton,
  Activity,
  LikeButton,
  ReactionIcon,
  CommentList,
  CommentItem,
  LikeList,
} from 'expo-activity-feed';

export const navigationOptions = ({ navigation }) => ({
  title: 'POST DETAIL',
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

export default function SinglePostScreen({ route }) {
  const navigation = useNavigation();

  const apiKey = '55g9w2733mbe';
  const appId = '1256301';
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoibWF0dCJ9.0odKA2T3abrI0V8tIZWMZxEztRNe3Fhx46LaN2gqj1k';

  const activity = route.params.activity;
  const feedGroup = route.params.feedGroup;
  const userId = route.params.userId;

  console.log('activity', activity);
  return (
    <SafeAreaView style={styles.container}>
      <StreamApp apiKey={apiKey} appId={appId} userId='matt' token={token}>
        <SinglePost
          activity={activity}
          feedGroup={feedGroup}
          userId={userId}
          options={{ withOwnChildren: true }}
          navigation={navigation}
          Activity={(props) => (
            <React.Fragment>
              <Activity
                {...props}
                Footer={
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LikeButton reactionKind='heart' {...props} />

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
              <View style={styles.likesContainer}>
                <LikeList activityId={props.activity.id} reactionKind='heart' />
              </View>
              {/* <RepostList activityId={props.activity.id} /> */}
              <CommentList
                activityId={props.activity.id}
                infiniteScroll
                reverseOrder
                CommentItem={({ comment }) => (
                  <React.Fragment>
                    <CommentItem
                      comment={comment}
                      Footer={<LikeButton reaction={comment} {...props} />}
                    />
                  </React.Fragment>
                )}
              />

              <View style={styles.sectionHeader} />
            </React.Fragment>
          )}
          Footer={(props) => (
            <CommentBox
              activity={activity}
              onAddReaction={props.onAddReaction}
              styles={{ container: { height: 78 } }}
            />
          )}
        />
      </StreamApp>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
