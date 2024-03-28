import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { InputProps } from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}
const TextField: React.FC<TextFieldProps> = ({ label, name, ...props }) => {
  const [field, meta] = useField({...props, name});
  return (
    <FormControl isInvalid={!!(meta.touched && meta.error)}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input {...field} {...(props as InputProps)} id={name} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default TextField;
