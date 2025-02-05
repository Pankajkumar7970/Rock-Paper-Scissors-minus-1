import { LinearGradient } from "expo-linear-gradient";

export default function BackgroundGradient({ children }) {
  return (
    <LinearGradient
      colors={["red", "blue"]}
      style={{ flex: 1 }}
      start={{ x: 0.3, y: 0.7 }}
      end={{ x: 0.65, y: 0.9 }}
    >
      {children}
    </LinearGradient>
  );
}
