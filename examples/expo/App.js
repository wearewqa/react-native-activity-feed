import './ignoreWarnings';
import './ignoreErrors';
import React from 'react';
import 'intl-pluralrules';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-view';
import { StreamApp } from 'expo-activity-feed';
import FeedScreen, {
  navigationOptions as feedNavigationOptions,
} from './screens/FeedScreen';
import SinglePostScreen, {
  navigationOptions as singlePostNavigationOptions,
} from './screens/SinglePostScreen';
import StatusUpdateScreen, {
  navigationOptions as statusUpdateNavigationOptions,
} from './screens/StatusUpdateScreen';
import SearchScreen, {
  navigationOptions as searchNavigationOptions,
} from './screens/SearchScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function FeedStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Feed'
        component={FeedScreen}
        options={feedNavigationOptions}
      />
      <Stack.Screen
        name='SinglePost'
        component={SinglePostScreen}
        options={singlePostNavigationOptions}
      />
      <Stack.Screen
        component={StatusUpdateScreen}
        name='NewPost'
        options={statusUpdateNavigationOptions}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  const apiKey = '55g9w2733mbe';
  const appId = '1256301';
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoibWF0dCJ9.0odKA2T3abrI0V8tIZWMZxEztRNe3Fhx46LaN2gqj1k';

  if (!apiKey) {
    console.error('STREAM_API_KEY should be set');
    return null;
  }

  if (!appId) {
    console.error('STREAM_APP_ID should be set');
    return null;
  }

  if (!token) {
    console.error('STREAM_TOKEN should be set');
    return null;
  }

  return (
    <SafeAreaProvider>
      <StreamApp
        apiKey={apiKey}
        appId={appId}
        token={token}
        defaultUserData={{
          name: 'Batman',
          url: 'batsignal.com',
          desc: 'Smart, violent and brutally tough solutions to crime.',
          profileImage:
            'https://i.kinja-img.com/gawker-media/image/upload/s--PUQWGzrn--/c_scale,f_auto,fl_progressive,q_80,w_800/yktaqmkm7ninzswgkirs.jpg',
          coverImage:
            'https://i0.wp.com/photos.smugmug.com/Portfolio/Full/i-mwrhZK2/0/ea7f1268/X2/GothamCity-X2.jpg?resize=1280%2C743&ssl=1',
        }}
      >
        <NavigationContainer>
          <Tab.Navigator>
            <Stack.Screen
              name='Home'
              component={FeedStackScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              component={SearchScreen}
              name='Search'
              options={searchNavigationOptions}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </StreamApp>
    </SafeAreaProvider>
  );
};

export default App;
