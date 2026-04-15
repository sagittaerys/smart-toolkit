import { Tabs } from "expo-router";
import { Colors } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, focused }: { name: IoniconsName; focused: boolean }) {
  return (
    <Ionicons
      name={name}
      size={24}
      color={focused ? Colors.brand : Colors.inkMuted}
    />
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets(); 

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,

        //  safe area padding + tab bar height -- missed this earlier
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.inkMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Converter",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="swap-horizontal" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="currency"
        options={{
          title: "Currency",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cash-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bmi"
        options={{
          title: "BMI",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="body-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="checkmark-circle-outline" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}