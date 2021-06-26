/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {createRef, useEffect, useRef} from 'react';
import {
  BackHandler,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import WebView from 'react-native-webview';
import GestureRecognizer from 'react-native-swipe-gestures';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const webviewGoBack = () => {
    if (refWebview.canMove.back && refWebview.ref) return true;
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', webviewGoBack);

    return () => {
      Platform.OS === 'android' &&
        BackHandler.removeEventListener('hardwareBackPress', webviewGoBack);
    };
  }, []);

  const swipeLeft = () => {
    console.log('Swipe: left');
    if (refWebview.canMove.forward && refWebview.ref)
      refWebview.ref.goForward();
  };
  const swipeRight = () => {
    console.log('Swipe: right');
    if (refWebview.canMove.back && refWebview.ref) refWebview.ref.goBack();
  };

  let refWebview: {canMove: {back: boolean; forward: boolean}; ref: any} = {
    canMove: {
      back: false,
      forward: false,
    },
    ref: null,
  };
  return (
    <SafeAreaView style={{...backgroundStyle, flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{width: '100%', height: 30, ...backgroundStyle}}>
        <TouchableOpacity style={{padding: 5, backgroundColor: 'red'}}>
          <Text>APP</Text>
        </TouchableOpacity>
      </View>
      <GestureRecognizer
        onSwipeLeft={swipeLeft}
        onSwipeRight={swipeRight}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
        style={{flex: 1}}>
        <WebView
          ref={ref => {
            refWebview.ref = ref;
          }}
          source={{uri: 'https://velog.io'}}
          style={{
            height: '100%',
            width: '100%',
          }}
          onError={e => {
            console.log('Error : ', e);
          }}
          onLoad={() => {
            console.log('Loaded');
          }}
          onNavigationStateChange={state => {
            console.log(Object.keys(state), state.url);
            refWebview.canMove.back = state.canGoBack;
            refWebview.canMove.forward = state.canGoForward;
          }}
        />
      </GestureRecognizer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
