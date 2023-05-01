import { UseFormSetError, FieldValues } from "react-hook-form";
import { FieldError } from "../../src/gql/graphql";

export const setErrors = <T extends FieldValues>(
  errors: FieldError[],
  setError: UseFormSetError<T>
) => {
  errors.map((err) =>
    setError(err!.field as any, { type: "custom", message: err?.message })
  );
};
