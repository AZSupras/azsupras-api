import { Controller, Request, Body, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';
import { IResponse } from './interfaces/IResponse';
import { SubscriberService } from './subscriber/subscriber.service';
import { CreateSubscriberDto } from './subscriber/create-subscriber.dto';
import { Subscriber } from './subscriber/subscriber.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { HashService } from './hash/hash.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
    private readonly subscriberService: SubscriberService,
    private readonly hashService: HashService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('subscriber/unsubscribe')
  async unsubscribeNewsletter(
    @Param('email') email: string,
    @Param('token') token: string,
  ) {
    let subscriber = await this.subscriberService.findOneByEmail(email);

    if (!subscriber) {
      const response: IResponse<Subscriber> = {
        statusCode: 404,
        message: 'Subscriber not found',
        data: null,
      };

      return response;
    }

    if (subscriber.unsubscribeToken !== token) {
      const response: IResponse<Subscriber> = {
        statusCode: 400,
        message: 'Invalid token',
        data: null,
      };

      return response;
    }

    subscriber = await this.subscriberService.unsubscribe(subscriber.id);

    const response: IResponse<Subscriber> = {
      statusCode: 200,
      message: 'Unsubscribed successfully',
      data: subscriber,
    };

    return response;
  }

  @Post('subscriber/subscribe')
  async subscribeNewsletter(
    @Request() req,
    @Body() newsletterSubscribeDto: CreateSubscriberDto,
  ): Promise<IResponse<Subscriber>> {
    let subscriber = await this.subscriberService.findOneByEmail(
      newsletterSubscribeDto.email,
    );

    if (subscriber) {
      const response: IResponse<Subscriber> = {
        statusCode: 400,
        message:
          'Email already subscribed, check your email inbox and spam folder.',
        data: null,
      };

      return response;
    }

    subscriber = await this.subscriberService.create({
      email: newsletterSubscribeDto.email,
      firstName: newsletterSubscribeDto.firstName,
      lastName: newsletterSubscribeDto.lastName,
      subscribed: true,
    });

    // send welcome email
    this.emailQueue.add({
      to: newsletterSubscribeDto.email,
      subject: 'Welcome to our platform',
      template: 'welcome',
      context: {
        email: newsletterSubscribeDto.email,
        firstName: newsletterSubscribeDto.firstName,
        lastName: newsletterSubscribeDto.lastName,
      },
    });

    // send newsletter subscription email
    this.emailQueue.add({
      to: newsletterSubscribeDto.email,
      subject: 'Newsletter Subscription',
      template: 'newsletter_subscription',
      context: {
        email: newsletterSubscribeDto.email,
        token: this.hashService.hashSync(subscriber.email),
        firstName: newsletterSubscribeDto.firstName,
        lastName: newsletterSubscribeDto.lastName,
      },
    });

    const response: IResponse<Subscriber> = {
      statusCode: 201,
      message: 'Subscription successful',
      data: subscriber,
    };

    return response;
  }
}
