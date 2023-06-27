import {Dimensions, PixelRatio, StatusBar, Platform, NativeModules} from 'react-native';


const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;

console.log('deviceWidthDp', Dimensions.get('window'));

const uiWidthPx = 246; 
const uiHeightPx = 496;

// 如果应用是横屏的用pTd
export const pTd = (uiElePx:number) => {
    return (uiElePx * deviceHeightDp) / uiHeightPx;
  };
  
// 如果应用是竖屏的用pTx
export const pTx = (uiElePx: number) => {
return (uiElePx * deviceWidthDp) / uiWidthPx;
};

const fontScale = PixelRatio.getFontScale()
export const scalefontSize = (size: number) => {
    return size*14*fontScale
}

export const fillStyle = {
  flex: 1
}
