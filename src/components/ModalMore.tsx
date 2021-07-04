import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import {icoPencil, icoTrashcan, icoClip} from '../images';

interface Props {
  visible: boolean;
  hide: () => void;
  onPressModify: () => void;
  onPressDelete: () => void;
  onPressCopy: () => void;
}
const icoSize = 30;

const ModalMore = ({
  visible,
  hide,
  onPressModify,
  onPressDelete,
  onPressCopy,
}: Props) => {
  return (
    <Modal transparent visible={visible}>
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
            hide();
          }}
        />
        <View
          style={{
            width: '80%',
            backgroundColor: '#fff',
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity style={s.btnMore} onPress={onPressModify}>
            <Image
              source={icoPencil.src}
              style={{width: icoSize, height: icoSize}}
            />
            <Text style={s.txtMore}>이름 수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnMore} onPress={onPressDelete}>
            <View
              style={{
                width: icoSize,
                height: icoSize,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icoTrashcan.src}
                style={{width: icoSize * 0.75, height: icoSize * 0.75}}
              />
            </View>
            <Text style={s.txtMore}>북마크 삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...s.btnMore, borderBottomWidth: 0}}
            onPress={onPressCopy}>
            <Image
              source={icoClip.src}
              style={{width: icoSize, height: icoSize}}
            />
            <Text style={s.txtMore}>북마크 URL 복사</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  btnMore: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eaeaea',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtMore: {fontSize: 16, color: '#333', marginLeft: 5},
});

export default ModalMore;
