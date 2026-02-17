export function validateForm(schema: any, data: any) {
  const errors: Record<string, string> = {};

  schema.fields.forEach((field: any) => {
    const value = data[field.name];

    // required validation
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`;
      return;
    }

    if (!value) return;

    // minlength validation
    if (field.validation?.minLength) {
      if (value.length < field.validation.minLength) {
        errors[field.name] = field.validation.message;
      }
    }

    // regex validation
    if (field.validation?.pattern) {
      if (!field.validation.pattern.test(value)) {
        errors[field.name] = field.validation.message;
      }
    }
  });

  return errors;
}
