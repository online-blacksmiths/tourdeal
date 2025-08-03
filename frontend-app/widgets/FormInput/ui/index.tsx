import { ComponentProps } from "react";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

interface Props extends ComponentProps<typeof FormControl> {
  slotProps?: SlotProps;
  label?: string;
  helperText?: string;
  error?: string;
}

interface SlotProps {
  input: ComponentProps<typeof InputField>;
}

export function FormInput({
  label,
  helperText,
  error,
  slotProps,
  ...props
}: Props) {
  return (
    <FormControl className={`w-full ${props.className}`} {...props}>
      {label && (
        <FormControlLabel>
          <FormControlLabelText className="text-sm font-semibold color-primary-500">
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )}
      <Input>
        <InputField {...slotProps?.input} />
      </Input>
      {helperText && (
        <FormControlHelper>
          <FormControlHelperText className="text-xs color-typography-500">
            {helperText}
          </FormControlHelperText>
        </FormControlHelper>
      )}
      {error && (
        <FormControlError>
          <FormControlErrorIcon />
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
