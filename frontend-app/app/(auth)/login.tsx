import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Input, InputField } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";

export default function Login() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <View className="flex-1 items-center justify-center gap-2">
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <View className="w-full px-4">
            <Input>
              <InputField {...field} placeholder="test" />
            </Input>
          </View>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <View className="w-full px-4">
            <Input>
              <InputField {...field} type="password" />
            </Input>
          </View>
        )}
      />
      <Text>Login</Text>
      <Link href={ROUTES.HOME}>Home</Link>
      <Link href={ROUTES.SIGNUP}>Signup</Link>
    </View>
  );
}
