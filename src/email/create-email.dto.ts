export class CreateEmailDto {
  to: string;
  subject?: string;
  template: string;
  context: any;
}
