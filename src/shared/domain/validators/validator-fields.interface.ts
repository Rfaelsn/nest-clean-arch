export type FieldsError = {
  [field: string]: string[]; //em, ts o [] em uma interface significa q pode ter n atributos nesse tipo do tipo string ecada atributo desse vai ter um array de string
};

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsError;
  validatedData: PropsValidated;
  validate(data: any): boolean;
}
