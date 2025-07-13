import React, { useState } from "react";
import { View, TextInput, Animated, StyleSheet, Text } from "react-native";

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useState(new Animated.Value(value ? 1 : 0))[0];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelPosition, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyleAnimated = {
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
  };

  const labelStyleStatic = {
    position: "absolute",
    left: 12,
    color: isFocused ? "#10b981" : "#aaa",
    backgroundColor: "#fff",
    paddingHorizontal: 4,
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <Animated.Text style={[labelStyleStatic, labelStyleAnimated]}>
          {label}
        </Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 6,
    backgroundColor: "#fff",
  },
  input: {
    fontSize: 16,
    paddingVertical: 4,
    color: "#111",
  },
  inputFocused: {
    borderColor: "#10b981",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});
