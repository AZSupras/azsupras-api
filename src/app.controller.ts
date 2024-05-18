import { Controller, Request, Body, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';
import { IResponse } from './interfaces/IResponse';
import { NewsletterSubscribeDto } from './email/newsletter-subscribe.dto';
import { Email } from './email/email.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('newsletter/subscribe')
  async subscribeNewsletter(
    @Request() req,
    @Body() newsletterSubscribeDto: NewsletterSubscribeDto,
  ): Promise<IResponse<any>> {
    let email: Email = await this.emailService.findSubscribedByEmail(
      newsletterSubscribeDto.email,
    );

    if (email) {
      const response: IResponse<any> = {
        statusCode: 400,
        message:
          'Email already subscribed, check your email inbox and spam folder.',
        data: null,
      };

      return response;
    }

    email = await this.emailService.create({
      to: newsletterSubscribeDto.email,
      subject: 'Newsletter Subscription',
      template: 'newsletter_subscription',
      context: {
        email: newsletterSubscribeDto.email,
        firstName: newsletterSubscribeDto.firstName,
        lastName: newsletterSubscribeDto.lastName,
        message: newsletterSubscribeDto.message,
      },
    });

    const response: IResponse<any> = {
      statusCode: 200,
      message: 'Newsletter subscription successful',
      data: email,
    };

    return response;
  }
}
