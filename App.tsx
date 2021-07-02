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
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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
import CardView from '@hyeonwoo/react-native-cardview';

type TMark = {
  url: string;
  title: string;
};
type TStatus = {canBack: boolean; currentUrl: string; ref: any};

const homeUrl = 'https://velog.io/';
let refWebview: TStatus = {
  canBack: false,
  currentUrl: homeUrl,
  ref: null,
};

const App = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleInput, setVisibleInput] = useState(false);
  const [marks, setMarks] = useState<TMark[]>([]);
  const [newMarkName, setNewMarkName] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const [curUrl, setCurUrl] = useState(homeUrl);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const webviewGoBack = () => {
    if (refWebview.canBack && refWebview.ref) return true;
    return false;
  };

  useEffect(() => {
    AsyncStorage.getItem('marks').then(marks => {
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
  const addMark = () => {
    console.log(`name: `, newMarkName);
    console.log(`url: `, refWebview.currentUrl);

    if (!newMarkName.length) {
      return;
    }

    // 1. AsyncStorage에 추가
    // 2. setMarks

    const newMark = {
      url: refWebview.currentUrl,
      title: newMarkName,
    };
    let copied = marks.slice();
    copied.unshift(newMark);

    AsyncStorage.setItem('marks', JSON.stringify(copied));
    setMarks(copied);

    setVisibleInput(false);
  };
  const cancel = () => {
    setNewMarkName('');
    setVisibleInput(false);
  };

  return (
    <SafeAreaView style={{...backgroundStyle, flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{width: '100%', height: 30, ...backgroundStyle}}>
        <Text
          style={{
            marginLeft: 15,
            color: isDarkMode ? '#ffffff88' : '#00000088',
          }}>
          Made by @hyeonwoo
        </Text>
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
          source={{uri: curUrl}}
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
              // paddingVertical: 30,
              paddingBottom: 30,
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
                style={{width: 30, height: 30}}
                onPress={() => {
                  if (refWebview.currentUrl === homeUrl) return;
                  setCurUrl(homeUrl);
                  setVisibleModal(false);
                }}>
                <Image
                  source={require('./logo_velog.png')}
                  style={{width: '100%', height: '100%'}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (refWebview.currentUrl === homeUrl) return;
                  console.log(`@@ `, canAddMark());
                  if (canAddMark()) setVisibleInput(true);
                }}
                style={{
                  // paddingVertical: 5,
                  height: 30,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 7,
                  backgroundColor: '#6078ea',
                }}>
                <Text
                  style={{
                    color: '#fbfbfb',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  현재 페이지를 북마크에 추가
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginHorizontal: 10,
                marginTop: 20,
              }}>
              <Text style={{fontSize: 16, color: '#444', fontWeight: 'bold'}}>
                북마크 목록
              </Text>
            </View>

            <FlatList
              data={marks}
              renderItem={item => {
                return (
                  <CardView cardElevation={2}>
                    <TouchableOpacity
                      style={styles.mark}
                      onPress={() => {
                        setCurUrl(item.item.url);
                        setVisibleModal(false);
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          width: '100%',
                          paddingHorizontal: 20,
                          color: '#000',
                          fontSize: 16,
                        }}>
                        {item.item.title}
                      </Text>
                    </TouchableOpacity>
                  </CardView>
                );
              }}
              keyExtractor={item => item.url}
            />
          </View>
        </View>

        <Modal transparent visible={visibleInput}>
          {/* 제목 입력하는 모달 */}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'red',
            }}>
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#000000aa',
              }}
              onTouchEnd={() => {
                setVisibleInput(false);
              }}
            />
            <View
              style={{
                width: '80%',
                backgroundColor: '#fff',
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginTop: 35,
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: '#444',
                }}>
                북마크 이름을 입력해 주세요
              </Text>
              <TextInput
                autoFocus
                style={{
                  width: '90%',
                  borderBottomWidth: 1,
                  borderBottomColor: newMarkName.length ? '#6078ea' : '#aeaeae',
                  marginVertical: 30,
                  fontSize: 15,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  color: '#000',
                }}
                placeholder="새로운 북마크 이름"
                onChangeText={t => {
                  setNewMarkName(t);
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  borderTopWidth: 0.5,
                  borderTopColor: '#aeaeae',
                }}>
                <TouchableOpacity
                  style={{
                    ...styles.btnInModal,
                    borderRightWidth: 0.5,
                    borderRightColor: '#aeaeae',
                  }}
                  onPress={addMark}>
                  <Text style={{...styles.btnTextInModal, color: '#6078ea'}}>
                    추가
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnInModal} onPress={cancel}>
                  <Text style={{...styles.btnTextInModal, color: '#4a4a4a'}}>
                    취소
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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

  btnInModal: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextInModal: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  mark: {
    marginVertical: 15,
    marginHorizontal: 10,
    // width: '90%',
    // alignSelf: 'center',

    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 7,
    backgroundColor: '#f3f3f3',
  },
});

export default App;
