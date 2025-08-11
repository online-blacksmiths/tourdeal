import { Text, View } from "react-native";

interface Props {
  title: string;
  required?: boolean;
}

export function FormLabel({ title, required }: Props) {
  return (
    <View className="flex-row gap-1">
      <Text className="text-sm font-semibold color-primary-500">{title}</Text>
      {required && (
        <Text className="text-sm font-semibold text-error-500">*</Text>
      )}
    </View>
  );
}
