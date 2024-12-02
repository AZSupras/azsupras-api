export class CreateEmailDto {
  to: string;
  subject?: string|null;
  template: string;
  context: any;
}
