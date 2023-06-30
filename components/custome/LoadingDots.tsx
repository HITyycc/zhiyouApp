import LottieView from "lottie-react-native";
import React, { useRef, useEffect } from "react";

type IconProps = {
  size: number;
  allowFontScaling?: boolean;
};

export const LoadingDots = (props: IconProps & { color: string }) => {
  return (
    <LottieView
      autoPlay
      source={require("../../assets/lottiefiles/9978-circle-load.json")}
      style={{
        width: props.size,
        height: props.size,
        backgroundColor: "transparent",
      }}
    />
  );
};
