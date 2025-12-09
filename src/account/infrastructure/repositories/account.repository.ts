import { AccountRepositoryInterface } from '../../domain/repositories/account.repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository implements AccountRepositoryInterface {
    constructor(
    ) {}
}