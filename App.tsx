/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  FlatList,
  Modal,
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
import AsyncStorage from '@react-native-community/async-storage';

type TMark = {
  url: string;
  title: string;
};
type TStatus = {canBack: boolean; currentUrl: string; ref: any};

let refWebview: TStatus = {
  canBack: false,
  currentUrl: '',
  ref: null,
};

const App = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleInput, setVisibleInput] = useState(false);
  const [marks, setMarks] = useState<TMark[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const webviewGoBack = () => {
    if (refWebview.canBack && refWebview.ref) return true;
    return false;
  };

  useEffect(() => {
    AsyncStorage.getItem('bookmarks').then(marks => {
      if (marks) setMarks(JSON.parse(marks));
    });

    BackHandler.addEventListener('hardwareBackPress', webviewGoBack);

    return () => {
      Platform.OS === 'android' &&
        BackHandler.removeEventListener('hardwareBackPress', webviewGoBack);
    };
  }, []);

  const swipeLeft = () => {
    setVisibleModal(true);
  };
  const swipeRight = () => {
    console.log('Swipe: right');
    if (refWebview.canBack && refWebview.ref) refWebview.ref.goBack();
  };
  const canAddMark = () => {
    const url = refWebview.currentUrl;
    const existedIdx = marks.findIndex(m => m.url === url);
    return existedIdx === -1;
  };
  const addMark = () => {};

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
            // # ios only
            console.log(Object.keys(state), state.url);
            refWebview.canBack = state.canGoBack;
            refWebview.currentUrl = state.url;
          }}
          onLoadProgress={({nativeEvent: e}) => {
            if (Platform.OS === 'android') {
              refWebview.canBack = e.canGoBack;
              refWebview.currentUrl = e.url;
            }
          }}
        />
      </GestureRecognizer>

      <Modal
        visible={visibleModal}
        transparent
        style={{backgroundColor: '#00000055'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {/* Modal Background */}
          <View
            onTouchEnd={() => {
              setVisibleModal(false);
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#00000055',
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>

          {/* Modal */}
          <View
            onTouchEnd={() => {
              console.log(`@@`);
            }}
            style={{
              width: '80%',
              height: '80%',
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            {/* Modal Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 15,
                paddingHorizontal: 10,
              }}>
              <TouchableOpacity
                style={{width: 30, height: 30, backgroundColor: 'green'}}>
                <Text>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (canAddMark()) setVisibleInput(true);
                }}
                style={{
                  padding: 5,
                  backgroundColor: 'blue',
                  width: 50,
                }}>
                <Text>추가</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              contentContainerStyle={{borderWidth: 2, borderColor: 'blue'}}
              data={marks}
              renderItem={item => {
                return <View></View>;
              }}
              keyExtractor={item => item.url}
            />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={visibleInput}>
        {/* 제목 입력하는 모달 */}
        <View></View>
      </Modal>
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
