/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import WebView from 'react-native-webview';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-community/async-storage';
import CardView from '@hyeonwoo/react-native-cardview';
import ModalCreate from './components/ModalCreate';
import ModalMore from './components/ModalMore';
import toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';
import {icoLogo} from './images';

type TMark = {
  url: string;
  title: string;
};
type TStatus = {canBack: boolean; currentUrl: string; ref: any};

const screenWidth = Dimensions.get('screen').width;

const homeUrl = 'https://velog.io/';
let refWebview: TStatus = {
  canBack: false,
  currentUrl: homeUrl,
  ref: null,
};

const App = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [modifing, setModifing] = useState(false);
  const [visibleInput, setVisibleInput] = useState(false);
  const [markMore, setMarkMore] = useState<TMark | null>(null);
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

  const swipeLeft = (e: any) => {
    if (visibleModal) return;

    const startRateX = e.x0 / screenWidth;
    if (startRateX < 0.85) return;

    setVisibleModal(true);
  };
  const swipeRight = () => {
    if (refWebview.canBack && refWebview.ref) refWebview.ref.goBack();
  };
  const canAddMark = () => {
    const url = refWebview.currentUrl;
    const existedIdx = marks.findIndex(m => m.url === url);
    return existedIdx === -1;
  };
  const addMark = (name: string) => {
    console.log(`url: `, refWebview.currentUrl);

    if (!name.length) {
      return;
    }

    // 1. AsyncStorage에 추가
    // 2. setMarks

    const newMark = {
      url: refWebview.currentUrl,
      title: name,
    };
    let copied = marks.slice();
    copied.unshift(newMark);

    AsyncStorage.setItem('marks', JSON.stringify(copied)).then(() => {
      setMarks(copied);
      setVisibleInput(false);
      toast.show('추가 되었습니다', 0.7);
    });
  };
  const deleteMark = () => {
    if (!markMore) return;

    const filtered = marks.filter(m => m.url !== markMore.url);
    AsyncStorage.setItem('marks', JSON.stringify(filtered)).then(() => {
      setMarks(filtered);
      setMarkMore(null);
      toast.show('삭제 되었습니다', 0.7);
    });
  };
  const modifyMark = (name: string) => {
    if (!markMore) return;
    const modifingIdx = marks.findIndex(m => m.url === markMore.url);
    let copied = marks.slice();

    copied[modifingIdx].title = name;

    AsyncStorage.setItem('marks', JSON.stringify(copied)).then(() => {
      setMarks(copied);
      setModifing(false);
      setMarkMore(null);
    });
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
            toast.show(
              '죄송합니다. 앱 실행 중 에러가 발생했습니다. 앱을 재시작 하셔도 증상이 여전할 시 리뷰 남겨주시면 감사 드립니다',
              3,
            );
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
            style={{
              width: '80%',
              height: '80%',
              backgroundColor: '#fff',
              borderRadius: 10,
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
                  source={icoLogo.src}
                  style={{width: '100%', height: '100%'}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (refWebview.currentUrl === homeUrl) return;
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
                      onLongPress={() => {
                        setMarkMore(item.item);
                      }}
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

        {/* Modal More */}
        <ModalMore
          visible={markMore !== null && !modifing}
          hide={() => {
            setMarkMore(null);
          }}
          onPressModify={() => {
            setModifing(true);
          }}
          onPressDelete={deleteMark}
          onPressCopy={() => {
            toast.show('Copied', 0.7);
            Clipboard.setString(markMore?.url || '');
            setMarkMore(null);
          }}
        />

        {/* 새 북마크 생성하는 모달 */}
        <ModalCreate
          visible={visibleInput}
          onPressAdd={addMark}
          setVisible={setVisibleInput}
        />

        <ModalCreate
          visible={modifing}
          setVisible={() => {
            setModifing(false);
          }}
          onCancel={() => {
            setMarkMore(null);
          }}
          onPressModify={modifyMark}
        />
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

  // btnInModal: {
  //   flex: 1,
  //   height: 50,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // btnTextInModal: {
  //   fontWeight: 'bold',
  //   fontSize: 15,
  // },
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
  btnMore: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtMore: {fontSize: 16, color: '#333', marginLeft: 5},
});

export default App;
