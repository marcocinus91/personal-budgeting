import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/theme/ThemeContext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, size }: { name: IconName; color: string; size: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.textPrimary,
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <TabIcon name="grid-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Movimenti',
          tabBarIcon: ({ color, size }) => <TabIcon name="list-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Aggiungi',
          tabBarIcon: ({ color, size }) => <TabIcon name="add-circle-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Obiettivi',
          tabBarIcon: ({ color, size }) => <TabIcon name="flag-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Impostazioni',
          tabBarIcon: ({ color, size }) => <TabIcon name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
