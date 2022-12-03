type ValidatorReturn = Error | undefined

export interface Validator {
  validate: () => ValidatorReturn | Promise<ValidatorReturn>;
}
