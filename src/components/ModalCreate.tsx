import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  visible: boolean;
  setVisible: (v: boolean) => void;
  onPressAdd?: (name: string) => void;
  onPressModify?: (name: string) => void;
  onCancel?: () => void;
}

const ModalCreate = ({
  visible,
  setVisible,
  onPressAdd,
  onPressModify,
  onCancel,
}: Props) => {
  const [name, setName] = useState('');

  const cancel = () => {
    setName('');
    setVisible(false);
    onCancel && onCancel();
  };

  return (
    <Modal transparent visible={visible}>
      {/* 제목 입력하는 모달 */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000aa',
          }}
          onTouchEnd={() => {
            setVisible(false);
            onCancel && onCancel();
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
              borderBottomColor: name.length ? '#6078ea' : '#aeaeae',
              marginVertical: 30,
              fontSize: 15,
              paddingVertical: 5,
              paddingHorizontal: 10,
              color: '#000',
            }}
            placeholder="새로운 북마크 이름"
            onChangeText={t => {
              setName(t);
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
                ...s.btnInModal,
                borderRightWidth: 0.5,
                borderRightColor: '#aeaeae',
              }}
              onPress={() => {
                onPressAdd && onPressAdd(name);
                onPressModify && onPressModify(name);
              }}>
              <Text style={{...s.btnTextInModal, color: '#6078ea'}}>
                {onPressModify ? '수정' : '추가'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnInModal} onPress={cancel}>
              <Text style={{...s.btnTextInModal, color: '#4a4a4a'}}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
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
});

export default ModalCreate;
