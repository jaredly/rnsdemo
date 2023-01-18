import {
  createNativeStackNavigator,
  RetainContext,
} from '@react-navigation/native-stack';
import {Node, useContext, useEffect} from 'react';
import React, {useRef, useState} from 'react';
import {Button, Text, View} from 'react-native';
import Video from 'react-native-video';

import {NavigationContainer, useNavigation} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const Home = () => {
  const nav = useNavigation();

  return (
    <View style={{alignItems: 'center', padding: 48}}>
      <Text>A Home Screen</Text>
      <Button
        onPress={() => {
          nav.push('Video');
        }}
        title="Go to the video screen"
      />
    </View>
  );
};

const OtherScreen = () => {
  return (
    <View style={{alignItems: 'center', padding: 48}}>
      <Text>This is another screen</Text>
    </View>
  );
};

const VideoScreen = () => {
  const ref = useRef(null);
  const nav = useNavigation();
  if (!RetainContext) {
    throw new Error('not there?');
  }
  const {retain, release, restore} = useContext(RetainContext);
  const [pip, setPip] = useState(false);
  const key = React.useRef(null);
  useEffect(() => {
    if (pip) {
      key.current = retain();
    } else if (key.current) {
      release(key.current);
    }
  }, [pip]);
  return (
    <View style={{alignItems: 'center', padding: 48}}>
      <Video
        ref={ref}
        muted
        source={require('./sample-5s.mp4')}
        style={{width: 300, height: 200}}
        pictureInPicture={pip}
        // controls
        onPictureInPictureStatusChanged={({isActive}) => setPip(isActive)}
        onRestoreUserInterfaceForPictureInPictureStop={() => {
          if (key.current) {
            restore(key.current);
          }
          setTimeout(() => {
            ref.current.restoreUserInterfaceForPictureInPictureStopCompleted(
              true,
            );
          }, 100);
        }}
      />
      <Button
        onPress={() => {
          setPip(!pip);
        }}
        title="Picture in Picture it up"
      />
      <Button onPress={() => nav.push('Other')} title="Go to another screen" />
      <Button
        onPress={() => nav.push('Video')}
        title="Go to another video screen"
      />
    </View>
  );
};

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Video" component={VideoScreen} />
        <Stack.Screen name="Other" component={OtherScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
