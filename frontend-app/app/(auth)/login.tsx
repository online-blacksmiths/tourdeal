import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { FormInput } from "@/widgets/FormInput/ui";

export default function Login() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <View className="flex-1 gap-2 bg-white px-8 pt-32">
      <View className="w-full flex-1 gap-8">
        <Text className="text-3xl font-bold color-primary-500">로그인</Text>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <FormInput
              label="아이디"
              size="sm"
              isInvalid={!!fieldState.error}
              error={fieldState.error?.message}
              slotProps={{
                input: {
                  value: field.value,
                  onChangeText: field.onChange,
                  placeholder: "아이디 또는 이메일을 입력해 주세요",
                  keyboardType: "email-address",
                },
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <FormInput
              label="비밀번호"
              size="sm"
              isInvalid={!!fieldState.error}
              error={fieldState.error?.message}
              helperText="8~20자 영문, 숫자, 특수문자를 조합해 주세요"
              slotProps={{
                input: {
                  value: field.value,
                  onChangeText: field.onChange,
                  placeholder: "비밀번호를 입력해 주세요",
                  keyboardType: "default",
                  secureTextEntry: true,
                },
              }}
            />
          )}
        />
        <Button>
          <ButtonText>로그인</ButtonText>
        </Button>
        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-xs font-thin color-typography-500">
            아직 회원이 아니신가요?
          </Text>
          <Link
            href={ROUTES.SIGNUP}
            className="text-xs font-thin color-primary-500"
          >
            회원가입
          </Link>
        </View>
      </View>
    </View>
  );
}
