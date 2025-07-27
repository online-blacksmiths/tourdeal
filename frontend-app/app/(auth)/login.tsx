import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { ROUTES } from "@/constants/routes";
import { Input, InputField } from "@/components/ui/input";

export default function Login() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <View className="flex-1 items-center justify-center">
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <View>
            <Input>
              <InputField {...field} />
            </Input>
          </View>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <View>
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
