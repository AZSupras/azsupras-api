import { InjectQueue } from '@nestjs/bull';
import { Request, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Queue } from 'bull';
import { HashService } from 'src/hash/hash.service';
import { IResponse } from 'src/interfaces/IResponse';
import { CreateSubscriberDto } from './create-subscriber.dto';
import { SubscriberService } from './subscriber.service';
import { Subscriber } from './subscriber.entity';

@Controller('subscriber')
export class SubscriberController {
  constructor(
    private readonly subscriberService: SubscriberService,
    private readonly hashService: HashService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  @Get('unsubscribe')
  async unsubscribe(
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

  @Post('subscribe')
  async subscribe(
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
