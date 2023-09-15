import * as React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackButton, UserCard, Avatar } from 'expo-activity-feed';
import SearchBox from '../components/SearchBox';
import LargeHeading from '../components/LargeHeading';
import HorizontalScrollFeed from '../components/HorizontalScrollFeed';
import GroupCard from '../components/GroupCard';

export const navigationOptions = ({ navigation }) => ({
  title: 'DISCOVER',
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

export default function SearchScreen() {
  const navigation = useNavigation();

  const interestingUsers = [
    {
      id: 1235,
      user_image: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      id: 2345,
      user_image: 'https://randomuser.me/api/portraits/men/24.jpg',
    },
    {
      id: 3456,
      user_image: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
    {
      id: 4567,
      user_image: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    {
      id: 6789,
      user_image: 'https://randomuser.me/api/portraits/women/23.jpg',
    },
    {
      id: 7890,
      user_image: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    {
      id: 2456,
      user_image: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
  ];

  const trendingGroups = [
    {
      id: 1234,
      name: 'Beer',
      image: 'https://cdn.britannica.com/700x450/72/186972-049-26ACDCBE.jpg',
      icon: '',
    },
    {
      id: 2345,
      name: 'Arcade',
      image: 'http://www.thebasementarcade.com/gameroom/0516/1.jpg',
      icon: '',
    },
    {
      id: 3456,
      name: 'Nature',
      image:
        'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&h=350',
      icon: '',
    },
    { id: 4567, image: '', icon: '' },
    { id: 6789, image: '', icon: '' },
    { id: 7890, image: '', icon: '' },
    { id: 8909, image: '', icon: '' },
  ];

  const users = [
    {
      id: 1235,
      name: 'Danny',
      user_image: 'https://randomuser.me/api/portraits/women/65.jpg',
      followed: false,
    },
    {
      id: 2345,
      name: 'James',
      user_image: 'https://randomuser.me/api/portraits/men/24.jpg',
      followed: true,
    },
    {
      id: 3456,
      name: 'Jennifer',
      user_image: 'https://randomuser.me/api/portraits/women/45.jpg',
      followed: false,
    },
    {
      id: 4567,
      name: 'hello world',
      user_image: 'https://randomuser.me/api/portraits/men/45.jpg',
      followed: false,
    },
    {
      id: 6789,
      name: 'hello world',
      user_image: 'https://randomuser.me/api/portraits/women/23.jpg',
      followed: false,
    },
    {
      id: 7890,
      name: 'hello world',
      user_image: 'https://randomuser.me/api/portraits/men/67.jpg',
      followed: false,
    },
    {
      id: 2456,
      name: 'hello world',
      user_image: 'https://randomuser.me/api/portraits/women/12.jpg',
      followed: false,
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SearchBox />
      <LargeHeading>Trending Groups</LargeHeading>
      <HorizontalScrollFeed
        data={trendingGroups}
        renderItem={({ item }) => (
          <View style={{ marginRight: 6 }}>
            <GroupCard item={item} />
          </View>
        )}
        keyExtractor={(item) => `item-${item.id}`}
      />

      <LargeHeading>Interesting Users</LargeHeading>
      <HorizontalScrollFeed
        data={interestingUsers}
        renderItem={({ item }) => (
          <View style={{ marginRight: 6 }}>
            <Avatar size={60} noShadow source={item.user_image} />
          </View>
        )}
        keyExtractor={(item) => `item-${item.id}`}
      />

      <LargeHeading>People you may know</LargeHeading>
      <FlatList
        style={{ marginTop: 15 }}
        data={users}
        renderItem={({ item }) => (
          <View style={{ marginLeft: 15, marginRight: 15, marginBottom: 15 }}>
            <UserCard
              username={'UserName'}
              subtitle={'@subtitle'}
              user={item}
              follow
            />
          </View>
        )}
        keyExtractor={(item) => `item-${item.id}`}
      />
    </ScrollView>
  );
}
