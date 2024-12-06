import { ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class IsUserAlreadyExist implements ValidatorConstraintInterface {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    validate(username: string): Promise<boolean>;
    defaultMessage(): string;
}
