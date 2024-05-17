export class CreateEmailDto {
  to: string;
  template: string;
  subject: string;
  context: any;
}
