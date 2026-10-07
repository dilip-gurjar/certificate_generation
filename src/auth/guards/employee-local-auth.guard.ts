import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EMPLOYEE_LOCAL_AUTH } from '../auth.constants';

@Injectable()
export class EmployeeLocalAuthGuard extends AuthGuard(EMPLOYEE_LOCAL_AUTH) {}
