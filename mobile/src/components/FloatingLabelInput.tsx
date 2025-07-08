import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  TextInputProps,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  ...rest
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: 10,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["#999", "#10b981"],
    }),
    backgroundColor: "#fff",
    paddingHorizontal: 4,
  };

  return (
    <View style={[styles.container, isFocused && styles.focused]}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
    paddingTop: 12,
    backgroundColor: "#fff",
  },
  focused: {
    borderColor: "#10b981",
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 4,
  },
});
